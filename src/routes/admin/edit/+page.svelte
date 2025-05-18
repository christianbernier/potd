<script lang="ts">
	let { data } = $props();
</script>

<h4>Edit post</h4>
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
					<td><a href={`/admin/edit/${post.date}`}>Edit</a></td>
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
