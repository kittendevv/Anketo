import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { forms, formVersions } from '$lib/server/db/schema';
import { redirect, error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) throw redirect(303, '/login');

	const form = await db.query.forms.findFirst({
		where: and(eq(forms.id, event.params.id), eq(forms.userId, session.user.id))
	});

	if (!form) throw error(404, 'Not found');

	const latestVersion = await db.query.formVersions.findFirst({
		where: eq(formVersions.formId, form.id),
		orderBy: (t, { desc }) => [desc(t.version)]
	});

	if (!latestVersion) throw error(500, 'Form has no versions');

	return {
		form,
		latestVersion
	};
};

export const actions: Actions = {
	save: async (event) => {
		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		if (!session) throw redirect(303, '/login');

		const data = await event.request.formData();
		const content = data.get('content') as string;
		const title = data.get('title') as string;
		const status = data.get('status') as 'draft' | 'public';

		const form = await db.query.forms.findFirst({
			where: and(eq(forms.id, event.params.id), eq(forms.userId, session.user.id))
		});

		if (!form) throw redirect(303, '/login');

		const latest = await db.query.formVersions.findFirst({
			where: eq(formVersions.formId, form.id),
			orderBy: (t, { desc }) => [desc(t.version)]
		});

		const isChanged = !latest || latest.content !== content;
		const nextVersion = isChanged ? form.version + 1 : form.version;

		await db.transaction(async (tx) => {
			await tx
				.update(forms)
				.set({
					title,
					status,
					version: nextVersion
				})
				.where(eq(forms.id, form.id));

			if (isChanged) {
				await tx.insert(formVersions).values({
					id: nanoid(),
					formId: form.id,
					version: nextVersion,
					content
				});
			}
		});

		throw redirect(303, `/dashboard/forms/${form.id}`);
	},

	publish: async (event) => {
		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		if (!session) throw redirect(303, '/login');

		await db
			.update(forms)
			.set({
				status: 'public'
			})
			.where(and(eq(forms.id, event.params.id), eq(forms.userId, session.user.id)));

		throw redirect(303, `/dashboard/forms/${event.params.id}`);
	},

	unpublish: async (event) => {
		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		if (!session) throw redirect(303, '/login');

		await db
			.update(forms)
			.set({
				status: 'draft'
			})
			.where(and(eq(forms.id, event.params.id), eq(forms.userId, session.user.id)));

		throw redirect(303, `/dashboard/forms/${event.params.id}`);
	}
};
