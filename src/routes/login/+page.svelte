<script lang="ts">
	import type { PageProps } from './$types.js';

	let { form }: PageProps = $props();
</script>

<div>
	<p>Admin log in</p>
	<form method="POST" enctype="multipart/form-data">
		<input name="username" type="text" placeholder="Username" required />
		<input name="password" type="password" placeholder="Password" required />
		<button>Log in</button>
	</form>

	{#if form?.success}
		<p>
			Logged in!
			<a href="/admin">Admin portal</a>
		</p>
	{/if}
</div>

<style>
	div {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
