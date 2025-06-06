import { getCaption } from '$lib/server/captions.ts';
import type { PageServerLoad } from './$types.ts';

export const load = (async (event) => {
	console.log(await getCaption(event.fetch, '2024-01-01'));
	// const response = await event.fetch(`/api/all`);
	// const posts: Array<{
	// 	date: string;
	// 	caption: string;
	// }> = await response.json();

	// posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	// return { posts };
}) satisfies PageServerLoad;
