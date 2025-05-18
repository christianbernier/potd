import { type Cookies } from "@sveltejs/kit";
import { env } from "./env.js";

/**
 * Check whether the user is authenticated by verifying
 * the user's authentication token in their cookies.
 * @param cookies the cookies provided with the request
 * @returns whether the user is authenticated
 */
export function isAuthenticated(cookies: Cookies) {
  const token = cookies.get('token')

  if (token === null || token !== env.AUTH_TOKEN) {
    return false;
  }

  return true;
}
