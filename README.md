# Animesh Mishra, portfolio

An editable Next.js portfolio built on a rebuild of [nousresearch.com](https://nousresearch.com)'s layout and design system: written as readable React + TypeScript instead of compiled bundles, with the text in data files you can change and the behaviours (menus, search palette, article tools, 3D scenes) as small components. The structure and artwork are the original's; the words, links and the main poster are Animesh's.

It is meant as a starting point you can adapt to your own site. The look comes from the original's compiled
CSS, fonts and images, which are included so the result matches the live site; see
[Branding](#branding-and-licensing) before publishing anything.

```
Next.js 16 (App Router) · React 19 · TypeScript · three.js · Lenis (smooth scroll)
```

## Run it

```sh
cd web
npm install
npm run dev          # http://localhost:3000  (hot reload)

npm run build        # production build (also type-checks)
npm start            # serve the build; PORT=3100 npm start  (or: npx next start -p 3100)
npm run typecheck
```

Node 20 or newer. Every page is generated at build time; the only server code is `app/api/search`.

## Where things are

```
app/
  layout.tsx            page shell: fonts, theme, frame, header/menu/palette, film grain
  (home)/page.tsx       the home page
  (editorial)/          blog, releases, careers, one job, and each article ([slug])
  api/search/           POST { query } → results, used by the ⌘K palette
  sitemap.ts robots.ts
components/
  home/ blog/ catalogue/ article/   page sections and the article reader
  chrome/               header, footer, frame, art shader, film grain
  research/             nav dropdown, ⌘K palette (Composer), phone menu
  behavior/             smooth scroll, scroll reveals, theme toggle, footer reveal
  ui/                   Button, Dialog, Select, Field, list disclosure, type helpers
  icons/                the SVGs
content/                ← the words. Edit these.
lib/                    helpers, motion, search, 3D scenes, speech
styles/                 the design system's CSS (01–09), page CSS, and custom.css (yours)
public/                 images, fonts, the demo video
tools/                  extraction and verification scripts (not part of the site)
```

## Change the content

Almost all copy lives in `content/`. Edit, save, and the page updates.

| To change | Edit |
| --- | --- |
| Site name, URL, description, share image | `lib/site.ts` (set `NEXT_PUBLIC_SITE_URL` in production) |
| The portfolio hero: name, role, and the main poster photo | `content/portfolio.ts` (image in `public/assets/portfolio/`) |
| Home page About / Research / Building rows, "Selected Work" banner and tiles | `content/home.ts` |
| Name, role, email, poster and the profile / project links used everywhere | `content/portfolio.ts` |
| The "Updates" strip on the home page (LinkedIn posts) | `content/announcements.ts` |
| Footer columns and links | `content/footer.ts` |
| Header dropdowns (About / Work / Elsewhere / Contact) and their promo banner | `content/research-navigation.ts`, `content/navigation.ts` |
| Phone menu | `content/mobile-menu.ts` |
| ⌘K palette's suggested questions and answers | `content/composer.ts` |
| Writing (blog posts): title, author, date, related | `content/posts.ts` |
| Post bodies | `content/posts/<slug>.html` |
| Publications list (the `/releases` route) | `content/releases.ts` |
| Experience (the `/careers` routes: roles, projects, research) | `content/jobs.ts` |

**Add a blog post:** add an entry to `content/posts.ts` (copy an existing one), put the article body in
`content/posts/<your-slug>.html`, and put its images under `public/`. Headings with an `id` become the
article's "Contents" list and reading rail. The post appears on `/blog`, in search, in the sitemap and
under any post that lists it in `related`.

**Filters and search.** Publications, Experience and Writing each have a filter bar (text box, type chips with live counts,
sort, reset) from `components/catalogue/FilteredList.tsx`; the chips come from each item's type (`type` in
`content/releases.ts`, `employment` in `content/jobs.ts`, `tag` in `content/posts.ts`). The filters live in the address
(`?q=&g=&s=`) so a filtered view can be linked, and `/` jumps to the box. The header's Search button (and Cmd/Ctrl+K)
opens the site-wide palette on every page. The pixel-style UI kit is `styles/pixel-ui.css`.

**Search** (`lib/search.ts`) is built from your own content: pages, posts, publications and experience. There is no
external index to maintain.

## Adapt it to your own site

1. `lib/site.ts`: name, URL, description, social links.
2. Replace the images in `public/assets/`. The logo is already yours: it is your signature (see `trace-signature.py` / `make-brand-assets.mjs` below); the tile pictures on the home page, the announcement card art and the demo video are still the original's product shots and artwork.
3. Replace the fonts (`public/font/`, declared with `@font-face` in `styles/06-app.css`); see the licensing note below.
4. Re-theme in `styles/custom.css`, which loads last. The palette is Cherry Cola `#9a0002` and Cream Vanilla
   `#efe6de` (plus a darker cherry `#4d0001` for body copy, and a very dark cherry `#1b0305` for dark mode);
   the "Palette" block at the bottom of that file holds every value, so changing the site's colours is a matter
   of editing it. The blue artwork follows automatically, because most pictures are greyscale blended over the
   ink colour; the exceptions were converted: the poster is toned warm by `tools/obscure-poster.py`, the footer
   picture is recoloured from the original in `tools/assets/footer-field.original.webp` with the same brightness
   curve (the footer's moving effect finds the hand and sparkles by brightness, so keep it if you recolour again), the SVG icons were recoloured, and the logo
   stamps, favicon and share card are regenerated by `tools/make-brand-assets.mjs` (edit `BLUE` / `WHITE` at its
   top). The 3D orb's studio lights are in `lib/orb.ts` and the footer effect's ink in `lib/art-shader.ts`.
5. Rewrite the copy in `content/`, and delete the pages you do not need (and their sitemap entries).

## How it was checked against the live site

The rebuild was compared with nousresearch.com three ways. All of these scripts need the rebuild running
(`npx next start -p 3100`); the first two fetch the live site through Node, so TLS verification stays on.

| Check | Command | Result when this was written |
| --- | --- | --- |
| Server-rendered HTML, element by element, for every sitemap page | `node tools/dom-diff.mjs` | the logo and the home page now differ on purpose, so most pages no longer match the original element for element |
| Pixels against the live site (`FULL=1` for whole pages, `THEME=dark` for dark mode) | `VIEWPORTS=1440x900,390x844 node tools/compare.mjs / /blog …` | see below |
| Behaviour: menus, palette, dialogs, rail, dock, scroll, 3D, video | `node tools/behavior-check.mjs` | all checks pass |

Pixel results, all 36 pages: the first screen is identical at desktop size (36 of 36) and at phone size
(34 of 36); whole pages are identical for 28 of 36 at desktop size; dark mode is identical on the six pages
tried. Every remaining difference was traced to the test environment rather than the rebuild: the original
could not load images from one host (so its articles came out shorter), its announcements request failed
(an error line made its home page 102px taller), and one animated GIF was caught on a different frame.
Against the offline copy of the original, which loads everything, all 19 articles have exactly the same
page height as the rebuild.

The behaviours were also compared against the original running side by side: the same steps on both, with
the resulting state, spoken text, scene pixels and layout compared.

## Differences from the live site

Deliberate, and small:

- **No analytics or tracking.** The original loads Google Tag Manager, Datadog and Vercel Insights; none of
  that is here.
- **Search runs on your content** (`lib/search.ts`) rather than Nous's own index, so results come from this
  site's pages.
- **Updates are static data** (`content/announcements.ts`), summaries of LinkedIn posts. The original loaded its announcements from X with a server action.
- **Canonical and share URLs use `site.url`**, not `nousresearch.com`.
- **The article logo** is chosen on the server for article pages; the live site swaps it after load.
- **One reading-rail preview** (the second "Logic puzzles" section of the thinking-efficiency article) can
  show a different excerpt. The original's rule counts the whitespace in its source HTML as text; this
  one measures real text.
- **Orphaned original assets.** The original's articles, PDFs, hot-linked images and article demos are still under `public/` but nothing links to them any more; delete them when you no longer want them.
- **No site-verification tag.** The original carries Nous's Google site-verification token; it is theirs, so it is left out.
- **Unused components.** The article reader's interactive pieces (the neuron scene, embeds) and `components/home/Hero.tsx` are kept but no page uses them now.

## Credits

Two interactions are ported from Skiper UI (free version): the perspective text scroll, "Skiper 28"
(`components/home/PerspectiveStatement.tsx`, `styles/perspective.css`), and the horizontal hover-expand strips,
"Skiper 52" (`components/home/Affiliations.tsx`, `styles/affiliations.css`). Both were rewritten with CSS and a
scroll listener instead of framer-motion, and styled with this site's palette and fonts.

## Branding and licensing

The portfolio's words, links and poster are Animesh Mishra's. The page design, artwork (hero tiles, mission images, announcement and card art, footer picture, orb), the Hermes demo video and the Rules and Aeonik Fono (trial) fonts come from nousresearch.com and belong to Nous Research and their licensors. This project is for local development and study. Before putting anything
derived from it on a public domain, replace the branding, artwork, text and fonts with your own and make
sure you hold licences for any font you keep.

## Tools (`tools/`)

Not part of the site; used to build and verify it.

| Script | Purpose |
| --- | --- |
| `dom-diff.mjs`, `compare.mjs`, `behavior-check.mjs` | verification (above) |
| `html-to-jsx.mjs` | converts captured HTML into JSX components |
| `extract-posts.mjs`, `extract-lists.mjs`, `extract-shared.mjs`, `write-content.mjs` | one-off extraction of the content files from the captured pages |
| `trace-signature.py`, `make-brand-assets.mjs` | trace the signature photo (`tools/assets/signature-source.webp`) into a vector and generate every logo asset: `public/assets/brand/signature-sprite.svg` (what `<Logo />` draws, in the theme colour), the `Logo` component, orb stamps (PNG), favicon (`public/signature-favicon.png`) and share card. To change the logo: replace the source photo and run both |
| `obscure-poster.py` | blurs and halftones the two background portraits on the home poster (original kept in `tools/assets/`); needs Pillow |
| `localize-external.mjs` | copies hot-linked third-party images into `public/` |

`extract-posts.mjs` keeps math blocks' exact whitespace (they render with `white-space: pre`); run it with
`BODIES_ONLY=1` to rewrite the post bodies without touching `content/posts.ts`.
