import { env } from './env.ts';

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

	// no content status for some requests
	if (response.status === 204) {
		return {};
	}

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
 * Gets the SHA of a particular path in the repository.
 * @param path the path of the file within the repository
 */
export async function getFileSha(path: string) {
	const fileData = await githubApiRequest(`contents/${path}`, 'GET');
	return fileData.sha;
}

/**
 * Add a file to the repository, in a specific branch, as a commit.
 * @param base64 the base-64 encoding of the file to add to the repository
 * @param path the path of the file within the repository
 * @param branch the branch to add the commit of the file
 * @param newFile whether the file is being created
 */
export async function addFileToRepository(base64: string, path: string, branch: string, newFile: boolean) {
	const sha = newFile ? undefined : await getFileSha(path);
	await githubApiRequest(`contents/${path}`, 'PUT', {
		message: `Add file ${path}`,
		content: base64,
		branch,
		sha,
	});
}

/**
 * Delete a file from the repository, in a specific branch, as a commit.
 * @param path the path of the file within the repository
 * @param branch the branch to add the commit of the file
 */
export async function deleteFileFromRepository(path: string, branch: string) {
	const sha = await getFileSha(path);
	await githubApiRequest(`contents/${path}`, 'DELETE', {
		message: `Delete file ${path}`,
		branch,
		sha,
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

/**
 * Delete a branch in the repository.
 * @param branch the name of the branch to delete
 */
export async function deleteBranch(branch: string) {
	await githubApiRequest(`git/refs/heads/${branch}`, 'DELETE');
}
