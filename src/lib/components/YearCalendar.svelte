<script lang="ts">
	import { padDatePart, type Captions } from '$lib/index.ts';
	import YearCalendarMonth from './YearCalendarMonth.svelte';

	const { year, captions }: { year: string; captions: Captions } = $props();
</script>

<div class="wrapper">
	{#each new Array(12) as _, i}
		<a href={`/${year}/${padDatePart(i + 1)}`}>
			<YearCalendarMonth {year} month={padDatePart(i + 1)} monthCaptions={captions[year]} />
		</a>
	{/each}
</div>

<style>
	.wrapper {
		width: 100%;
		max-height: 70%;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--margin-xl);
	}

	a {
		color: var(--text);
		text-decoration: none;
	}
</style>
