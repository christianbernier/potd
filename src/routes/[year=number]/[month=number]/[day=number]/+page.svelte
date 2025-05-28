<script lang="ts">
	import NavBar from '$lib/NavBar.svelte';

  let { data } = $props();
</script>

<div>
  <NavBar
    current={data.current}
    back={data.back}
    forward={data.forward}
    up={data.up}
  />
  <img src={`/fullQuality/${data.date}.jpg`} alt={data.caption} >
  <p>{data.caption}</p>
</div>

<style>
  div {
    max-width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  img {
    max-width: 100%;
    max-height: 70vh;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  p {
    margin: var(--margin-lg) 0;
  }
</style>
