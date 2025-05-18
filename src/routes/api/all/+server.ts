import { Post } from "$lib/server/db.js";
import { json } from "@sveltejs/kit";

export async function GET() {
  const results = await Post.findAll({
    attributes: ['date', 'caption']
  });
  return json(results)
}
