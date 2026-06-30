import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { forms, submissions, formVersions } from '$lib/server/db/schema';
import { redirect, error } from '@sveltejs/kit';
import { and, eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		throw redirect(303, '/login');
	}

	const formRecord = await db.query.forms.findFirst({
		where: and(eq(forms.id, event.params.id), eq(forms.userId, session.user.id))
	});

	if (!formRecord) {
		throw error(404, 'Form not found or unauthorized');
	}

	// Get the latest form version to extract the schema (form fields)
	const latestVersion = await db.query.formVersions.findFirst({
		where: eq(formVersions.formId, formRecord.id),
		orderBy: (t, { desc }) => [desc(t.version)]
	});

	const formSubmissions = await db.query.submissions.findMany({
		where: eq(submissions.formId, formRecord.id),
		orderBy: (t, { desc }) => [desc(t.submittedAt)]
	});

	return {
		formId: event.params.id,
		submissions: formSubmissions,
		formSchema: latestVersion?.content ?? []
	};
};
