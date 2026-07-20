import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const source = join(process.cwd(), "app", "assets", "gallery");
const destination = join(process.cwd(), "public", "gallery");

rmSync(destination, { recursive: true, force: true });
if (existsSync(source)) {
  mkdirSync(destination, { recursive: true });
  cpSync(source, destination, { recursive: true });

  const removeSupersededPngs = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        removeSupersededPngs(path);
        continue;
      }

      if (!entry.name.toLowerCase().endsWith(".png")) continue;
      const optimizedJpeg = join(directory, entry.name.replace(/\.png$/i, ".jpg"));
      if (existsSync(optimizedJpeg)) rmSync(path);
    }
  };

  removeSupersededPngs(destination);
}
