import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const actions = {
	// log out action
	default: async ({ cookies }) => {
		cookies.delete('token', { path: '/' });
		redirect(302, '/login');
	}
} satisfies Actions;
