<script lang="ts">
	import MonthCalendar from '$lib/MonthCalendar.svelte';
	import NavBar from '$lib/NavBar.svelte';

  let { data } = $props();
</script>

<NavBar
  current={data.monthStr.replaceAll('-', '/')}  
  back={data.back}
  forward={data.forward}
  up={data.up}
/>
<MonthCalendar monthStr={data.monthStr} dates={data.dates} />
