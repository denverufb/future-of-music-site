import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "../../components/SiteChrome";
import ProgramPhoto from "../../components/ProgramPhoto";
import { posts, formatPostDate } from "../posts";
type Props = {params:Promise<{slug:string}>};
export const dynamicParams = false;
export function generateStaticParams() { return posts.map(post=>({slug:post.slug})); }
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {slug}=await params; const post=posts.find(post=>post.slug===slug);
  if(!post) return {};
  return {title:`${post.title} | Future of Music`,description:post.excerpt,alternates:{canonical:`https://fomusic.org/blog/${post.slug}/`}};
}
export default async function ArticlePage({params}:Props) {
  const {slug}=await params; const post=posts.find(post=>post.slug===slug);
  if(!post) notFound();
  return <PageShell active="blog" mainClassName="editorial-page"><article className="blog-article editorial-container">
    <a className="text-link" href="/blog/">All articles</a><header><p className="editorial-kicker">{post.category}</p><h1>{post.title}</h1>{!post.intro && <p className="editorial-lede">{post.excerpt}</p>}<p className="post-meta">By {post.author} · <time dateTime={post.date}>{formatPostDate(post.date)}</time></p></header>
    <ProgramPhoto name={post.image} alt={post.imageAlt} caption={post.imageCaption} eager />
    <div className="article-prose">{post.intro && <p>{post.intro}</p>}{post.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</section>)}</div>
    <footer className="article-footer">{(post.links ?? [{label:"DJ program details & registration",href:"/programs/dj/#registration"}]).map(link=><a className="text-link" key={link.href} href={link.href}>{link.label}</a>)}<a className="text-link" href="/blog/">More from our blog</a></footer>
  </article></PageShell>;
}
