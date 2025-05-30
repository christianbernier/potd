import { Op } from "@sequelize/core";
import { Post } from "./db.ts";

export async function getPostDatesWithinTimeframe(start: Date, end: Date) {
  const posts = await Post.findAll({
    attributes: [ 'date' ],
    where: {
      date: {
        [Op.gte]: start,
        [Op.lt]: end,
      }
    },
  });

  return posts.map(post => post.date);
}
