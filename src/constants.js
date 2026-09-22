import { join } from "path";

export const OUT_DIR = process.argv[2] ?? join(import.meta.dirname, "../out");
