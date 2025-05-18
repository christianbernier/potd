import { error, type Actions, type NumericRange } from '@sveltejs/kit';
import { BlogV1Post } from '$lib/server/db_v1.js';
import type { PageServerLoad } from './$types.js';

export const load = (async (event) => {
  const page = Number(event.params.page);
  let results: Array<BlogV1Post> = await BlogV1Post.findAll()
  results = results.slice(page * 50, (page + 1) * 50)

  const posts = await Promise.all(results.map(async post => {
    const imgData = await event.fetch(post.image_location);
    const imgBuffer = await imgData.arrayBuffer();
    
    return {
      id: post.id,
      date: post.published_on,
      imageBuffer: imgBuffer,
      title: post.title,
      caption: post.caption,
    }
  }))

  posts.sort((a, b) => (new Date(a.date).getTime() - new Date(b.date).getTime()))

  return { posts }
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, fetch }) => {
    const data = await request.formData();
    const date = data.get('date') as string;
    
    const response = await fetch(`/api/posts/${date}`, {
      method: 'POST',
      body: data,
    })

    if (!response.ok) {
      error(response.status as NumericRange<400, 599>, await response.json());
    }
  }
} satisfies Actions;
