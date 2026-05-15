import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { forms } from '$lib/server/db/schema';
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

		await db.insert(forms).values({
			id: nanoid(),
			userId: session.user.id,
			title,
			slug: nanoid(8),
			content,
			status
		});

		throw redirect(303, '/dashboard');
	}
} satisfies Actions;
