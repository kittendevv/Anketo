import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { forms } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) throw redirect(303, '/login');

	const userForms = await db.select().from(forms).where(eq(forms.userId, session.user.id));

	return { forms: userForms };
};

export const actions = {
	delete: async (event) => {
		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		if (!session) throw redirect(303, '/login');

		const data = await event.request.formData();
		const formId = data.get('id');

		if (typeof formId === 'string') {
			await db.delete(forms).where(and(eq(forms.id, formId), eq(forms.userId, session.user.id)));
		}

		return { success: true };
	}
} satisfies Actions;
