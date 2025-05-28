import { getFileBytes } from "$lib/image.js";
import { Post } from "$lib/server/db.js";
import { env } from "$lib/server/env.ts";
import { error, json } from "@sveltejs/kit";

async function getPost(dateStr: string, noimage: boolean): Promise<Post | null> {
  return await Post.findOne({
    attributes: noimage ? ['date', 'caption'] : ['date', 'image', 'caption'],
    where: {
      date: dateStr
    },
    raw: true,
  });
}

async function doesPostExist(date: string) {
  const post = await getPost(date, true);
  return post !== null
}

async function toBase64(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return buffer.toString('base64')
}

async function addToGithubRepository(file: File, path: string) {
  const base64 = await toBase64(file);
  const response = await fetch(`https://api.github.com/repos/christianbernier/potd/contents/${path}`, {
    method: 'PUT',
    headers: {
      "Authorization": `Bearer ${env.GIT_TOKEN}`, // store securely
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Add image ${path}`,
      content: base64,
      branch: "main"
    })
  })

  const result = await response.json();
  if (!response.ok) {
    throw new Error(`GitHub error: ${result.message}`);
  }

  return result;
}

export async function GET({ params, url }) {
  const date = params.date;
  const noimage = Boolean(url.searchParams.get('noimage'))
  const result = await getPost(date, noimage);

  if (result === null) {
    error(404, { message: 'Post does not exist.' })
  }

  return json(result)
}

export async function POST({ params, request }) {
  const date = params.date;

  if (await doesPostExist(date)) {
    error(400, { message: `Post with date ${date} already exists.` })
  }

  const formData = await request.formData();
  const caption = formData.get('caption') as string;

  // get image data and convert it into a byte array
  const fullQualityImage = formData.get('fullQualityImage') as File;
  const compressedImage = formData.get('compressedImage') as File;
  const image = await getFileBytes(fullQualityImage);
  const image_compressed = await getFileBytes(compressedImage);

  await addToGithubRepository(fullQualityImage, `static/fullQuality/${date}.jpg`)
  await addToGithubRepository(fullQualityImage, `static/preview/${date}.jpg`)

  const post = await Post.create({
    date,
    image,
    image_compressed,
    caption,
  })
  
  return json(post)
}

export async function DELETE({ params }) {
  const date = params.date;
  const existingPost = await getPost(date, true);

  if (existingPost === null) {
    error(404, { message: 'Post does not exist.' })
  }

  await Post.destroy({where: { date }})

  return json({ success: true })
}

export async function PATCH({ request, params }) {
  const date = params.date;
  const existingPost = await getPost(date, true);

  if (existingPost === null) {
    error(404, { message: 'Post does not exist.' })
  }

  const formData = await request.formData();
  const caption = formData.get('caption') as string;

  await Post.update(
    { caption },
    { where: { date } }
  )

  return json({ success: true })
}
