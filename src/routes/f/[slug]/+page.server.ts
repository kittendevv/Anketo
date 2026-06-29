import { db } from '$lib/server/db';
import { submissions } from '$lib/server/db/schema';
import { parse } from '$lib/parser';
import { getActiveFormSchemaBySlug } from '$lib/utils';
import type { Actions } from './$types';
import type { FormField } from '$lib/form/types';

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
		const rawData = Object.fromEntries(formData.entries());

		const { form, version, schema } = await getActiveFormSchemaBySlug(event.params.slug);

		const parsedSchema = parse(schema);

		const transformedData: Record<string, string> = {};

		const fieldsWithLabels = parsedSchema.content.filter(
			(item): item is FormField & { label: string } =>
				item && typeof item === 'object' && 'label' in item && typeof item.label === 'string'
		);

		for (const field of fieldsWithLabels) {
			const fieldId = field.id || field.label;
			const value = rawData[field.label];
			if (value && typeof value === 'string' && value !== '') {
				transformedData[fieldId] = value;
			}
		}

		await db.insert(submissions).values({
			id: crypto.randomUUID(),
			formId: form.id,
			formVersion: version.version,
			data: transformedData
		});

		return { success: true };
	}
};
