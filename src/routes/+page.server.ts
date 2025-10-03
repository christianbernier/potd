import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { captions } from '$lib/index.js';

function descending(a: number, b: number) {
	return b - a;
}

function noPosts() {
	error(500, { message: 'Cannot find any posts!' });
}

// automatically go to the last month with posts upon load
export const load = (async () => {
	const lastYear = Object.keys(captions)
		.map(Number)
		.sort(descending)
		.at(0)
		|| noPosts();

	const lastMonth = Object.keys(captions[String(lastYear)] ?? {})
		.map(Number)
		.sort(descending)
		.at(0)
		|| noPosts();

	redirect(302, `/${lastYear}/${lastMonth}`);
}) satisfies PageServerLoad;
