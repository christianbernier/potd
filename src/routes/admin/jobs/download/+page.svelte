<script lang="ts">
	let { data } = $props();

	async function download(date: string) {
		const result = await fetch(`/api/posts/${date}`);
		const data = await result.json();

		const imageByteArray = new Uint8Array(data.image_compressed.data);

		const aTag = document.createElement('a');
		aTag.href = URL.createObjectURL(new Blob([imageByteArray], { type: 'image/jpg' }));
		aTag.download = `${date}.jpg`;
		aTag.click();
	}

	async function downloadAll() {
		data.posts.forEach(async (post) => {
			await download(post.date);
		});
	}
</script>

<h4>Download</h4>
<div>
	<button onclick={() => downloadAll()}>Download all</button>
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
					<td><button onclick={() => download(post.date)}>Download</button></td>
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
