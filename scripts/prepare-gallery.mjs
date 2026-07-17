import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const source = join(process.cwd(), "app", "assets", "gallery");
const destination = join(process.cwd(), "public", "gallery");

rmSync(destination, { recursive: true, force: true });
if (existsSync(source)) {
  mkdirSync(destination, { recursive: true });
  cpSync(source, destination, { recursive: true });
}
