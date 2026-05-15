import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { forms } from '$lib/server/db/schema';

import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		throw redirect(303, '/login');
	}

	const form = await db.query.forms.findFirst({
		where: and(eq(forms.id, event.params.id), eq(forms.userId, session.user.id))
	});

	if (!form) {
		throw error(404, 'Form not found');
	}

	return {
		form
	};
};
