<script lang="ts">
	import NavBar from '$lib/NavBar.svelte';

  let { data } = $props();

  let image: HTMLImageElement;

  // link the image dynamically when the div mounts, since we just have the bytes for the image
  $effect(() => {
    const url = URL.createObjectURL(new Blob([data.imageByteArray], { type: 'image/png' }));
    image.src = url;
  })

</script>

<div>
  <NavBar
    current={data.current}
    back={data.back}
    forward={data.forward}
    up={data.up}
  />
  <img bind:this={image} alt={data.caption}>
  <p>{data.caption}</p>
</div>

<style>
  div, img {
    max-width: 100%;
    max-height: 100%;

    display: flex;
    flex-direction: column;
  }

  p {
    margin: var(--margin-lg) 0;
  }
</style>
