import { env, isAuthenticated } from '$lib/server/index.js';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load = (async (event) => {
	if (isAuthenticated(event.cookies)) {
		redirect(302, '/admin');
	}
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username') || '';
		const password = formData.get('password') || '';

		// ensure the login is correct
		if (username !== env.AUTH_USERNAME || password !== env.AUTH_PASSWORD) {
			error(403, { message: 'Invalid login.' });
		}

		// add a cookie so the user doesn't always have to log in
		const expiration = new Date();
		expiration.setUTCMonth(expiration.getUTCMonth() + 1); // expire after 1 month
		cookies.set('token', env.AUTH_TOKEN || '', {
			path: '/',
			httpOnly: true,
			secure: true,
			expires: expiration
		});

		return { success: true };
	}
} satisfies Actions;
