import { Post } from "$lib/server/db.js";
import { Op } from "@sequelize/core";
import { json } from "@sveltejs/kit";

async function getThumbnails(monthStr: string): Promise<Array<Post>> {
  const start = new Date(monthStr);
  const end = new Date(start.getFullYear(), start.getMonth() + 2, 1) // next month

  return await Post.findAll({
    attributes: [
      'date',
      'image_compressed'
    ],
    where: {
      date: {
        [Op.gte]: start,
        [Op.lt]: end,
      }
    },
    raw: true,
  });
}

export async function GET({ params }) {
  const results = await getThumbnails(params.month);
  return json(results)
}
