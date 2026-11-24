import { strict as assert } from "node:assert";
import { test } from "node:test";
import { parseGuideResource, splitGuideSteps } from "../app/mentorship/curriculum-resources.ts";

test("curriculum resources turn embedded Markdown URLs into usable links", () => {
  assert.deepEqual(parseGuideResource("BLS Career Exploration: [**https://www.bls.gov/k12/example.htm**](https://www.bls.gov/k12/example.htm)"), { label: "BLS Career Exploration", url: "https://www.bls.gov/k12/example.htm" });
  assert.deepEqual(parseGuideResource("Visit https://example.org/resources"), { label: "Visit", url: "https://example.org/resources" });
  assert.deepEqual(parseGuideResource("Strengths and interests worksheet"), { label: "Strengths and interests worksheet", url: null });
  assert.deepEqual(parseGuideResource("[Insecure](javascript:alert(1))"), { label: "[Insecure](javascript:alert(1))", url: null });
});

test("activity steps preserve content while separating numbered lines", () => {
  assert.deepEqual(splitGuideSteps("Strengths Map:\n1. Identify strengths.\n2. Discuss them."), ["Strengths Map:", "Identify strengths.", "Discuss them."]);
  assert.deepEqual(splitGuideSteps(""), []);
});
