import { db } from '$lib/server/db';
import { submissions } from '$lib/server/db/schema';
import { parse } from '$lib/parser';
import { getActiveFormSchemaBySlug } from '$lib/utils';
import type { Actions } from './$types';

export const load = async (event) => {
	const { form, schema } = await getActiveFormSchemaBySlug(event.params.slug);

	return {
		form,
		parsed: parse(schema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const submittedData = Object.fromEntries(formData.entries());

		const { form, version } = await getActiveFormSchemaBySlug(event.params.slug);

		await db.insert(submissions).values({
			id: crypto.randomUUID(),
			formId: form.id,
			formVersion: version.version,
			data: submittedData
		});

		return { success: true };
	}
};
