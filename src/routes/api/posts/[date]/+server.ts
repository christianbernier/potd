import { addFileToRepository, createBranch, deleteBranch, deleteFileFromRepository, fileToBase64, mergeBranch } from '$lib/server/index.ts';
import { error, json } from '@sveltejs/kit';

/**
 * POST a new post with the provide date, caption, and image.
 * @param date the date of the new post
 * @param formData the data from the creation form (including caption and images)
 * @returns the result of creating the post
 */
export async function POST({ params, request }) {
	const date = params.date;

	// ensure the post does not already exist
	// if (await doesPostExist(date)) {
	// 	error(400, { message: `Post with date ${date} already exists.` });
	// }

	// extract the post information
	const formData = await request.formData();
	const caption = formData.get('caption') as string;
	const fullQualityImage = formData.get('fullQualityImage') as File;
	const compressedImage = formData.get('compressedImage') as File;
	const fullQualityBase64 = await fileToBase64(fullQualityImage);
	const compressedBase64 = await fileToBase64(compressedImage);

	// add the image to Github
	await createBranch(date);
	await addFileToRepository(fullQualityBase64, `static/fullQuality/${date}.jpeg`, date, true);
	await addFileToRepository(compressedBase64, `static/previews/${date}.jpeg`, date, true);
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
	// const existingPost = await getPost(date);

	// // ensure the post actually exists first
	// if (existingPost === null) {
	// 	error(404, { message: 'Post does not exist.' });
	// }

	await Post.destroy({ where: { date } });

	// delete the image from Github
	const branchName = `delete-${date}`
	await createBranch(branchName);
	await deleteFileFromRepository(`static/fullQuality/${date}.jpeg`, branchName);
	await deleteFileFromRepository(`static/previews/${date}.jpeg`, branchName);
	await mergeBranch(branchName);
	await deleteBranch(branchName);

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
	// const existingPost = await getPost(date);

	// // ensure the post exists
	// if (existingPost === null) {
	// 	error(404, { message: 'Post does not exist.' });
	// }

	// extract the new caption to update
	const formData = await request.formData();
	const caption = formData.get('caption') as string;

	await Post.update({ caption }, { where: { date } });

	return json({ success: true });
}
