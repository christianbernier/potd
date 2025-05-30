<script lang="ts">
	import { page } from '$app/state';
	import { padDatePart } from '$lib/index.ts';
	import Calendar from './Calendar.svelte';

	let {
		monthStr,
		posts
	}: {
		monthStr: string;
		posts: Array<string>;
	} = $props();
</script>

<Calendar {monthStr}>
	{#snippet dates(daysInMonth)}
		{#each new Array(daysInMonth) as _, day}
			<div class="day">
				<a
					href={`${page.url.pathname}/${padDatePart(day + 1)}`}
					class={posts.includes(`${monthStr}-${padDatePart(day + 1)}`) ? '' : 'invisible'}
				>
					{#if posts.includes(`${monthStr}-${padDatePart(day + 1)}`)}
						<img src={`/previews/${monthStr}-${padDatePart(day + 1)}.jpeg`} alt="" />
					{/if}
				</a>
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

	.day > a,
	.day img {
		width: 100%;
		height: 100%;
	}

	.day img {
		object-fit: cover;
	}
</style>
