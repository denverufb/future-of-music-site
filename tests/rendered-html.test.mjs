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
  ["/", /Learn music\./i],
  ["/about", /worth passing on\./i],
  ["/programs/dj", /Youth DJ Program/i],
  ["/dj-classes", /Continue to registration/i],
  ["/mentorship", /Mentorship Program/i],
  ["/programs/artist-development", /Artist Development/i],
  ["/programs/artist-development/course", /OPEN BETA/i],
  ["/team", /Meet the team\./i],
  ["/team/aereon", /Aereon Robinson/i],
  ["/team/qwentin", /Qwentin Blassingame/i],
  ["/team/gabriel", /Gabriel Walker/i],
  ["/donate", /Make a donation/i],
  ["/blog", /Stories &amp; findings/i],
  ["/blog/inside-the-youth-dj-program", /Inside the Youth DJ Program/i],
];

test("team directory links to individual biographies in the requested order", async () => {
  const html = await render("/team");
  const main = html.split('<main')[1]?.split('</main>')[0];
  assert.ok(main);
  const cards = [...main.matchAll(/href="\/team\/(aereon|qwentin|gabriel)\/"/g)].map(match => match[1]);
  assert.deepEqual(cards, ["aereon", "qwentin", "gabriel"]);
  assert.equal((main.match(/Read bio/g) ?? []).length, 3);
  assert.match(main, /Managing Director/);
  assert.doesNotMatch(main, /team-stack|small team|big ideas|honest belief|Managing Director &amp; Program Coach/i);
  for (const slug of cards) {
    const profile = await render(`/team/${slug}`);
    assert.match(profile, /href="\/team\/"/);
    assert.match(profile, /mailto:/);
  }
});

for (const [path, pageText] of routes) {
  test(`exports ${path} as a static page`, async () => {
    const html = await render(path);
    assert.match(html, pageText);
    assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
  });
}

test("navigation links directly to every main destination", async () => {
  const html = await render();
  for (const href of ["/about", "/programs/dj", "/mentorship", "/team", "/donate", "/blog"]) {
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

test("homepage presents the community partners", async () => {
  const home = await render();
  assert.match(home, /Working with our community/i);
  assert.match(home, /Jennings School District/i);
  assert.match(home, /CreatorLaunch/i);
  assert.match(home, /Next Prep/i);
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
  assert.equal((mentorship.match(/data-gallery-slot="blank\.png"/g) ?? []).length, 0);

  const donate = await render("/donate");
  assert.match(donate, /data-form-url="\/embed\/donation-form\/future-of-music"/);
  assert.match(donate, /zeffy\.com\/embed\/donation-form\/future-of-music/);
  assert.match(donate, /About our organization/i);
  assert.match(donate, /<iframe/i);
  assert.doesNotMatch(donate, /\$25|\$100|\$500|suggested donation amount/i);
});

test("DJ program contains the class details and interest form; old URL redirects", async () => {
  const djClass = await render("/programs/dj");
  assert.match(djClass, /hosted directly by Future of Music/i);
  assert.match(djClass, /not limited to.*current school or organization partner program/i);
  assert.match(djClass, /docs\.google\.com\/forms\/d\/e\/1FAIpQLSdLz2Zg9kjSuQ-EWac49RiWBfvSS_Pz1LxSh4zH0I3Exp08Jg\/viewform\?embedded=true/i);
  assert.match(djClass, /title="Free DJ class interest form"/i);
  assert.match(djClass, /id="registration"/);
  const previous = await render("/dj-classes");
  assert.match(previous, /window.location.replace\("&quot;|window.location.replace\("/);
  assert.match(previous, /href="\/programs\/dj\/#registration"/);
});

test("artist development draft is self-paced and contains no video experience", async () => {
  const academy = await render("/programs/artist-development");
  assert.match(academy, /Learn through readings, narration, creative activities, and quizzes/i);
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

test("About tells the story with the six supplied photos in their requested sections", async () => {
  const html = await render("/about");
  const fom = html.split('data-photo-section="fom"')[1]?.split('</article>')[0];
  const founder = html.split('data-photo-section="founder"')[1]?.split('</section>')[0];
  assert.ok(fom && founder);
  for (const [section, names] of [[fom, ['fom-community', 'students-learning', 'students-creating']], [founder, ['founder-at-the-decks', 'founder-teaching', 'founder-with-students']]]) {
    assert.equal((section.match(/<img /g) || []).length, 3);
    for (const name of names) {
      assert.ok(section.includes(`/images/about/${name}-1600.webp`));
      for (const width of [800, 1600]) {
        const image = await readFile(join(output, `images/about/${name}-${width}.webp`));
        assert.equal(image.toString('ascii', 8, 12), 'WEBP');
      }
    }
  }
  assert.match(html, /id="our-mission"/);
  assert.match(html, /townandstyle\.com\/student-standouts/);
  assert.match(html, /stlamerican\.com\/business\/from-teen-dj-to-teen-mentor/);
  assert.match(html, /bizjournals\.com\/stlouis\/news\/2025\/10\/25/);
  assert.doesNotMatch(html, /class="page-hero about-hero"|class="value-grid"|class="story-link-grid"/);
});
