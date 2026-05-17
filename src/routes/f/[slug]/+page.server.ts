import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { forms, submissions } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { parse } from '$lib/parser';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const form = await db.query.forms.findFirst({
		where: and(eq(forms.slug, event.params.slug), eq(forms.status, 'public'))
	});

	if (!form) {
		error(404, 'Form not found or is no longer public.');
	}

	// Parse it on the server so the frontend doesn't have to do the heavy lifting
	const parsed = parse(form.content);

	return { form, parsed };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const submittedData = Object.fromEntries(formData.entries());

		const formRecord = await db.query.forms.findFirst({
			columns: { id: true, content: true },
			where: and(eq(forms.slug, event.params.slug), eq(forms.status, 'public'))
		});

		if (!formRecord) {
			error(404, 'Form not found');
		}

		await db.insert(submissions).values({
			id: crypto.randomUUID(),
			formId: formRecord.id,
			data: submittedData,
			snapshot: parse(formRecord.content)
		});

		return { success: true };
	}
};
