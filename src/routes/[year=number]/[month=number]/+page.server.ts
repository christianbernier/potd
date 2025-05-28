import { error, redirect, type NumericRange } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.ts';
import { constructDateString, getMonthPathOffset } from '$lib/date.js';

export const load = (async (event) => {
	// ensure leading zero
	if (event.params.month.length === 1) {
		redirect(301, `/${event.params.year}/0${event.params.month}`)
	}

	const monthStr = constructDateString([event.params.year, event.params.month])

	// get neighbor paths
	const forward = getMonthPathOffset(monthStr, 1)
	const back = getMonthPathOffset(monthStr, -1)
	const up = `/${event.params.year}`

	// get images for this month
	const response = await event.fetch(`/api/months/${monthStr}`);
	const posts = await response.json();
	if (!response.ok) {
		error(response.status as NumericRange<400, 599>, posts.message);
	}

	return {
		posts,
		monthStr,
		forward,
		back,
		up
	}
}) satisfies PageServerLoad;
