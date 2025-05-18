import { error, type Actions, type NumericRange } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types.js';

export const load = (async (event) => {
  const date = event.params.date;
  const response = await event.fetch(`/api/posts/${date}?noimage=true`);
	const post: {
    date: string,
    caption: string,
  } = await response.json();
  return {
    date,
    caption: post.caption
  }
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();
    const date = data.get('date') as string;

    const response = await fetch(`/api/posts/${date}`, {
      method: 'PATCH',
      body: data,
    })

    if (!response.ok) {
			error(response.status as NumericRange<400, 599>, await response.json());
		}
	}
} satisfies Actions;
