import { redirect } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types.ts';
import { captions, constructDateString, getMonthPathOffset } from '$lib/index.ts';

function doesMonthHavePosts(path: string) {
	const [_, year, month] = path.split('/');
	return captions[year]?.[month] !== undefined;
}

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
		forward: doesMonthHavePosts(forward) ? forward : undefined,
		back: doesMonthHavePosts(back) ? back : undefined,
		up
	};
}) satisfies PageServerLoad;

export const entries: EntryGenerator = () => {
	const slugs = new Set<{ year: string; month: string }>();

	for (const year in captions) {
		for (const month in captions[year]) {
			slugs.add({ year, month });
			slugs.add({ year, month: String(Number(month)) });
		}
	}

	return Array.from(slugs);
};
