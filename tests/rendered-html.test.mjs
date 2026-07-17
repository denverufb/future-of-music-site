import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Future of Music redesign", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Future of Music \| Young Creators\. Real Futures\.<\/title>/i);
  assert.match(html, /Young creators\./i);
  assert.match(html, /DJ Program/i);
  assert.match(html, /Mentorship, together/i);
  assert.match(html, /It takes a whole/i);
  assert.match(html, /Keep every program free/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("includes essential navigation and action links", async () => {
  const html = await (await render()).text();
  assert.match(html, /href="#programs"/);
  assert.match(html, /href="#partners"/);
  assert.match(html, /forms\.gle\/Gg7yigzM9zTQSEdF6/);
  assert.match(html, /fomusic\.org\/portal-v2\//);
  assert.match(html, /zeffy\.com\/en-US\/peer-to-peer\/free-youth-dj-program/);
});
