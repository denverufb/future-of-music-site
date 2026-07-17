import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const output = new URL("../out/", import.meta.url).pathname;

async function render(path = "/") {
  const filename = path === "/" ? "index.html" : join(path.slice(1), "index.html");
  return readFile(join(output, filename), "utf8");
}

const routes = [
  ["/", /Young creators\./i],
  ["/about", /Built with youth\./i],
  ["/programs/dj", /Learn to DJ\./i],
  ["/programs/mentorship", /Mentorship that feels/i],
  ["/team", /Youth-led/i],
  ["/donate", /Your gift puts the tools/i],
];

for (const [path, pageText] of routes) {
  test(`exports ${path} as a static page`, async () => {
    const html = await render(path);
    assert.match(html, pageText);
    assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
  });
}

test("navigation links directly to every main destination", async () => {
  const html = await render();
  for (const href of ["/about", "/programs/dj", "/programs/mentorship", "/team", "/donate"]) {
    assert.match(html, new RegExp(`href=\\"${href.replaceAll("/", "\\/")}\\"`));
  }
  assert.doesNotMatch(html, /href="\/programs"/);
});

test("program and donation actions remain available", async () => {
  const mentorship = await render("/programs/mentorship");
  assert.match(mentorship, /forms\.gle\/Gg7yigzM9zTQSEdF6/);
  assert.match(mentorship, /fomusic\.org\/portal-v2\//);

  const dj = await render("/programs/dj");
  assert.match(dj, /Become a DJ Program partner/i);
  assert.equal((dj.match(/data-gallery-slot="blank\.png"/g) ?? []).length, 0);
  for (const filename of ["01-program-group.png", "02-workshop.png", "03-controller-closeup.png", "04-students-mixing.png", "05-student-laptop.png"]) {
    assert.match(dj, new RegExp(`/gallery/dj/${filename.replace(".", "\\.")}`));
  }
  assert.equal((mentorship.match(/data-gallery-slot="blank\.png"/g) ?? []).length, 6);

  const donate = await render("/donate");
  assert.match(donate, /zeffy\.com\/en-US\/peer-to-peer\/free-youth-dj-program/);
  assert.match(donate, /<iframe/i);
});

test("footer includes the embedded Candid transparency seal", async () => {
  const html = await render();
  assert.match(html, /widgets\.guidestar\.org\/prod\/v1\/pdp\/transparency-seal\/16383723\/svg/);
  assert.doesNotMatch(html, /qwentin@fomusic\.org/);
});
