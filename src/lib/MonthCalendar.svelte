<script lang="ts">
	import { page } from "$app/state";
	import Calendar from "./Calendar.svelte";
	import { deconstructDateString, padDatePart } from "./date.js";

  let {
    monthStr,
    dates,
  }: {
    monthStr: string,
    dates: Map<string, Uint8Array>,
  } = $props();

  // when the dates in the month are loaded, link the provided images to those divs
  let images = new Map<string, string>();
  let imgTags = $state(new Array<HTMLImageElement>(31))
  $effect(() => {
    dates.entries().forEach((value) => {
      const url = URL.createObjectURL(new Blob([value[1]], { type: 'image/png' }));
      images.set(value[0], url)
      imgTags[Number(deconstructDateString(value[0])[2]) - 1].src = url
    })
  })
</script>

<Calendar {monthStr}>
  {#snippet dates(daysInMonth)}
    {#each new Array(daysInMonth) as _, day}
      <div class="day">
        <a
          href={`${page.url.pathname}/${padDatePart(day + 1)}`}
          class={!imgTags[day]?.src?.length ? 'invisible' : ''}
        >
          <img bind:this={imgTags[day]} alt={''} />
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

  .day > a, .day img {
    width: 100%;
    height: 100%;
  }

  .day img {
    object-fit: cover;
    filter: blur(0.2px);
  }
</style>
