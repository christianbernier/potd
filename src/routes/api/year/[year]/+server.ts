import { getPostDatesWithinTimeframe } from "$lib/server/index.ts";
import { json } from "@sveltejs/kit";

/**
 * GET the dates of all posts posted within a given year.
 * @param year the year of posts to obtain
 * @returns an array of strings in YYYY-MM-DD format representing each post
 * from the provided year
 */
export async function GET({ params }) {
  const start = new Date(`${params.year}-01-01`);
  const end = new Date(`${params.year + 1}-01-01`);
  const dates = await getPostDatesWithinTimeframe(start, end);
  return json(dates)
}
