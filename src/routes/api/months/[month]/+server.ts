import { constructDateString, deconstructDateString } from '$lib/index.ts';
import { getPostDatesWithinTimeframe } from '$lib/server/index.ts';
import { json } from '@sveltejs/kit';

/**
 * GET the dates of all posts posted within a given month.
 * @param month the month string (YYYY-MM) of the month to obtain
 * @returns an array of strings in YYYY-MM-DD format representing each post
 * from the provided month
 */
export async function GET({ params }) {
	const startDateString = constructDateString([...deconstructDateString(params.month), '01']);
	const start = new Date(startDateString);
	const end = new Date(startDateString);
	end.setUTCMonth(end.getUTCMonth() + 1);
	const dates = await getPostDatesWithinTimeframe(start, end);
	return json(dates);
}
