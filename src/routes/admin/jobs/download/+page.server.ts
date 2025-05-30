import type { PageServerLoad } from './$types.js';

export const load = (async (event) => {
	const response = await event.fetch(`/api/all`);
	const posts: Array<{
		date: string;
		caption: string;
	}> = await response.json();

	posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	return { posts };
}) satisfies PageServerLoad;
