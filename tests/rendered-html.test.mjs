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
  ["/dj-classes", /A free DJ class\./i],
  ["/mentorship", /Mentorship that feels/i],
  ["/programs/artist-development", /Artist Development/i],
  ["/programs/artist-development/course", /OPEN BETA/i],
  ["/team", /Youth-led/i],
  ["/donate", /Give young creators/i],
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
  for (const href of ["/about", "/programs/dj", "/dj-classes", "/mentorship", "/team", "/donate"]) {
    assert.match(html, new RegExp(`href=\\"${href.replaceAll("/", "\\/")}\\"`));
  }
  assert.doesNotMatch(html, /href="\/programs"/);
  assert.doesNotMatch(html, /href="\/programs\/mentorship"/);
});

test("the former mentorship URL redirects to the short address", async () => {
  const legacy = await render("/programs/mentorship");
  assert.match(legacy, /window\.location\.replace\(['"]\/mentorship\/['"]\)/i);
  assert.match(legacy, /href="\/mentorship\/"/i);
  assert.doesNotMatch(legacy, /Mentorship that feels/i);
});

test("homepage owns the rotating community partner showcase", async () => {
  const home = await render();
  assert.match(home, /Opportunity moves.*when we move/i);
  assert.match(home, /Jennings School District/i);
  assert.match(home, /CreatorLaunch/i);
  assert.match(home, /Next Prep/i);
  assert.match(home, /Pause logos/i);
  assert.match(home, /\/partners\/creatorlaunch\.png/i);

  const dj = await render("/programs/dj");
  const mentorship = await render("/mentorship");
  assert.doesNotMatch(dj, /class="program-partners/i);
  assert.doesNotMatch(mentorship, /class="program-partners/i);
  assert.doesNotMatch(mentorship, /Partnership spotlight/i);
});

test("program and donation actions remain available", async () => {
  const mentorship = await render("/mentorship");
  assert.match(mentorship, /forms\.gle\/Gg7yigzM9zTQSEdF6/);
  assert.match(mentorship, /fomusic\.org\/portal-v2\//);

  const dj = await render("/programs/dj");
  assert.match(dj, /Become a DJ Program partner/i);
  assert.equal((dj.match(/data-gallery-slot="blank\.png"/g) ?? []).length, 0);
  for (const filename of ["01-program-group.jpg", "02-workshop.jpg", "03-controller-closeup.jpg", "04-students-mixing.jpg", "05-student-laptop.jpg"]) {
    assert.match(dj, new RegExp(`/gallery/dj/${filename.replace(".", "\\.")}`));
  }
  assert.equal((mentorship.match(/data-gallery-slot="blank\.png"/g) ?? []).length, 6);

  const donate = await render("/donate");
  assert.match(donate, /data-form-url="\/embed\/donation-form\/future-of-music"/);
  assert.match(donate, /zeffy\.com\/embed\/donation-form\/future-of-music/);
  assert.match(donate, /About our organization/i);
  assert.match(donate, /<iframe/i);
  assert.doesNotMatch(donate, /\$25|\$100|\$500|suggested donation amount/i);
});

test("free DJ class page embeds the independent interest form", async () => {
  const djClass = await render("/dj-classes");
  assert.match(djClass, /hosted directly by Future of Music/i);
  assert.match(djClass, /not limited to.*current school or organization partner program/i);
  assert.match(djClass, /docs\.google\.com\/forms\/d\/e\/1FAIpQLSdLz2Zg9kjSuQ-EWac49RiWBfvSS_Pz1LxSh4zH0I3Exp08Jg\/viewform\?embedded=true/i);
  assert.match(djClass, /title="Free DJ class interest form"/i);
});

test("artist development draft is self-paced and contains no video experience", async () => {
  const academy = await render("/programs/artist-development");
  assert.match(academy, /Find your sound\. Build your brand\. Prepare for the industry\./i);
  assert.match(academy, /Artist Development Portfolio/i);
  assert.match(academy, /100%.*ONLINE.*SELF-PACED/i);
  assert.doesNotMatch(academy, /\bvideo(s)?\b/i);
});

test("artist development course includes the complete narration-first beta", async () => {
  const course = await render("/programs/artist-development/course");
  const appSource = await readFile(new URL("../app/programs/artist-development/course/CourseApp.tsx", import.meta.url), "utf8");
  const dataSource = await readFile(new URL("../app/programs/artist-development/course/course-data.ts", import.meta.url), "utf8");

  assert.match(course, /Artist Development Academy/i);
  assert.match(course, /Your work saves automatically on this device/i);
  assert.match(course, /Artist Workbook/i);
  assert.match(appSource, /speechSynthesis/);
  assert.match(appSource, /Download my workbook/i);
  assert.match(appSource, /Print or save certificate/i);
  assert.equal((dataSource.match(/id: "[0-9]-[0-9]+"/g) ?? []).length, 27);
  assert.equal((dataSource.match(/\bq\(/g) ?? []).length, 54);
  assert.doesNotMatch(`${course}\n${appSource}\n${dataSource}`, /\bvideo(s)?\b|voice\.ai|translate\.google/i);
});

test("footer includes the embedded Candid transparency seal", async () => {
  const html = await render();
  assert.match(html, /widgets\.guidestar\.org\/prod\/v1\/pdp\/transparency-seal\/16383723\/svg/);
  assert.doesNotMatch(html, /qwentin@fomusic\.org/);
});
