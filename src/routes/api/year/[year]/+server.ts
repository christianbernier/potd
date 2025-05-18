import { Post } from "$lib/server/db.js";
import { Op } from "@sequelize/core";
import { json } from "@sveltejs/kit";

async function getDates(year: string): Promise<Array<Post>> {
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year + 1}-01-01`);

  return await Post.findAll({
    attributes: [ 'date' ],
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
  const results = await getDates(params.year);
  return json(results)
}
