import { isAuthenticated } from '$lib/server/authenticate.js';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types.js';

export const load = (async (event) => {
  if (!isAuthenticated(event.cookies)) {
    redirect(302, '/login')
  }
}) satisfies LayoutServerLoad;
