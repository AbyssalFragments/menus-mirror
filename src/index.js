import { join } from "node:path";
import packageM from "../package.json" with { type: "json" };
import { fixedFetch } from "./fetch.js";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { OUT_DIR } from "./constants.js";

/**
 * @typedef BarData
 * @property {string} name
 * @property {boolean?} disableBartender
 * @property {boolean?} disableVisitor
 * @property {boolean?} enableNoKarm
 */

/**
 *
 * @param {string} slug
 * @param {string} type
 */
async function downloadBarMenu(slug, type) {
  await writeFile(
    join(OUT_DIR, slug, `${type}.png`),
    await fixedFetch(`/${slug}/${type}`)
      .then((i) => i.arrayBuffer())
      .then(Buffer.from),
  );
}

(async () => {
  console.info(`Menus Mirror ${packageM.version}`);
  console.log(`Out Dir: ${OUT_DIR}`);
  if (existsSync(OUT_DIR)) await rm(OUT_DIR, { recursive: true });
  console.log("Mirroring Menus...");

  await mkdir(OUT_DIR, { recursive: true });
  /**
   * @type {Record<string, BarData>}
   */
  const bars = await fixedFetch("/bars").then((i) => i.json());
  console.log(`Found ${Object.keys(bars).length} bars`);

  await downloadBarMenu("public", "bartender");
  await downloadBarMenu("public", "visitor");
  await downloadBarMenu("public", "nokarm");

  for (const [slug, data] of Object.entries(bars)) {
    await mkdir(join(OUT_DIR, slug), { recursive: true });
    await Promise.all(
      [
        !data.disableBartender ? "bartender" : null,
        !data.disableVisitor ? "visitor" : null,
        data.enableNoKarm ? "nokarm" : null,
      ]
        .filter((i) => i !== null)
        .map((type) => downloadBarMenu(slug, type)),
    );
  }
})();
