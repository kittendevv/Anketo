import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { forms, formVersions } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { nanoid } from 'nanoid';

export const actions = {
	save: async (event) => {
		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		if (!session) throw redirect(303, '/login');

		const data = await event.request.formData();
		const content = data.get('content') as string;
		const title = data.get('title') as string;
		const status = data.get('status') as 'draft' | 'public';

		const formId = nanoid();
		const version = 1;

		await db.transaction(async (tx) => {
			await tx.insert(forms).values({
				id: formId,
				userId: session.user.id,
				title,
				slug: nanoid(8),
				version,
				status
			});

			await tx.insert(formVersions).values({
				id: nanoid(),
				formId,
				version,
				content
			});
		});

		throw redirect(303, `/dashboard/forms/${formId}`);
	}
} satisfies Actions;
