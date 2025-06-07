<script lang="ts">
	const {
		key,
		text,
		url
	}: {
		key?: string;
		text: string;
		url?: string;
	} = $props();

	async function onKeyDown(e: KeyboardEvent) {
		if (e.key === key && url) {
			e.preventDefault();
			window.location.href = url;
		}
	}
</script>

<svelte:window on:keydown={onKeyDown} />
<a
	data-sveltekit-preload-data
	data-disabled={url === undefined} 
	href={url}
>
	{text}
</a>

<style>
	a {
		color: black;
		/* text-decoration: none; */
	}

	a[data-disabled='true'] {
		color: gray;
	}
</style>
