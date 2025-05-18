<script lang="ts">
	import NavBar from '$lib/NavBar.svelte';
	import YearCalendar from '$lib/YearCalendar.svelte';

  let { data } = $props();
</script>

<NavBar
  current={data.year}  
  back={data.back}
  forward={data.forward}
/>

<YearCalendar year={data.year} dates={data.dates} />
