<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<div id="site-wrapper">
	<div id="content">
		<p>
			<a href="/">Christian IRL</a>
		</p>
		{@render children?.()}
	</div>
</div>

<style>
	#site-wrapper {
		height: 100vh;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#content {
		height: 80%;
		width: min(90%, 600px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
