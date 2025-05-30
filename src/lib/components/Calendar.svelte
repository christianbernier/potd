<script lang="ts">
	import { constructDateString, deconstructDateString } from '$lib/index.ts';
	import type { Snippet } from 'svelte';

	let { monthStr, dates }: { monthStr: string; dates: Snippet<[number]> } = $props();

	// calculate properties of this month using JS date objects
	let firstDay = $derived.by(
		() => new Date(constructDateString([...deconstructDateString(monthStr), '01']))
	);
	let firstDayOfWeek = $derived(firstDay.getUTCDay());
	let daysInMonth = $derived.by(() => {
		let lastDay = new Date(firstDay.getTime());
		lastDay.setUTCMonth(lastDay.getUTCMonth() + 1);
		lastDay.setUTCDate(lastDay.getUTCDate() - 1);
		return lastDay.getUTCDate();
	});
</script>

<div class="wrapper">
	{#each new Array((firstDayOfWeek + 6) % 7) as _}
		<div class="day blank"></div>
	{/each}

	{@render dates(daysInMonth)}
</div>

<style>
	.wrapper {
		width: 100%;
		max-height: 70%;
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: var(--margin-sm);
	}

	.day.blank {
		background-color: var(--background);
	}
</style>
