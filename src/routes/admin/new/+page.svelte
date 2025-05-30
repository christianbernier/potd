<script lang="ts">
	import { applyAction, deserialize } from "$app/forms";
	import { getCompressedImage, getTinyImage, FormState } from "$lib/index.js";
	import ImageSelector from "$lib/components/ImageSelector.svelte";

	let formState: FormState = $state(FormState.EDITING);
	
	async function submit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();

		if (!event.target) {
			return;
		}

		// compress the image in two formats: good quality and extra-compressed quality
		formState = FormState.COMPRESSING;
		const formData = new FormData(event.target as HTMLFormElement);
		const originalImage = formData.get('image') as File | null;
		const fullQualityImage = await getCompressedImage(originalImage, 1);
		const compressedImage = await getTinyImage(fullQualityImage);
		formData.delete('image');
		formData.append('fullQualityImage', fullQualityImage);
		formData.append('compressedImage', compressedImage);

		formState = FormState.UPLOADING;
		const response = await fetch((event.target as EventTarget & HTMLFormElement).action, {
			method: 'POST',
			body: formData,
		});

		const result = deserialize(await response.text());

		if (result.type === 'success') {
			const pathDate = (formData.get('date') as string).replaceAll('-', '/')
			location.href = `/${pathDate}`;
		}

		applyAction(result);
	}
</script>

<h4>New post</h4>

{#if formState === FormState.EDITING}
<form method="POST" enctype="multipart/form-data" onsubmit={submit}>
	<label for="date">Date:</label>
	<input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required>
	<ImageSelector name="image" required/>
	<label for="caption">Caption:</label>
	<input name="caption" type="text" required>
	<button>Upload</button>
</form>
{:else if formState === FormState.COMPRESSING}
	<p>compressing</p>
{:else if formState === FormState.UPLOADING}
	<p>uploading</p>
{/if}
