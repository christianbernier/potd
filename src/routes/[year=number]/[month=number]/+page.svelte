<script lang="ts">
	import MonthCalendar from '$lib/components/MonthCalendar.svelte';
	import NavBar from '$lib/components/NavBar.svelte';

  let { data } = $props();
</script>

<NavBar
  current={data.monthStr.replaceAll('-', '/')}  
  back={data.back}
  forward={data.forward}
  up={data.up}
/>
<MonthCalendar monthStr={data.monthStr} posts={data.posts} />
