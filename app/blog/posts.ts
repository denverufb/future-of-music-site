import records from "../../content/blog/posts.json";
export type Post = typeof records[number];
export const posts = records.filter(post => post.published).sort((a,b) => b.date.localeCompare(a.date));
export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {month:"long",day:"numeric",year:"numeric",timeZone:"UTC"}).format(new Date(date + "T12:00:00Z"));
}
