import { captions } from '$lib/captions.ts';
import { deconstructDateString } from '$lib/date.ts';
import { addFileToRepository, createBranch, deleteBranch, fileToBase64, mergeBranch } from '$lib/server/index.ts';
import { error, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const date = formData.get('date') as string;
		const [year, month, day] = deconstructDateString(date);

		const exists = (await fetch(`/${date.replaceAll('-', '/')}`)).ok;

		if (exists) {
			error(400, { message: 'Post already exists.' })
		}

		// extract the post information
		const caption = formData.get('caption') as string;
		const fullQualityImage = formData.get('fullQualityImage') as File;
		const compressedImage = formData.get('compressedImage') as File;
		const fullQualityBase64 = await fileToBase64(fullQualityImage);
		const compressedBase64 = await fileToBase64(compressedImage);

		const newCaptionsObject = JSON.parse(JSON.stringify(captions))
		
		if (!(year in newCaptionsObject)) {
			newCaptionsObject[year] = {}
		}

		if (!(month in newCaptionsObject[year])) {
			newCaptionsObject[year][month] = {}
		}

		newCaptionsObject[year][month][day] = caption
		const newCaptionsBase64 = Buffer.from(JSON.stringify(newCaptionsObject)).toString('base64')

		// add the image to Github

		await createBranch(date);
		await addFileToRepository(fullQualityBase64, `static/fullQuality/${date}.jpeg`, date, true);
		await addFileToRepository(compressedBase64, `static/previews/${date}.jpeg`, date, true);
		await addFileToRepository(newCaptionsBase64, `src/lib/captions.json`, date, false);
		await mergeBranch(date);
		await deleteBranch(date);
	}
} satisfies Actions;
