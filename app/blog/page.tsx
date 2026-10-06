import type { Metadata } from "next";
import { PageShell } from "../components/SiteChrome";
import ProgramPhoto from "../components/ProgramPhoto";
import { posts, formatPostDate } from "./posts";
export const metadata: Metadata = { title:"Blog | Future of Music", description:"Articles, program notes, and findings from Future of Music." };
export default function BlogPage() {
  return <PageShell active="blog" mainClassName="editorial-page"><div className="editorial-container">
    <header className="editorial-heading"><p className="editorial-kicker">Future of Music blog</p><h1>Stories & findings</h1><p className="editorial-lede">Articles about our programs, the people involved, and what we learn through our work.</p></header>
    <section className="blog-index" aria-label="Latest articles">{posts.length ? posts.map(post=><article key={post.slug}><a href={`/blog/${post.slug}/`} aria-label={`Read ${post.title}`}><ProgramPhoto name={post.image} alt={post.imageAlt} /><div><p className="editorial-kicker">{post.category}</p><h2>{post.title}</h2><p>{post.excerpt}</p><p className="post-meta"><time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.author}</p><span className="text-link">Read article</span></div></a></article>):<p>Our first articles are coming soon.</p>}</section>
  </div></PageShell>;
}
