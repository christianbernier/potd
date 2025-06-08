import { error, redirect } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types.js';
import { captions, constructDateString, getDatePathOffset } from '$lib/index.ts';

function doesPostExist(path: string) {
	const [_, year, month, day] = path.split('/');
	return captions[year]?.[month]?.[day] !== undefined;
}

export const load = (async (event) => {
	const [year, month, day] = [event.params.year, event.params.month, event.params.day];
	const date = constructDateString([year, month, day]);

	// ensure leading zeros
	const expectedPath = getDatePathOffset(date, 0);
	if (event.url.pathname !== expectedPath) {
		redirect(301, expectedPath);
	}

	// check the neighboring dates to see if they have posts
	const forward = getDatePathOffset(date, 1);
	const back = getDatePathOffset(date, -1);
	const up = `/${event.params.year}/${event.params.month}`;

	const caption = captions[year]?.[month]?.[day];

	if (caption === undefined) {
		error(404, 'No image for this date.');
	}

	return {
		date,
		caption,
		current: date.replaceAll('-', '/'),
		forward: doesPostExist(forward) ? forward : undefined,
		back: doesPostExist(back) ? back : undefined,
		up
	};
}) satisfies PageServerLoad;

export const entries: EntryGenerator = () => {
	const slugs = new Set<{ year: string; month: string; day: string }>();

	for (const year in captions) {
		for (const month in captions[year]) {
			for (const day in captions[year][month]) {
				slugs.add({ year, month, day });
				slugs.add({ year, month, day: String(Number(day)) });
				slugs.add({ year, month: String(Number(month)), day });
				slugs.add({ year, month: String(Number(month)), day: String(Number(day)) });
			}
		}
	}

	return Array.from(slugs);
};
