import { Post } from '$lib/server/index.ts';
import { json } from '@sveltejs/kit';

/**
 * GET all posts (their date and caption)
 * @returns a JSON representation of all posts' dates and captions
 */
export async function GET() {
	const results = await Post.findAll({
		attributes: ['date', 'caption']
	});
	return json(results);
}
