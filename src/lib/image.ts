import imageCompression, { type Options } from "browser-image-compression";

const compress = imageCompression as unknown as (file: File, options: Options) => Promise<File>;

/**
 * Compresses the provided image.
 * @param image the uncompressed version of the image
 * @param maxSizeMB the maximum file size the compressed version should be, in MB
 * @returns a promise of the compressed file
 */
export async function getCompressedImage(image: File | null, maxSizeMB: number): Promise<File> {
  if (!image) {
    throw new Error('No image provided!');
  }

  const options = { maxSizeMB, useWebWorker: true, maxIteration: 40 };
  return await compress(image, options);
}

/**
 * Compresses the provided image into the preview size.
 * @param image the uncompressed version of the image
 * @returns a promise of the compressed file
 */
export async function getTinyImage(image: File | null): Promise<File> {
  return getCompressedImage(image, 0.03)
}

/**
 * Gets the byte contents of a file.
 * @param file the file to get the bytes of
 * @returns the bytes of the provided file
 */
export async function getFileBytes(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}
