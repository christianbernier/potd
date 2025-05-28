import { error, type NumericRange } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.ts';

export const load = (async (event) => {
	const year = Number(event.params.year)

	// get post history for the year
	const response = await event.fetch(`/api/year/${year}`);
	const posts = await response.json();

	if (!response.ok) {
		error(response.status as NumericRange<400, 599>, posts.message);
	}

	// construct the list of months
	const dates = Array.from(new Array(12), () => new Set<string>())

	posts.forEach((post: { date: string }) => {
		const month = Number(post.date.substring(5, 7))
		dates[month - 1].add(post.date)
	})

	return {
		year: String(year),
		dates,
		forward: String(year + 1),
		back: String(year - 1)
	}
}) satisfies PageServerLoad;
