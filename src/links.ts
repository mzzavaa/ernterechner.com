/**
 * Cross-site link to the Garden Wiki, resolved per environment (mirrors the
 * wiki's own links.ts). A `VITE_WIKI_URL` build-time property wins if set;
 * otherwise the GitHub Pages URL is used. The wiki's custom domain isn't
 * decided yet — set `VITE_WIKI_URL` in CI when it is; until then the GitHub
 * Pages URL works from every environment (including the calculator's domain).
 */
const GH_PAGES_WIKI = 'https://linda-mhmd.github.io/garden-hub-wiki/';

function resolveWikiUrl(): string {
  const override = import.meta.env.VITE_WIKI_URL as string | undefined;
  return override || GH_PAGES_WIKI;
}

export const WIKI_URL = resolveWikiUrl();

/** Deep-link to a specific plant's page in the wiki (German ids always resolve). */
export function wikiPlantUrl(plantId: string): string {
  return `${WIKI_URL.replace(/\/+$/, '')}/#wiki/pflanze/${plantId}`;
}
