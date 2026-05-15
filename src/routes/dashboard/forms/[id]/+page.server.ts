import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { forms } from '$lib/server/db/schema';
import { redirect, error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) throw redirect(303, '/login');

	const form = await db.query.forms.findFirst({
		where: and(eq(forms.id, event.params.id), eq(forms.userId, session.user.id))
	});

	if (!form) throw error(404, 'Not found');

	return { form };
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

		await db
			.update(forms)
			.set({
				title,
				content,
				status
			})
			.where(and(eq(forms.id, event.params.id), eq(forms.userId, session.user.id)));

		throw redirect(303, `/dashboard/forms/${event.params.id}`);
	},
	publish: async (event) => {
		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		if (!session) throw redirect(303, '/login');

		const data = await event.request.formData();

		const content = data.get('content') as string;
		const title = data.get('title') as string;

		await db
			.update(forms)
			.set({
				title,
				content,
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
