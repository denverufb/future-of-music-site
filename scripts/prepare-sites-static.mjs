import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const output = join(root, "out");
const dist = join(root, "dist");
const client = join(dist, "client");
const server = join(dist, "server");

rmSync(dist, { recursive: true, force: true });
mkdirSync(server, { recursive: true });
cpSync(output, client, { recursive: true });

writeFileSync(join(server, "index.js"), `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const url = new URL(request.url);
    if (!url.pathname.endsWith("/")) {
      url.pathname += "/";
      return env.ASSETS.fetch(new Request(url, request));
    }
    return response;
  },
};
`);
