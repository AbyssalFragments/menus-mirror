import packageM from "../package.json" with { type: "json" };
const BASE = "https://menus.abyssalfragments.org/";

/**
 * reqwest uwu
 * @param {string} path
 * @param {RequestInit} init
 */
export function fixedFetch(path, init = {}) {
  const url = new URL(BASE);
  url.pathname = path;
  return fetch(url, {
    ...init,
    headers: {
      ...init,
      Authorization: process.env.BAR_LIST_KEY,
      "User-Agent": `MenusMirror/${packageM.version} fragmentedadmin@abyssalfragments.org`,
    },
  });
}
