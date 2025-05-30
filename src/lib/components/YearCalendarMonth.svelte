<script lang="ts">
	import { padDatePart } from "$lib/index.ts";
	import Calendar from "./Calendar.svelte";

  let { monthStr, datesWithPosts }: { monthStr: string, datesWithPosts: Set<string> } = $props();
</script>

<Calendar {monthStr}>
  {#snippet dates(daysInMonth)}
    {#each new Array(daysInMonth) as _, day}
      <div class="day">
        {datesWithPosts.has(`${monthStr}-${padDatePart(day + 1)}`) ? 'x' : ''}
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
