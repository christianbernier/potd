<script lang="ts">
	import { padDatePart } from '$lib/index.ts';
	import Calendar from './Calendar.svelte';

	let {
		year,
		month,
		monthCaptions
	}: {
		year: string;
		month: string;
		monthCaptions:
			| {
					[month in string]:
						| {
								[date in string]: string | undefined;
						  }
						| undefined;
			  }
			| undefined;
	} = $props();
</script>

<Calendar monthStr={`${year}-${month}`}>
	{#snippet dates(daysInMonth)}
		{#each new Array(daysInMonth) as _, day}
			<div class="day">
				{monthCaptions !== undefined &&
				month in monthCaptions &&
				padDatePart(day + 1) in (monthCaptions[month] || {})
					? 'x'
					: ''}
			</div>
		{/each}
	{/snippet}
</Calendar>

<style>
	.day {
		max-height: 100%;
		max-width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;
		background-color: var(--gray);
	}
</style>
