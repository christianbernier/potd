<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	async function deletePost(date: string) {
		if (!confirm(`Are you sure you'd like to delete ${date}?`)) {
			return;
		}

		const result = await fetch(`/api/posts/${date}`, {
			method: 'DELETE'
		});

		if (result.ok) {
			await invalidateAll();
		} else {
			alert(`Error deleting ${date}: ${await result.json()}`);
		}
	}
</script>

<h4>Delete post</h4>
<div>
	<table>
		<thead>
			<tr>
				<th>Date</th>
				<th>Caption</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each data.posts as post}
				<tr>
					<td>{post.date}</td>
					<td>{post.caption}</td>
					<td><button onclick={() => deletePost(post.date)}>Delete</button></td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	div {
		height: 100%;
		width: 100%;
		overflow-y: auto;
	}
</style>
