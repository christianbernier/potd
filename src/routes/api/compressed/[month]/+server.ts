import { constructDateString, deconstructDateString } from "$lib/date.ts";
import { Post } from "$lib/server/db.js";
import { Op } from "@sequelize/core";
import { json } from "@sveltejs/kit";

async function getThumbnails(monthStr: string): Promise<Array<Post>> {
  const start = new Date(monthStr);
  const [startYear, startMonth] = deconstructDateString(monthStr)
  const [endYear, endMonth] = [
    startMonth === '12' ? Number(startYear) + 1 : startYear,
    startMonth === '12' ? '1' : Number(startMonth) + 1,
  ]
  const nextMonthStr = constructDateString([String(endYear), String(endMonth)])
  const end = new Date(nextMonthStr)

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
