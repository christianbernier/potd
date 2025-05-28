import { error, redirect, type NumericRange } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.ts';
import { constructDateString, getDatePathOffset } from '$lib/date.js';

export const load = (async (event) => {
  const date = constructDateString([event.params.year, event.params.month, event.params.day])

	// ensure leading zeros
	const expectedPath = getDatePathOffset(date, 0)
	if (event.url.pathname !== expectedPath) {
		redirect(301, expectedPath)
	}

	// check the neighboring dates to see if they have posts
	const forward = getDatePathOffset(date, 1)
	const forwardRes = await event.fetch(`/api/posts/${forward.replaceAll('/', '-')}`)
	const back = getDatePathOffset(date, -1)
	const backRes = await event.fetch(`/api/posts/${back.replaceAll('/', '-')}`)
	const up = `/${event.params.year}/${event.params.month}`

	// get this date's post
	const response = await event.fetch(`/api/posts/${date}`);
	const post = await response.json();
	
	if (!response.ok) {
		error(response.status as NumericRange<400, 599>, post.message);
	}

	if (post === null) {
		error(404, 'No image for this date.')
	}
	
	return {
		date,
		caption: post.caption,
		current: date.replaceAll('-', '/'),
		forward: forwardRes.ok ? forward : undefined,
		back: backRes.ok ? back : undefined,
		up,
	};
}) satisfies PageServerLoad;
