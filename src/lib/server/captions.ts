import { addFileToRepository } from "./github.ts";

const CAPTION_FILE = '/captions.json'

export async function getAllCaptions(fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) {
  const response = await fetch(CAPTION_FILE)
  return await response.json();
}

export async function getCaption(
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  date: string,
) {
  const captions = await getAllCaptions(fetch);
  return captions[date];
}

export async function setCaption(
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  date: string,
  caption: string
) {
  const captions = await getAllCaptions(fetch);
  captions[date] = caption;
  const captionsBase64 = btoa(JSON.stringify(captions));
  await addFileToRepository(captionsBase64, `static${CAPTION_FILE}`, date, false)
}
