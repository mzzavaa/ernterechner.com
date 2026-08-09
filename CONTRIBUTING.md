# Contributing to Ernterechner

Thanks for helping improve the Ernterechner! You can contribute **entirely from a
phone or browser** — no laptop, no local setup required. This page explains how the
site is built, how previews work, and the exact steps to propose and preview a
change.

---

## 1. How deployment & previews work

Every change is built automatically by GitHub Actions (the **"Deploy & Previews"**
workflow) and published to the `gh-pages` branch. There are three targets:

| What you do | Where it goes live |
|---|---|
| Merge to **`main`** | Production — `https://mzzavaa.github.io/ernterechner.com/` (and `https://ernterechner.com` once DNS is set) |
| Push to the **`dev`** branch | Sandbox — `…/ernterechner.com/preview/dev/` |
| Open a **Pull Request** | Preview — `…/ernterechner.com/pr-preview/pr-<NUMBER>/` |

- When you open a PR, a bot automatically **posts the preview link as a comment**
  on the PR. Open it on your phone to see your change running live.
- Every new push to that PR **updates the same preview**.
- When the PR is merged or closed, its preview folder is **removed automatically**.

This works because the site uses relative asset paths and hash-based routing, so
it runs correctly from any sub-folder. Production, dev, and every open PR coexist
on the one `gh-pages` branch. There are **no secrets and no backend** — it's a
static single-page app with no login and no data collection.

---

## 2. Propose & preview a change — from your phone

1. **Find the file** you want to edit (see "Where the content lives" below).
2. Tap the **pencil / Edit** icon. If you're not a collaborator, GitHub will
   offer to **fork** the repo for you — accept; it's automatic.
3. Make your edit, then tap **Commit changes → Create a new branch → Propose
   changes**. This opens a **Pull Request** against `main`.
4. Wait ~1 minute. The **"Deploy & Previews"** check runs and the preview bot
   comments a link like `…/pr-preview/pr-12/`. **Tap it to see your change live.**
5. Need to tweak it? Edit again on the **same branch** → the same preview URL
   refreshes.
6. When it looks good, a maintainer merges the PR → your change goes to
   **production**, and the preview is cleaned up.

That's the whole loop: **edit → open PR → open the preview link → iterate → merge.**

---

## 3. A stable sandbox: the `dev` branch

If you want to try a larger idea without opening a PR yet, commit it to the
**`dev`** branch. It publishes to `…/ernterechner.com/preview/dev/` and updates on
every push there.

---

## 4. Where the content lives

Most changes are plain data — you don't need to touch React to adjust a crop.

| Content | File |
|---|---|
| Yields, spacing, kcal, sowing/harvest months per crop | `src/data/yieldData.ts` (`YIELD_DATA`) |
| Plant varieties, colors, growth visuals | `src/data/plantVisuals.ts` |
| Beginner tips / companion planting shown in the calculator | `src/data/wiki.ts` (`WIKI_PLANTS`) |
| The calculator UI | `src/components/YieldCalculator.tsx` |
| The bed visualisation | `src/components/BedVisualizer.tsx` |
| Colors & fonts (design tokens) | `src/index.css` |

Each crop is a JavaScript object in an array — copy an existing entry and edit its
fields to add a new one.

---

## 5. Content & style rules

- **Planting knowledge only.** Never add personal data, real names, addresses,
  GPS coordinates, or any detail about a specific real property or building
  project. General horticultural richtwerte are the point; anything identifying a
  real place or person is not.
- **Design tokens:** use `var(--c-*)` colors and `var(--f-*)` fonts from
  `src/index.css` — never hard-code colors or fonts.
- **Fonts:** Fraunces (headings), DM Sans (all other text), JetBrains Mono
  (numbers only).
- **Separators:** `·` (middle dot) between items, `–` (en-dash) for ranges.
  Never use `—` (em-dash).
- **Icons:** SVG only, no emoji in the UI.

---

## 6. Local development (optional — when you have a computer)

```bash
npm install
npm run dev       # local dev server with hot reload
npm run build     # production build into dist/
npm run preview   # serve the built site locally
npm run lint
```

Node 22 is used in CI. You do **not** need any of this to contribute — the browser
flow in section 2 is enough.

---

## 7. Maintainer setup (one-time, per repo)

For the published `gh-pages` branch to actually serve, GitHub Pages must be set to
that branch:

> **Settings → Pages → Build and deployment → Source → "Deploy from a branch" →
> Branch: `gh-pages`, Folder: `/ (root)` → Save**

For the custom domain, `public/CNAME` already contains `ernterechner.com`; point the
domain's DNS at GitHub Pages to activate it. Until then the site is reachable at the
`github.io` URL above.
