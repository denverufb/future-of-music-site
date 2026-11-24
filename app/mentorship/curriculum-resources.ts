export type GuideResource = { label: string; url: string | null };

/** Resource entries may contain a label followed by a Markdown link or a URL. */
export function parseGuideResource(resource: string): GuideResource {
  const text = resource.trim();
  const markdown = text.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/i);
  const bare = text.match(/https?:\/\/[^\s<>\])]+/i);
  const url = markdown?.[2] || bare?.[0] || null;
  if (!url) return { label: text, url: null };
  const title = markdown ? text.slice(0, markdown.index).replace(/[:\s–—-]+$/, "") : text.slice(0, bare?.index).replace(/[:\s–—-]+$/, "");
  const linkedText = markdown?.[1].replaceAll("**", "").trim();
  return { label: title || (linkedText && !/^https?:\/\//i.test(linkedText) ? linkedText : "Open resource"), url };
}

/** Keep only resources that provide an actual web address. */
export function linkedGuideResources(resources: string[]): { label: string; url: string }[] {
  return resources.map(parseGuideResource).filter((resource): resource is { label: string; url: string } => resource.url !== null);
}

export function splitGuideSteps(value: string): string[] {
  const lines = value.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const steps = lines.map((line) => line.replace(/^(?:\d+[.)]|[-•])\s+/, ""));
  return steps.length ? steps : [];
}
