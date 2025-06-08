import type { EntryGenerator, PageServerLoad } from './$types.ts';
import { captions } from '$lib/index.ts';

export const load = (async (event) => {
	const year = Number(event.params.year);
	const forward = String(year + 1);
	const back = String(year - 1);

	return {
		year: String(year),
		captions,
		forward: forward in captions ? forward : undefined,
		back: back in captions ? back : undefined
	};
}) satisfies PageServerLoad;

export const entries: EntryGenerator = () => {
	const slugs = new Set<{ year: string }>();

	for (const year in captions) {
		slugs.add({ year });
	}

	return Array.from(slugs);
};
