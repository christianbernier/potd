<script lang="ts">
	import { page } from '$app/state';
	import { getTinyImage } from '$lib/index.js';

  let { data } = $props();

  let originalImageElement: HTMLImageElement;
  let compressedImageElement: HTMLImageElement;

  async function sync(post: {
    id: string;
    date: string;
    imageBuffer: any;
    title: string;
    caption: string;
  }) {
    const formData = new FormData()
    const fullQualityImageByteArray = new Uint8Array(post.imageBuffer);
    const fullQualityImage = new File([fullQualityImageByteArray], 'tmp', { type: 'image/png' })
    originalImageElement.src = URL.createObjectURL(fullQualityImage)
		const compressedImage = await getTinyImage(fullQualityImage);
    compressedImageElement.src = URL.createObjectURL(compressedImage)
    
    formData.append('date', post.date)
    formData.append('caption', post.title)
		formData.append('fullQualityImage', fullQualityImage);
		formData.append('compressedImage', compressedImage);

    await fetch(page.url.pathname, {
			method: 'POST',
			body: formData,
		})
  }

  async function syncAll() {
    data.posts.forEach(async post => {
      await sync(post)
    })
  }
</script>

<div>
  <img bind:this={originalImageElement} alt='' >
  <img bind:this={compressedImageElement} alt='' >

  <button onclick={() => syncAll()}>Sync all</button>
  <table>
    <tbody>
      {#each data.posts as post}
        <tr>
          <td>{post.id}</td>
          <td>{post.imageBuffer.byteLength}</td>
          <td>{post.date}</td>
          <td>{post.title}</td>
          <td>{post.caption}</td>
          <td><button onclick={() => sync(post)}>Sync</button></td>
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

  img {
    width: 400px;
  }
</style>