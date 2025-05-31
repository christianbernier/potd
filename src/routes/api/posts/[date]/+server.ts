import { addFileToRepository, createBranch, deleteBranch, mergeBranch, Post } from '$lib/server/index.ts';
import { error, json } from '@sveltejs/kit';

/**
 * Gets the post with the provided date string.
 * @param dateStr the date string (YYYY-MM-DD) of the post to get
 * @returns a promise of the post, or null if it does not exist
 */
async function getPost(dateStr: string): Promise<Post | null> {
	return await Post.findOne({
		attributes: ['date', 'caption'],
		where: {
			date: dateStr
		}
	});
}

/**
 * Does the post with the provided date string exist?
 * @param dateStr the date string (YYYY-MM-DD) of the post
 * @returns whether that post exists
 */
async function doesPostExist(dateStr: string) {
	const post = await getPost(dateStr);
	return post !== null;
}

/**
 * GET the post with the provided date.
 * @param date the date string (YYYY-MM-DD) of the post to obtain
 * @returns the post object with the provided date
 */
export async function GET({ params }) {
	const date = params.date;
	const result = await getPost(date);

	if (result === null) {
		error(404, { message: 'Post does not exist.' });
	}

	return json(result);
}

/**
 * POST a new post with the provide date, caption, and image.
 * @param date the date of the new post
 * @param formData the data from the creation form (including caption and images)
 * @returns the result of creating the post
 */
export async function POST({ params, request }) {
	const date = params.date;

	// ensure the post does not already exist
	if (await doesPostExist(date)) {
		error(400, { message: `Post with date ${date} already exists.` });
	}

	// extract the post information
	const formData = await request.formData();
	const caption = formData.get('caption') as string;
	const fullQualityImage = formData.get('fullQualityImage') as File;
	const compressedImage = formData.get('compressedImage') as File;

	// add the image to Github
	await createBranch(date);
	await addFileToRepository(fullQualityImage, `static/fullQuality/${date}.jpeg`, date);
	await addFileToRepository(compressedImage, `static/previews/${date}.jpeg`, date);
	await mergeBranch(date);
	await deleteBranch(date);

	// create the database entry
	const post = await Post.create({ date, caption });

	return json(post);
}

/**
 * DELETE the post with the provided date.
 * @param date the date string (YYYY-MM-DD) of the post to delete
 * @returns a promise which resolves to an object with success set to true
 */
export async function DELETE({ params }) {
	const date = params.date;
	const existingPost = await getPost(date);

	// ensure the post actually exists first
	if (existingPost === null) {
		error(404, { message: 'Post does not exist.' });
	}

	await Post.destroy({ where: { date } });

	return json({ success: true });
}

/**
 * PATCH an existing post with a new caption.
 * @param date the date string (YYYY-MM-DD) of the post to update
 * @param formData the data from the update form with the new caption
 * @returns a promise which resolves to an object with success set to true
 */
export async function PATCH({ request, params }) {
	const date = params.date;
	const existingPost = await getPost(date);

	// ensure the post exists
	if (existingPost === null) {
		error(404, { message: 'Post does not exist.' });
	}

	// extract the new caption to update
	const formData = await request.formData();
	const caption = formData.get('caption') as string;

	await Post.update({ caption }, { where: { date } });

	return json({ success: true });
}
