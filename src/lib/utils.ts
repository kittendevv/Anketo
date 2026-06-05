import { db } from '$lib/server/db';
import { forms, formVersions } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function getLatestFormVersion(formId: string) {
	return db.query.formVersions.findFirst({
		where: eq(formVersions.formId, formId),
		orderBy: (t, { desc }) => [desc(t.version)]
	});
}

export async function getActiveFormSchema(formId: string) {
	const form = await db.query.forms.findFirst({
		where: eq(forms.id, formId)
	});

	if (!form) throw error(404, 'Form not found');

	const latest = await getLatestFormVersion(formId);

	if (!latest) throw error(500, 'Form has no versions');

	return {
		form,
		version: latest,
		schema: latest.content
	};
}

export async function getActiveFormSchemaBySlug(slug: string) {
	const form = await db.query.forms.findFirst({
		where: and(eq(forms.slug, slug), eq(forms.status, 'public'))
	});

	if (!form) throw error(404, 'Form not found');

	const version = await getLatestFormVersion(form.id);

	if (!version) throw error(500, 'Form has no versions');

	return {
		form,
		version,
		schema: version.content
	};
}
