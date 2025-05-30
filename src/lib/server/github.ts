import { env } from './env.ts';

/**
 * Convert a file into its base-64 representation.
 * @param file input file to convert
 * @returns a promise of a string with the base-64 version of the file contents
 */
async function toBase64(file: File) {
	const buffer = Buffer.from(await file.arrayBuffer());
	return buffer.toString('base64');
}

/**
 * Send a request to the GitHub REST API.
 * @param path the specific resource path, within the given repository
 * @param method the HTTP method to use for the request
 * @param data optional JSON data to send in the body of the request
 * @returns a promise of the results of the request
 */
async function githubApiRequest(
	path: string,
	method: 'GET' | 'PUT' | 'POST' | 'DELETE',
	data?: object
) {
	const response = await fetch(`https://api.github.com/repos/christianbernier/potd/${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${env.GIT_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: data === undefined ? null : JSON.stringify(data)
	});
	const result = await response.json();

	// if there was a problem, throw an error
	if (!response.ok) {
		throw new Error(result.message);
	}

	return result;
}

/**
 * Create a branch on the repository.
 * @param branch the name of the new branch
 */
export async function createBranch(branch: string) {
	const commitsData = await githubApiRequest('commits', 'GET');
	const lastCommitSha = commitsData[0].sha;
	await githubApiRequest('git/refs', 'POST', {
		ref: `refs/heads/${branch}`,
		sha: lastCommitSha
	});
}

/**
 * Add a file to the repository, in a specific branch, as a commit.
 * @param file the file to add to the repository
 * @param path the path of the file within the repository
 * @param branch the branch to add the commit of the file
 */
export async function addFileToRepository(file: File, path: string, branch: string) {
	const base64 = await toBase64(file);
	await githubApiRequest(`contents/${path}`, 'PUT', {
		message: `Add file ${path}`,
		content: base64,
		branch
	});
}

/**
 * Merge a branch to the main branch in the repository.
 * @param branch the name of the branch to merge into the main branch
 */
export async function mergeBranch(branch: string) {
	await githubApiRequest('merges', 'POST', {
		base: 'main',
		head: branch
	});
}
