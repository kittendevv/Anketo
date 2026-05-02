import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { forms } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) throw redirect(303, '/login');

	const userForms = await db.select().from(forms).where(eq(forms.userId, session.user.id));

	return { forms: userForms };
};
