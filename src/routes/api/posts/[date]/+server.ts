import { Post } from "$lib/server/db.js";
import { env } from "$lib/server/env.ts";
import { error, json } from "@sveltejs/kit";

async function getPost(dateStr: string): Promise<Post | null> {
  return await Post.findOne({
    attributes: ['date', 'caption'],
    where: {
      date: dateStr
    },
    raw: true,
  });
}

async function doesPostExist(date: string) {
  const post = await getPost(date);
  return post !== null
}

async function toBase64(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return buffer.toString('base64')
}

async function createGithubBranch(branch: string) {
  const commitsResponse = await fetch(`https://api.github.com/repos/christianbernier/potd/commits`, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${env.GIT_TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  const commitsData = await commitsResponse.json()
  const lastCommitSha = commitsData[0].sha;
  
  const branchResponse = await fetch(`https://api.github.com/repos/christianbernier/potd/git/refs`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${env.GIT_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "ref": `refs/heads/${branch}`,
      "sha": lastCommitSha
    })
  })
  await branchResponse.json()
}

async function addToGithubRepository(file: File, path: string, branch: string) {
  const base64 = await toBase64(file);
  const response = await fetch(`https://api.github.com/repos/christianbernier/potd/contents/${path}`, {
    method: 'PUT',
    headers: {
      "Authorization": `Bearer ${env.GIT_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Add image ${path}`,
      content: base64,
      branch,
    })
  })

  const result = await response.json();
  if (!response.ok) {
    throw new Error(`GitHub error: ${result.message}`);
  }

  return result;
}

async function mergeGithubBranch(branch: string) {
  const response = await fetch(`https://api.github.com/repos/christianbernier/potd/merges`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${env.GIT_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "base": "main",
      "head": branch,
    })
  })
  await response.json()
}

export async function GET({ params }) {
  const date = params.date;
  const result = await getPost(date);

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

  await createGithubBranch(date);

  const fullQualityImage = formData.get('fullQualityImage') as File;
  const compressedImage = formData.get('compressedImage') as File;
  await addToGithubRepository(fullQualityImage, `static/fullQuality/${date}.jpeg`, date)
  await addToGithubRepository(compressedImage, `static/previews/${date}.jpeg`, date)
  await mergeGithubBranch(date)

  const post = await Post.create({
    date,
    caption,
  })
  
  return json(post)
}

export async function DELETE({ params }) {
  const date = params.date;
  const existingPost = await getPost(date);

  if (existingPost === null) {
    error(404, { message: 'Post does not exist.' })
  }

  await Post.destroy({where: { date }})

  return json({ success: true })
}

export async function PATCH({ request, params }) {
  const date = params.date;
  const existingPost = await getPost(date);

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
