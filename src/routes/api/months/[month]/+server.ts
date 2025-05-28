import { constructDateString, deconstructDateString } from "$lib/date.ts";
import { Post } from "$lib/server/db.js";
import { Op } from "@sequelize/core";
import { json } from "@sveltejs/kit";

async function getDates(monthStr: string): Promise<Array<Post>> {
  console.log(monthStr)
  const start = new Date(`${monthStr}-01`);
  const [startYear, startMonth] = deconstructDateString(monthStr)
  const [endYear, endMonth] = [
    startMonth === '12' ? Number(startYear) + 1 : startYear,
    startMonth === '12' ? '1' : Number(startMonth) + 1,
  ]
  const nextMonthStr = constructDateString([String(endYear), String(endMonth)])
  const end = new Date(nextMonthStr)

  console.log(start, end)

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
  const results = (await getDates(params.month)).map(post => post.date);
  return json(results)
}
