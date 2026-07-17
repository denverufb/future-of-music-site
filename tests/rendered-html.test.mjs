import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

async function render(path = "/") {
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const routes = [
  ["/", /Young creators\./i],
  ["/about", /Built with youth\./i],
  ["/programs/dj", /Learn to DJ\./i],
  ["/programs/mentorship", /Mentorship that feels/i],
  ["/team", /Youth-led\./i],
  ["/donate", /Your gift puts the tools/i],
];

for (const [path, pageText] of routes) {
  test(`server-renders ${path}`, async () => {
    const response = await render(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    const html = await response.text();
    assert.match(html, pageText);
    assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
  });
}

test("navigation links directly to every main destination", async () => {
  const html = await (await render()).text();
  for (const href of ["/about", "/programs/dj", "/programs/mentorship", "/team", "/donate"]) {
    assert.match(html, new RegExp(`href=\\"${href.replaceAll("/", "\\/")}\\"`));
  }
  assert.doesNotMatch(html, /href=\"\/programs\"/);
  assert.doesNotMatch(html, /href=\"\/about#partners\"/);
});

test("legacy programs overview redirects to the DJ program", async () => {
  const response = await render("/programs");
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "http://localhost/programs/dj");
});

test("program and donation actions remain available", async () => {
  const mentorship = await (await render("/programs/mentorship")).text();
  assert.match(mentorship, /forms\.gle\/Gg7yigzM9zTQSEdF6/);
  assert.match(mentorship, /fomusic\.org\/portal-v2\//);
  assert.match(mentorship, /mentee\.fomusic\.org/);

  const dj = await (await render("/programs/dj")).text();
  assert.match(dj, /Bring this program/i);
  assert.match(dj, /Become a DJ Program partner/i);
  assert.match(dj, /Photo space 0/i);
  assert.match(dj, />01<\/span><h3>DJ fundamentals/i);

  assert.match(mentorship, /Mentorship grows/i);
  assert.match(mentorship, /Photo space 0/i);

  const donate = await (await render("/donate")).text();
  assert.match(donate, /zeffy\.com\/en-US\/peer-to-peer\/free-youth-dj-program/);
  assert.match(donate, /<iframe/i);
});

test("footer includes the embedded Candid transparency seal", async () => {
  const html = await (await render()).text();
  assert.match(html, /widgets\.guidestar\.org\/prod\/v1\/pdp\/transparency-seal\/16383723\/svg/);
});
