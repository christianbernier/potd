import type { ParamMatcher } from '@sveltejs/kit';

/**
 * Svelte matcher to ensure a URL parameter is a string representation
 * of a number, such as '2025' or '04'.
 */
export const match = ((param: string): boolean => {
  return !Number.isNaN(Number(param))
}) satisfies ParamMatcher;
