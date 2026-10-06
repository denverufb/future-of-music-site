# Publishing an article

The blog uses the same GitHub → Neocities publishing process as the rest of the site. There is no public admin form or new account to maintain.

1. Add an entry to `content/blog/posts.json`, using the first article as the example.
2. Give it a unique lowercase `slug` with hyphens, a title, category (such as “Program notes”, “Community stories”, or “Findings”), date in YYYY-MM-DD format, author, excerpt, image name, image description, and sections.
3. Set `published` to `false` while drafting. Set it to `true` when the text is approved.
4. Save and publish the website as usual. The article appears automatically at `/blog/your-slug/` and in the blog index, newest first.

Each section has a heading and a list of paragraphs. Text is rendered safely as text, not raw HTML. Use real sources and reviewed results for findings; do not publish placeholder statistics. Drafts are excluded from public pages, but do not store confidential drafts in a public GitHub repository.

Images currently use the paired files in `public/images/programs/`: `name-800.webp` and `name-1600.webp`. The `image` field contains just the name, such as `hands-on-instruction`. Use photos you have permission to publish, and add useful alt text in `imageAlt`.

You can also send an approved article here and ask to add it to the blog. Publishing still requires the existing repository upload step; saving an article locally does not make it live.
