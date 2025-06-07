import type { PageServerLoad } from './$types.ts';
import { captions } from '$lib/index.ts';

export const load = (async (event) => {
	const year = Number(event.params.year);

	return {
		year: String(year),
		captions,
		forward: String(year + 1),
		back: String(year - 1)
	};
}) satisfies PageServerLoad;
