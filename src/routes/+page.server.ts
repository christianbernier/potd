import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { padDatePart } from '$lib/index.js';

// automatically go to the current month upon load
export const load = (async () => {
	const now = new Date();
	const year = String(now.getFullYear());
	const month = padDatePart(now.getMonth() + 1);

	redirect(302, `/${year}/${month}`);
}) satisfies PageServerLoad;
