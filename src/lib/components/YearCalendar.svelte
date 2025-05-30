<script lang="ts">
	import { padDatePart } from "$lib/index.ts";
	import YearCalendarMonth from "./YearCalendarMonth.svelte";

  const { year, dates }: { year: string, dates: Array<Set<string>> } = $props();
</script>

<div class="wrapper">
  {#each new Array(12) as _, i}
    <a href={`/${year}/${padDatePart(i + 1)}`}>
      <YearCalendarMonth monthStr={`${year}-${padDatePart(i + 1)}`} datesWithPosts={dates[i]} />
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
