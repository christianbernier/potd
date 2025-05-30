<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';

	let { data } = $props();

	async function edit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();

		if (!event.target) {
			return;
		}

		const formData = new FormData(event.target as HTMLFormElement);
		formData.append('date', data.date);
		const response = await fetch((event.target as EventTarget & HTMLFormElement).action, {
			method: 'POST',
			body: formData
		});

		const result = deserialize(await response.text());

		if (result.type === 'success') {
			const pathDate = (formData.get('date') as string).replaceAll('-', '/');
			location.href = `/${pathDate}`;
		}

		applyAction(result);
	}
</script>

<h4>Edit post</h4>

<p>Date: {data.date}</p>
<form method="POST" enctype="multipart/form-data" onsubmit={edit}>
	<label for="caption">Caption:</label>
	<input name="caption" type="text" defaultValue={data.caption} required />
	<button>Edit</button>
</form>
