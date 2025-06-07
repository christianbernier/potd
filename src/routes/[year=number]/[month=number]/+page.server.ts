import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.ts';
import { captions, constructDateString, getMonthPathOffset } from '$lib/index.ts';

export const load = (async (event) => {
	const [year, month] = [event.params.year, event.params.month];

	// ensure leading zero
	if (month.length === 1) {
		redirect(301, `/${year}/0${month}`);
	}

	const monthStr = constructDateString([year, month]);

	// get neighbor paths
	const forward = getMonthPathOffset(monthStr, 1);
	const back = getMonthPathOffset(monthStr, -1);
	const up = `/${year}`;

	return {
		posts: captions[year]?.[month] || {},
		monthStr,
		forward,
		back,
		up
	};
}) satisfies PageServerLoad;
