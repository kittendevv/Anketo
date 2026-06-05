import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { forms, formVersions, submissions, formViews } from '$lib/server/db/schema';
import { parse } from '$lib/parser';
import { redirect, error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({ headers: event.request.headers });
	if (!session) throw redirect(303, '/login');

	const formRecord = await db.query.forms.findFirst({
		where: and(eq(forms.id, event.params.id), eq(forms.userId, session.user.id))
	});
	if (!formRecord) throw error(404, 'Form not found or unauthorized');

	const [formSubmissions, views] = await Promise.all([
		db.query.submissions.findMany({
			where: eq(submissions.formId, formRecord.id),
			orderBy: (t, { desc }) => [desc(t.submittedAt)]
		}),
		db.query.formViews.findMany({
			where: eq(formViews.formId, formRecord.id),
			orderBy: (t, { asc }) => [asc(t.createdAt)]
		})
	]);

	const submissionsWithSchema = await Promise.all(
		formSubmissions.map(async (s) => {
			const version = await db.query.formVersions.findFirst({
				where: and(eq(formVersions.formId, formRecord.id), eq(formVersions.version, s.formVersion))
			});
			return { ...s, schema: version ? parse(version.content).content : null };
		})
	);

	return { submissions: submissionsWithSchema, views };
};

export const actions: Actions = {
	saveView: async (event) => {
		const session = await auth.api.getSession({ headers: event.request.headers });
		if (!session) throw redirect(303, '/login');

		const fd = await event.request.formData();
		const id = fd.get('id') as string | null;
		const name = fd.get('name') as string;
		const config = JSON.parse(fd.get('config') as string);

		if (id) {
			await db.update(formViews).set({ name, config }).where(eq(formViews.id, id));
		} else {
			await db.insert(formViews).values({
				id: crypto.randomUUID(),
				formId: event.params.id,
				name,
				config
			});
		}
	},

	deleteView: async (event) => {
		const session = await auth.api.getSession({ headers: event.request.headers });
		if (!session) throw redirect(303, '/login');

		const fd = await event.request.formData();
		const id = fd.get('id') as string;
		await db.delete(formViews).where(eq(formViews.id, id));
	}
};
