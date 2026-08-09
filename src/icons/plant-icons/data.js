// plant-icons/data.js
// ─────────────────────────────────────────────────────────────────────────────
// Garden Hub — Plant Growth-Stage Icon Library v2
//
//   30 plants × 4 stages = 120 colourful illustrated icons.
//   Style matches the Seitenansicht/Höhe panel: warm fills with darker
//   outlines, recognisable plant silhouettes, soft natural colours.
//
// Stages
//   aussaat      — Sowing (the seed/bulb/tuber/cutting itself, in soil)
//   keimling     — Germination (first sprout, cotyledons)
//   jungpflanze  — Young plant (small distinctive form)
//   reif         — Mature / harvest-ready (full produce visible)
//
// Theming
//   Every fill colour is a CSS custom property with a built-in fallback:
//     fill="var(--pi-leaf, #6da848)"
//   To re-skin all icons globally, set the variables on any ancestor:
//     .my-app { --pi-leaf: #4a8e3a; --pi-soil: #6a4a2a; ... }
//   The component also forwards a `palette` prop that writes these vars
//   inline on the wrapper SVG.
//
// Coordinate system
//   viewBox 0 0 64 64, soil line at y = 54. Below y = 54 is "underground".
// ─────────────────────────────────────────────────────────────────────────────

// ─── palette tokens ──────────────────────────────────────────────────────────
const C = {
  soil:        'var(--pi-soil, #8a6a42)',
  soilD:       'var(--pi-soil-dark, #5a3f25)',
  soilLine:    'var(--pi-soil-line, #6a4a28)',
  leaf:        'var(--pi-leaf, #6da848)',
  leafD:       'var(--pi-leaf-dark, #2f5a26)',
  leafL:       'var(--pi-leaf-light, #9ec870)',
  stem:        'var(--pi-stem, #3a6a30)',
  flower:      'var(--pi-flower, #e6c34a)',
  flowerD:     'var(--pi-flower-dark, #a07820)',
  red:         'var(--pi-red, #e85d4a)',
  redD:        'var(--pi-red-dark, #a02a1a)',
  purple:      'var(--pi-purple, #7a3a8a)',
  purpleD:     'var(--pi-purple-dark, #4a1a5a)',
  orange:      'var(--pi-orange, #e08940)',
  orangeD:     'var(--pi-orange-dark, #9a5818)',
  yellow:      'var(--pi-yellow, #e6c34a)',
  yellowD:     'var(--pi-yellow-dark, #9a7820)',
  pink:        'var(--pi-pink, #d0335f)',
  pinkD:       'var(--pi-pink-dark, #8a1f3a)',
  white:       'var(--pi-white, #f0e8d4)',
  whiteD:      'var(--pi-white-dark, #a89a72)',
  violet:      'var(--pi-violet, #a878c8)',
  violetD:     'var(--pi-violet-dark, #5a2f7a)',
};

// ─── shared primitives ───────────────────────────────────────────────────────
const SOIL_LINE = `<line x1="6" y1="54" x2="58" y2="54" stroke="${C.soilLine}" stroke-width="1.4" stroke-linecap="round"/>`;
const SOIL_BAND = `<rect x="0" y="54" width="64" height="10" fill="${C.soil}" opacity="0.18"/>` + SOIL_LINE;
const SOIL_FRESH = `<rect x="0" y="54" width="64" height="10" fill="${C.soil}" opacity="0.22"/>
  <line x1="6" y1="54" x2="58" y2="54" stroke="${C.soilLine}" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="2.5 3"/>`;

// dust seeds (3-5 tiny dots scattered just on soil)
const dustSeeds = (xs = [22, 30, 38, 46]) => xs.map((x, i) => `<circle cx="${x}" cy="${52 - (i % 2)}" r="0.9" fill="${C.soilD}"/>`).join('');
// medium round seeds (ovals on soil)
const ovalSeeds = (xs = [24, 34, 44]) => xs.map((x) => `<ellipse cx="${x}" cy="${52}" rx="1.8" ry="1.1" fill="${C.soilD}"/>`).join('');
// flat large seeds (squash/cucumber/zucchini)
const flatSeeds = (xs = [24, 40]) => xs.map((x) => `<ellipse cx="${x}" cy="${52}" rx="3" ry="1.4" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.6" transform="rotate(${x > 32 ? 15 : -15} ${x} ${52})"/>`).join('');
// cluster seeds (beet/chard - irregular)
const clusterSeeds = (xs = [22, 34, 46]) => xs.map((x) => `<path d="M ${x-2} 51 q 0 -2 2 -2 q 2 0 2 2 q 0 2 -2 2 q -2 0 -2 -2 z" fill="${C.soilD}" stroke="${C.soilLine}" stroke-width="0.5"/>`).join('');

// generic sprout (cotyledons + stem)
const cotyledon = (cx, cy, side = 'L', tone = 'light') => {
  const lf = tone === 'light' ? C.leafL : C.leaf;
  const dr = side === 'L' ? -25 : 25;
  return `<ellipse cx="${cx}" cy="${cy}" rx="5" ry="2.8" fill="${lf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(${dr} ${cx} ${cy})"/>`;
};

// leaf along stem (pointing up)
const leaf = (x, y, w = 5, h = 8, rot = 0, tone = 'mid') => {
  const lf = tone === 'light' ? C.leafL : tone === 'dark' ? C.leafD : C.leaf;
  return `<path d="M ${x} ${y} q ${w} -${h*0.4} 0 -${h} q -${w} ${h*0.6} 0 ${h} z" fill="${lf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(${rot} ${x} ${y})"/>`;
};

const PLANT_ICONS = {

  // ════════════════════════════════════════════════════════════════════════
  // FRUCHTGEMÜSE
  // ════════════════════════════════════════════════════════════════════════
  tomate: {
    aussaat: SOIL_FRESH + ovalSeeds([22, 32, 42]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="44" stroke="${C.stem}" stroke-width="1.5"/>
      ${cotyledon(28, 44, 'L', 'light')}
      ${cotyledon(36, 44, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="26" stroke="${C.stem}" stroke-width="1.6"/>
      ${leaf(28, 46, 5, 9, -30)}
      ${leaf(36, 40, 5, 9, 30)}
      ${leaf(28, 32, 4, 7, -25)}
      <circle cx="36" cy="34" r="2.5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 35 31.5 q 0 -2 2 -2" stroke="${C.leafD}" stroke-width="0.6" fill="none"/>`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="12" stroke="${C.stem}" stroke-width="1.8"/>
      ${leaf(26, 48, 6, 10, -30)}
      ${leaf(38, 42, 6, 10, 30)}
      ${leaf(26, 34, 5, 9, -28)}
      ${leaf(38, 24, 5, 9, 28)}
      <circle cx="27" cy="42" r="3.8" fill="${C.red}" stroke="${C.redD}" stroke-width="0.8"/>
      <circle cx="37" cy="38" r="3.8" fill="${C.red}" stroke="${C.redD}" stroke-width="0.8"/>
      <circle cx="29" cy="30" r="3.5" fill="${C.red}" stroke="${C.redD}" stroke-width="0.8"/>
      <circle cx="35" cy="20" r="3.5" fill="${C.red}" stroke="${C.redD}" stroke-width="0.8"/>
      <path d="M 27 38 q 0 -2 2 -2.5 M 37 34 q 0 -2 2 -2.5 M 29 26.5 q 0 -2 2 -2 M 35 16.5 q 0 -2 2 -2" stroke="${C.leafD}" stroke-width="0.8" fill="none"/>`,
  },

  melanzani: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="44" stroke="${C.stem}" stroke-width="1.5"/>
      ${cotyledon(28, 44, 'L', 'mid')}
      ${cotyledon(36, 44, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="32" stroke="${C.stem}" stroke-width="1.6"/>
      ${leaf(26, 46, 6, 9, -35, 'mid')}
      ${leaf(38, 40, 6, 9, 35, 'mid')}
      ${leaf(30, 34, 5, 8, -15, 'mid')}`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="20" stroke="${C.stem}" stroke-width="1.8"/>
      ${leaf(24, 46, 7, 11, -40, 'mid')}
      ${leaf(40, 42, 7, 11, 40, 'mid')}
      ${leaf(28, 28, 5, 9, -25, 'mid')}
      <ellipse cx="26" cy="48" rx="3" ry="6" fill="${C.purple}" stroke="${C.purpleD}" stroke-width="0.8"/>
      <ellipse cx="40" cy="46" rx="3" ry="6" fill="${C.purple}" stroke="${C.purpleD}" stroke-width="0.8"/>
      <path d="M 26 42 l 1 -3 l 2 1 M 40 40 l -1 -3 l -2 1" stroke="${C.leafD}" stroke-width="0.8" fill="${C.leaf}"/>`,
  },

  paprika: {
    aussaat: SOIL_FRESH + dustSeeds([22, 30, 38, 46]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="44" stroke="${C.stem}" stroke-width="1.5"/>
      ${cotyledon(28, 44, 'L', 'light')}
      ${cotyledon(36, 44, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="32" stroke="${C.stem}" stroke-width="1.6"/>
      ${leaf(27, 44, 5, 8, -25)}
      ${leaf(37, 40, 5, 8, 25)}
      ${leaf(30, 34, 4, 7, -10)}`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="22" stroke="${C.stem}" stroke-width="1.7"/>
      ${leaf(24, 44, 6, 9, -35)}
      ${leaf(40, 40, 6, 9, 35)}
      ${leaf(27, 30, 5, 8, -25)}
      <path d="M 22 44 q -2 6 2 11 q 4 -1 4 -4 q 2 5 4 4 q 4 -5 2 -11 z" fill="${C.red}" stroke="${C.redD}" stroke-width="0.8"/>
      <path d="M 23 44 l 0 -3 l 8 0 l 0 3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 38 36 q -2 6 2 11 q 4 -1 4 -4 q 2 5 4 4 q 4 -5 2 -11 z" fill="${C.red}" stroke="${C.redD}" stroke-width="0.8"/>
      <path d="M 39 36 l 0 -3 l 8 0 l 0 3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>`,
  },

  kuerbis: {
    aussaat: SOIL_FRESH + flatSeeds([24, 40]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.5"/>
      <ellipse cx="25" cy="44" rx="7" ry="3.5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-15 25 44)"/>
      <ellipse cx="39" cy="44" rx="7" ry="3.5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(15 39 44)"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="40" stroke="${C.stem}" stroke-width="1.6"/>
      <path d="M 16 40 q 0 -10 16 -10 q 16 0 16 10 q -4 4 -16 4 q -12 0 -16 -4 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 22 38 q 4 -8 10 -8 M 32 30 v 10 M 42 38 q -4 -8 -10 -8" stroke="${C.leafD}" stroke-width="0.7" fill="none"/>`,
    reif: SOIL_BAND + `
      <ellipse cx="32" cy="46" rx="22" ry="12" fill="${C.orange}" stroke="${C.orangeD}" stroke-width="1"/>
      <path d="M 20 35 q 0 11 0 22 M 28 32 q -1 12 0 24 M 32 32 v 26 M 36 32 q 1 12 0 24 M 44 35 q 0 11 0 22" stroke="${C.orangeD}" stroke-width="1" fill="none"/>
      <path d="M 32 34 q -2 -7 4 -10" stroke="${C.stem}" stroke-width="1.5" fill="none"/>
      <ellipse cx="38" cy="22" rx="5" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-20 38 22)"/>`,
  },

  zucchini: {
    aussaat: SOIL_FRESH + flatSeeds([26, 40]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.5"/>
      <ellipse cx="26" cy="44" rx="7" ry="3" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-20 26 44)"/>
      <ellipse cx="38" cy="44" rx="7" ry="3" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(20 38 44)"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="38" stroke="${C.stem}" stroke-width="1.6"/>
      <path d="M 18 38 q 0 -10 14 -10 q 14 0 14 10 q -4 3 -14 3 q -10 0 -14 -3 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="34" stroke="${C.stem}" stroke-width="1.6"/>
      <path d="M 14 36 q 0 -12 18 -12 q 18 0 18 12 q -6 4 -18 4 q -12 0 -18 -4 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.9"/>
      <path d="M 22 34 q 5 -8 10 -8 M 32 26 v 10 M 42 34 q -5 -8 -10 -8" stroke="${C.leafD}" stroke-width="0.7" fill="none"/>
      <ellipse cx="22" cy="50" rx="3" ry="9" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(-15 22 50)"/>
      <ellipse cx="44" cy="48" rx="3" ry="9" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(15 44 48)"/>
      <path d="M 22 41 v -2 M 44 39 v -2" stroke="${C.stem}" stroke-width="1.2"/>`,
  },

  gurke: {
    aussaat: SOIL_FRESH + flatSeeds([26, 40]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.5"/>
      ${cotyledon(27, 44, 'L', 'light')}
      ${cotyledon(37, 44, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <path d="M 32 54 Q 36 38 26 22" stroke="${C.stem}" stroke-width="1.8" fill="none"/>
      ${leaf(28, 42, 6, 9, -45)}
      ${leaf(30, 28, 5, 8, 35)}`,
    reif: SOIL_BAND + `
      <path d="M 32 54 Q 38 36 22 12" stroke="${C.stem}" stroke-width="1.8" fill="none"/>
      ${leaf(26, 46, 7, 11, -50)}
      ${leaf(34, 32, 7, 11, 50)}
      ${leaf(26, 18, 6, 10, -45)}
      <ellipse cx="38" cy="36" rx="2.6" ry="9" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(25 38 36)"/>
      <path d="M 38 32 l 0 -3 l 1 1" stroke="${C.stem}" stroke-width="1" fill="none" transform="rotate(25 38 36)"/>
      <ellipse cx="20" cy="22" rx="2.4" ry="8" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(-25 20 22)"/>`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // BLATTGEMÜSE
  // ════════════════════════════════════════════════════════════════════════
  spinat: {
    aussaat: SOIL_FRESH + clusterSeeds([22, 34, 46]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.4"/>
      ${cotyledon(28, 46, 'L', 'mid')}
      ${cotyledon(36, 46, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <path d="M 32 54 v -4" stroke="${C.stem}" stroke-width="1.4"/>
      ${leaf(26, 46, 5, 8, -50, 'mid')}
      ${leaf(32, 42, 5, 9, 0, 'mid')}
      ${leaf(38, 46, 5, 8, 50, 'mid')}`,
    reif: SOIL_BAND + `
      <path d="M 32 54 v -3" stroke="${C.stem}" stroke-width="1.5"/>
      ${leaf(20, 46, 6, 11, -65)}
      ${leaf(26, 38, 6, 12, -35)}
      ${leaf(32, 34, 6, 13, 0)}
      ${leaf(38, 38, 6, 12, 35)}
      ${leaf(44, 46, 6, 11, 65)}`,
  },

  mangold: {
    aussaat: SOIL_FRESH + clusterSeeds([22, 34, 46]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.red}" stroke-width="1.6"/>
      ${cotyledon(28, 46, 'L', 'mid')}
      ${cotyledon(36, 46, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="27" y1="54" x2="27" y2="38" stroke="${C.red}" stroke-width="2.2"/>
      <line x1="32" y1="54" x2="32" y2="35" stroke="${C.yellow}" stroke-width="2.2"/>
      <line x1="37" y1="54" x2="37" y2="38" stroke="${C.red}" stroke-width="2.2"/>
      <ellipse cx="27" cy="34" rx="5" ry="6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <ellipse cx="32" cy="30" rx="5" ry="6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <ellipse cx="37" cy="34" rx="5" ry="6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>`,
    reif: SOIL_BAND + `
      <line x1="22" y1="54" x2="22" y2="32" stroke="${C.red}" stroke-width="2.4"/>
      <line x1="28" y1="54" x2="28" y2="24" stroke="${C.yellow}" stroke-width="2.4"/>
      <line x1="34" y1="54" x2="34" y2="22" stroke="${C.pink}" stroke-width="2.4"/>
      <line x1="40" y1="54" x2="40" y2="24" stroke="${C.red}" stroke-width="2.4"/>
      <line x1="46" y1="54" x2="46" y2="32" stroke="${C.yellow}" stroke-width="2.4"/>
      <ellipse cx="22" cy="28" rx="6" ry="9" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <ellipse cx="28" cy="20" rx="6" ry="9" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <ellipse cx="34" cy="18" rx="6" ry="9" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <ellipse cx="40" cy="20" rx="6" ry="9" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <ellipse cx="46" cy="28" rx="6" ry="9" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>`,
  },

  kohl: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.4"/>
      ${cotyledon(28, 46, 'L', 'mid')}
      ${cotyledon(36, 46, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <path d="M 32 54 v -4" stroke="${C.stem}" stroke-width="1.4"/>
      <ellipse cx="32" cy="44" rx="11" ry="7" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 22 44 q 4 -8 10 -3 M 32 39 q 4 -7 10 -2 M 24 47 q 4 -4 8 -2 M 32 48 q 4 -3 8 -1" stroke="${C.leafD}" stroke-width="0.8" fill="none"/>`,
    reif: SOIL_BAND + `
      <path d="M 32 54 v -3" stroke="${C.stem}" stroke-width="1.4"/>
      <circle cx="32" cy="36" r="16" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="1"/>
      <path d="M 16 38 q 8 -12 16 -2 M 32 36 q 8 -12 16 -2 M 18 30 q 8 -10 14 0 M 32 28 q 8 -10 14 0 M 22 46 q 6 -6 10 0 M 32 46 q 6 -6 10 0" stroke="${C.leafD}" stroke-width="1" fill="none"/>
      <circle cx="32" cy="36" r="3" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8"/>`,
  },

  kohlrabi: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.5"/>
      ${cotyledon(28, 46, 'L', 'mid')}
      ${cotyledon(36, 46, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="32" cy="48" rx="8" ry="5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8"/>
      <line x1="29" y1="43" x2="26" y2="34" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="32" y1="42" x2="32" y2="30" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="35" y1="43" x2="38" y2="34" stroke="${C.stem}" stroke-width="1.3"/>
      ${leaf(26, 32, 4, 6, -20)}
      ${leaf(32, 28, 4, 7, 0)}
      ${leaf(38, 32, 4, 6, 20)}`,
    reif: SOIL_BAND + `
      <ellipse cx="32" cy="44" rx="13" ry="11" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="1"/>
      <path d="M 32 33 q -1 -1 -3 -1 M 32 33 q 1 -1 3 -1 M 32 33 v -1" stroke="${C.stem}" stroke-width="0.8"/>
      <line x1="28" y1="35" x2="22" y2="20" stroke="${C.stem}" stroke-width="1.5"/>
      <line x1="32" y1="33" x2="32" y2="14" stroke="${C.stem}" stroke-width="1.5"/>
      <line x1="36" y1="35" x2="42" y2="20" stroke="${C.stem}" stroke-width="1.5"/>
      ${leaf(22, 18, 5, 7, -25)}
      ${leaf(32, 12, 5, 8, 0)}
      ${leaf(42, 18, 5, 7, 25)}`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // SALATE
  // ════════════════════════════════════════════════════════════════════════
  salat: {
    aussaat: SOIL_FRESH + dustSeeds([20, 28, 36, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 48, 'L', 'light')}
      ${cotyledon(36, 48, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="32" cy="48" rx="11" ry="5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 22 48 q 4 -8 10 -4 M 32 44 q 4 -8 10 -4 M 24 50 q 4 -4 8 -2 M 32 50 q 4 -3 8 -1" stroke="${C.leafD}" stroke-width="0.8" fill="none"/>`,
    reif: SOIL_BAND + `
      <path d="M 14 50 q 4 -22 18 -22 q 14 0 18 22 q -8 4 -18 4 q -10 0 -18 -4 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="1"/>
      <path d="M 18 44 q 6 -12 14 -10 M 32 32 q 6 -10 14 -2 M 22 36 q 6 -10 10 -4 M 32 28 q 6 -8 10 -2" stroke="${C.leafD}" stroke-width="0.9" fill="none"/>
      <path d="M 32 32 q -2 -8 0 -14" stroke="${C.leafD}" stroke-width="0.9" fill="none"/>`,
  },

  rucola: {
    aussaat: SOIL_FRESH + dustSeeds([20, 28, 36, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 48, 'L', 'light')}
      ${cotyledon(36, 48, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="32" cy="48" rx="10" ry="5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 24 48 l 2 -6 l 2 4 l 2 -6 l 2 4 M 34 48 l 2 -6 l 2 4 l 2 -6 l 2 4" stroke="${C.leafD}" stroke-width="0.8" fill="none"/>`,
    reif: SOIL_BAND + `
      <path d="M 14 50 q 0 -8 6 -10 q -2 -5 2 -8 q 4 4 4 8 q 4 -10 8 -10 q 4 0 8 10 q 0 -4 4 -8 q 4 3 2 8 q 6 2 6 10 q -8 4 -18 4 q -14 0 -22 -4 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="1"/>
      <path d="M 24 42 l 2 -8 M 32 38 l 2 -10 M 40 42 l 2 -8 M 20 46 l 1 -6 M 44 46 l 1 -6" stroke="${C.leafD}" stroke-width="0.8" fill="none"/>`,
  },

  feldsalat: {
    aussaat: SOIL_FRESH + dustSeeds([24, 32, 40]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="49" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 49, 'L', 'mid')}
      ${cotyledon(36, 49, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="28" cy="47" rx="3.5" ry="5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-25 28 47)"/>
      <ellipse cx="32" cy="45" rx="3.5" ry="5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>
      <ellipse cx="36" cy="47" rx="3.5" ry="5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(25 36 47)"/>`,
    reif: SOIL_BAND + `
      <ellipse cx="22" cy="46" rx="4" ry="7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(-40 22 46)"/>
      <ellipse cx="27" cy="40" rx="4" ry="7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(-15 27 40)"/>
      <ellipse cx="32" cy="38" rx="4" ry="7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <ellipse cx="37" cy="40" rx="4" ry="7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(15 37 40)"/>
      <ellipse cx="42" cy="46" rx="4" ry="7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(40 42 46)"/>`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // WURZEL / KNOLLE
  // ════════════════════════════════════════════════════════════════════════
  karotte: {
    aussaat: SOIL_FRESH + dustSeeds([20, 28, 36, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.2"/>
      <path d="M 32 48 l -3 -4 M 32 48 l 3 -4 M 32 46 l 0 -4" stroke="${C.stem}" stroke-width="1.2"/>`,
    jungpflanze: SOIL_BAND + `
      <path d="M 28 54 l 4 8 l 4 -8 z" fill="${C.orange}" stroke="${C.orangeD}" stroke-width="0.8" opacity="0.5"/>
      <line x1="28" y1="54" x2="26" y2="40" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="32" y1="54" x2="32" y2="36" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="36" y1="54" x2="38" y2="40" stroke="${C.stem}" stroke-width="1.2"/>
      <path d="M 26 40 l -4 -6 M 26 40 l 0 -6 M 32 36 l -3 -6 M 32 36 l 3 -6 M 38 40 l 4 -6 M 38 40 l 0 -6" stroke="${C.stem}" stroke-width="0.9"/>`,
    reif: SOIL_BAND + `
      <path d="M 26 54 l 2 0 l 2 10 l 2 -10 l 2 0 l 2 -2 l -2 -2 l -8 0 l -2 2 l 2 2 z" fill="${C.orange}" stroke="${C.orangeD}" stroke-width="0.9"/>
      <path d="M 28 56 l 1 1 M 30 60 l 1 1 M 32 62 l 1 1 M 28 58 l 4 0 M 28 60 l 3 0" stroke="${C.orangeD}" stroke-width="0.6"/>
      <line x1="28" y1="54" x2="22" y2="28" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="32" y1="54" x2="32" y2="20" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="36" y1="54" x2="42" y2="28" stroke="${C.stem}" stroke-width="1.3"/>
      <path d="M 22 28 l -5 -8 M 22 28 l -1 -10 M 22 28 l 4 -10 M 32 20 l -4 -10 M 32 20 l 0 -10 M 32 20 l 4 -10 M 42 28 l 5 -8 M 42 28 l 1 -10 M 42 28 l -4 -10" stroke="${C.stem}" stroke-width="1" fill="none"/>`,
  },

  radieschen: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="49" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 49, 'L', 'mid')}
      ${cotyledon(36, 49, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="32" cy="52" rx="6" ry="3" fill="${C.pink}" stroke="${C.pinkD}" stroke-width="0.8" opacity="0.6"/>
      ${leaf(28, 48, 4, 7, -25)}
      ${leaf(32, 44, 4, 7, 0)}
      ${leaf(36, 48, 4, 7, 25)}`,
    reif: SOIL_BAND + `
      <path d="M 32 60 l 1 2" stroke="${C.pinkD}" stroke-width="1" fill="none"/>
      <circle cx="32" cy="52" r="8" fill="${C.pink}" stroke="${C.pinkD}" stroke-width="1"/>
      <path d="M 28 50 q 4 -2 8 0" stroke="${C.white}" stroke-width="0.8" fill="none"/>
      ${leaf(22, 38, 5, 9, -35)}
      ${leaf(28, 32, 5, 10, -15)}
      ${leaf(36, 32, 5, 10, 15)}
      ${leaf(42, 38, 5, 9, 35)}
      <line x1="22" y1="38" x2="29" y2="46" stroke="${C.stem}" stroke-width="1"/>
      <line x1="28" y1="32" x2="31" y2="44" stroke="${C.stem}" stroke-width="1"/>
      <line x1="36" y1="32" x2="33" y2="44" stroke="${C.stem}" stroke-width="1"/>
      <line x1="42" y1="38" x2="35" y2="46" stroke="${C.stem}" stroke-width="1"/>`,
  },

  'rote-bete': {
    aussaat: SOIL_FRESH + clusterSeeds([22, 34, 46]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.pink}" stroke-width="1.4"/>
      ${cotyledon(28, 46, 'L', 'mid')}
      ${cotyledon(36, 46, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="32" cy="52" rx="7" ry="4" fill="${C.pink}" stroke="${C.pinkD}" stroke-width="0.8" opacity="0.55"/>
      <line x1="28" y1="48" x2="26" y2="36" stroke="${C.pink}" stroke-width="1.4"/>
      <line x1="32" y1="46" x2="32" y2="32" stroke="${C.pink}" stroke-width="1.4"/>
      <line x1="36" y1="48" x2="38" y2="36" stroke="${C.pink}" stroke-width="1.4"/>
      ${leaf(26, 34, 4, 7, -25)}
      ${leaf(32, 30, 4, 7, 0)}
      ${leaf(38, 34, 4, 7, 25)}`,
    reif: SOIL_BAND + `
      <path d="M 32 60 l 1 2" stroke="${C.pinkD}" stroke-width="1" fill="none"/>
      <ellipse cx="32" cy="50" rx="9" ry="7" fill="${C.pink}" stroke="${C.pinkD}" stroke-width="1"/>
      <path d="M 26 48 q 6 -2 12 0" stroke="${C.pinkD}" stroke-width="0.7" fill="none" opacity="0.6"/>
      <line x1="26" y1="44" x2="22" y2="26" stroke="${C.pink}" stroke-width="1.5"/>
      <line x1="32" y1="42" x2="32" y2="20" stroke="${C.pink}" stroke-width="1.5"/>
      <line x1="38" y1="44" x2="42" y2="26" stroke="${C.pink}" stroke-width="1.5"/>
      ${leaf(22, 24, 5, 8, -30)}
      ${leaf(32, 18, 5, 9, 0)}
      ${leaf(42, 24, 5, 8, 30)}`,
  },

  pastinake: {
    aussaat: SOIL_FRESH + dustSeeds([22, 30, 38, 46]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.2"/>
      <path d="M 32 48 l -3 -4 M 32 48 l 3 -4" stroke="${C.stem}" stroke-width="1.2"/>`,
    jungpflanze: SOIL_BAND + `
      <path d="M 28 54 l 4 8 l 4 -8 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8" opacity="0.4"/>
      <line x1="32" y1="54" x2="32" y2="42" stroke="${C.stem}" stroke-width="1.3"/>
      <path d="M 32 42 l -6 -6 M 32 42 l 6 -6 M 32 42 l -2 -8 M 32 42 l 2 -8" stroke="${C.stem}" stroke-width="1"/>`,
    reif: SOIL_BAND + `
      <path d="M 26 54 l 2 0 l 4 10 l 4 -10 l 2 0 l -2 -3 l -8 0 l -2 3 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <path d="M 28 56 l 1 1 M 30 60 l 1 1 M 32 62 l 1 1" stroke="${C.whiteD}" stroke-width="0.6"/>
      <line x1="32" y1="54" x2="32" y2="28" stroke="${C.stem}" stroke-width="1.3"/>
      <path d="M 32 30 l -10 -10 M 32 30 l 10 -10 M 32 28 l -4 -14 M 32 28 l 4 -14 M 32 30 l -16 -8 M 32 30 l 16 -8" stroke="${C.stem}" stroke-width="1.1" fill="none"/>`,
  },

  knollensellerie: {
    aussaat: SOIL_FRESH + dustSeeds([24, 32, 40]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 48, 'L', 'mid')}
      ${cotyledon(36, 48, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="42" stroke="${C.stem}" stroke-width="1.4"/>
      ${leaf(27, 40, 4, 6, -25)}
      ${leaf(32, 36, 4, 6, 0)}
      ${leaf(37, 40, 4, 6, 25)}`,
    reif: SOIL_BAND + `
      <path d="M 20 52 q 0 -8 12 -8 q 12 0 12 8 q -4 4 -12 4 q -8 0 -12 -4 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <path d="M 24 50 q -3 1 -5 -1 M 39 50 q 3 1 5 -1 M 32 56 q -2 2 -3 4 M 32 56 q 2 2 3 4" stroke="${C.whiteD}" stroke-width="0.7" fill="none"/>
      <line x1="26" y1="44" x2="22" y2="26" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="32" y1="42" x2="32" y2="20" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="38" y1="44" x2="42" y2="26" stroke="${C.stem}" stroke-width="1.3"/>
      ${leaf(22, 24, 4, 7, -25)}
      ${leaf(32, 18, 4, 8, 0)}
      ${leaf(42, 24, 4, 7, 25)}`,
  },

  knollenfenchel: {
    aussaat: SOIL_FRESH + dustSeeds([24, 32, 40]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 48, 'L', 'light')}
      ${cotyledon(36, 48, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="32" cy="50" rx="6" ry="3.5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8"/>
      <line x1="30" y1="46" x2="28" y2="34" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="32" y1="44" x2="32" y2="30" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="34" y1="46" x2="36" y2="34" stroke="${C.stem}" stroke-width="1.2"/>
      <path d="M 28 34 l -3 -4 M 28 34 l 3 -4 M 32 30 l -3 -4 M 32 30 l 3 -4 M 36 34 l -3 -4 M 36 34 l 3 -4" stroke="${C.stem}" stroke-width="0.9"/>`,
    reif: SOIL_BAND + `
      <path d="M 20 52 q 0 -10 12 -10 q 12 0 12 10 q -4 4 -12 4 q -8 0 -12 -4 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="1"/>
      <path d="M 22 50 q 4 2 5 4 M 32 56 q 0 2 1 5 M 42 50 q -4 2 -5 4" stroke="${C.leafD}" stroke-width="0.8" fill="none"/>
      <line x1="26" y1="42" x2="22" y2="22" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="32" y1="40" x2="32" y2="14" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="38" y1="42" x2="42" y2="22" stroke="${C.stem}" stroke-width="1.3"/>
      <path d="M 22 22 l -4 -6 M 22 22 l 0 -7 M 22 22 l 4 -6 M 32 14 l -4 -6 M 32 14 l 0 -7 M 32 14 l 4 -6 M 42 22 l -4 -6 M 42 22 l 0 -7 M 42 22 l 4 -6" stroke="${C.stem}" stroke-width="1"/>`,
  },

  kartoffel: {
    aussaat: SOIL_FRESH + `
      <ellipse cx="22" cy="59" rx="5" ry="3.5" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <ellipse cx="42" cy="60" rx="5" ry="3.5" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <circle cx="20" cy="58" r="0.6" fill="${C.whiteD}"/>
      <circle cx="24" cy="60" r="0.6" fill="${C.whiteD}"/>
      <circle cx="40" cy="59" r="0.6" fill="${C.whiteD}"/>
      <circle cx="44" cy="61" r="0.6" fill="${C.whiteD}"/>`,
    keimling: SOIL_BAND + `
      <ellipse cx="32" cy="60" rx="5" ry="3" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8" opacity="0.7"/>
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.4"/>
      ${cotyledon(28, 46, 'L', 'mid')}
      ${cotyledon(36, 46, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="22" cy="60" rx="4" ry="3" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8" opacity="0.6"/>
      <ellipse cx="42" cy="61" rx="4" ry="3" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8" opacity="0.6"/>
      <line x1="32" y1="54" x2="32" y2="36" stroke="${C.stem}" stroke-width="1.6"/>
      ${leaf(26, 46, 5, 8, -30)}
      ${leaf(38, 42, 5, 8, 30)}
      ${leaf(30, 36, 4, 7, -10)}`,
    reif: SOIL_BAND + `
      <ellipse cx="20" cy="60" rx="5" ry="3.5" fill="${C.white}" stroke="${C.whiteD}" stroke-width="1"/>
      <ellipse cx="32" cy="61" rx="5.5" ry="3.5" fill="${C.white}" stroke="${C.whiteD}" stroke-width="1"/>
      <ellipse cx="44" cy="60" rx="5" ry="3.5" fill="${C.white}" stroke="${C.whiteD}" stroke-width="1"/>
      <circle cx="18" cy="59" r="0.6" fill="${C.whiteD}"/>
      <circle cx="30" cy="60" r="0.6" fill="${C.whiteD}"/>
      <circle cx="42" cy="59" r="0.6" fill="${C.whiteD}"/>
      <line x1="32" y1="54" x2="32" y2="22" stroke="${C.stem}" stroke-width="1.6"/>
      ${leaf(24, 46, 6, 9, -35)}
      ${leaf(40, 42, 6, 9, 35)}
      ${leaf(26, 34, 5, 8, -28)}
      ${leaf(38, 28, 5, 8, 28)}
      <circle cx="32" cy="22" r="2.5" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7"/>`,
  },

  zwiebel: {
    aussaat: SOIL_FRESH + `
      <path d="M 28 58 q 0 -4 4 -4 q 4 0 4 4 q 0 3 -4 4 q -4 -1 -4 -4 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <line x1="32" y1="54" x2="32" y2="52" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="32" y1="62" x2="30" y2="64" stroke="${C.whiteD}" stroke-width="0.7"/>
      <line x1="32" y1="62" x2="34" y2="64" stroke="${C.whiteD}" stroke-width="0.7"/>`,
    keimling: SOIL_BAND + `
      <path d="M 28 58 q 0 -4 4 -4 q 4 0 4 4 q 0 3 -4 4 q -4 -1 -4 -4 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8" opacity="0.7"/>
      <line x1="30" y1="54" x2="28" y2="42" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="32" y1="54" x2="32" y2="38" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="34" y1="54" x2="36" y2="42" stroke="${C.stem}" stroke-width="1.4"/>`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="32" cy="58" rx="4" ry="3" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8" opacity="0.7"/>
      <line x1="28" y1="54" x2="24" y2="32" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="32" y1="54" x2="32" y2="26" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="36" y1="54" x2="40" y2="32" stroke="${C.stem}" stroke-width="1.4"/>
      <path d="M 24 32 l -2 -3 M 32 26 l 0 -4 M 40 32 l 2 -3" stroke="${C.stem}" stroke-width="1.1"/>`,
    reif: SOIL_BAND + `
      <path d="M 20 48 q 0 -12 12 -12 q 12 0 12 12 q -4 7 -12 7 q -8 0 -12 -7 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="1"/>
      <path d="M 22 46 q 4 -8 10 -8 M 32 38 v 14 M 42 46 q -4 -8 -10 -8" stroke="${C.whiteD}" stroke-width="0.8" fill="none" opacity="0.7"/>
      <path d="M 32 55 l -2 6 M 32 55 l 2 6 M 32 56 v 7" stroke="${C.whiteD}" stroke-width="0.6"/>
      <line x1="28" y1="40" x2="24" y2="22" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="32" y1="38" x2="32" y2="16" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="36" y1="40" x2="40" y2="22" stroke="${C.stem}" stroke-width="1.4"/>`,
  },

  knoblauch: {
    aussaat: SOIL_FRESH + `
      <path d="M 28 62 l 3 -8 l 2 0 l 3 8 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <line x1="32" y1="54" x2="32" y2="52" stroke="${C.stem}" stroke-width="1.2"/>`,
    keimling: SOIL_BAND + `
      <path d="M 28 62 l 3 -8 l 2 0 l 3 8 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8" opacity="0.7"/>
      <line x1="32" y1="54" x2="32" y2="42" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="29" y1="54" x2="28" y2="46" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="35" y1="54" x2="36" y2="46" stroke="${C.stem}" stroke-width="1.2"/>`,
    jungpflanze: SOIL_BAND + `
      <path d="M 28 62 l 3 -8 l 2 0 l 3 8 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8" opacity="0.7"/>
      <line x1="28" y1="54" x2="26" y2="30" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="32" y1="54" x2="32" y2="24" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="36" y1="54" x2="38" y2="30" stroke="${C.stem}" stroke-width="1.4"/>`,
    reif: SOIL_BAND + `
      <path d="M 20 48 q 0 -10 12 -10 q 12 0 12 10 q -4 7 -12 7 q -8 0 -12 -7 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="1"/>
      <path d="M 25 44 q 7 -6 14 0 M 28 50 q 4 -3 8 0 M 22 42 q 4 -2 10 -2 M 32 40 q 6 0 10 2" stroke="${C.whiteD}" stroke-width="0.7" fill="none" opacity="0.7"/>
      <path d="M 32 55 l -1 5" stroke="${C.whiteD}" stroke-width="0.6"/>
      <line x1="32" y1="38" x2="32" y2="18" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="28" y1="40" x2="22" y2="22" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="36" y1="40" x2="42" y2="22" stroke="${C.stem}" stroke-width="1.2"/>`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // HÜLSENFRÜCHTE
  // ════════════════════════════════════════════════════════════════════════
  erbse: {
    aussaat: SOIL_FRESH + `
      <circle cx="22" cy="58" r="3" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.9"/>
      <circle cx="42" cy="59" r="3" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.9"/>`,
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="42" stroke="${C.stem}" stroke-width="1.4"/>
      ${cotyledon(28, 42, 'L', 'light')}
      ${cotyledon(36, 42, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <path d="M 32 54 Q 30 38 26 24" stroke="${C.stem}" stroke-width="1.6" fill="none"/>
      ${leaf(28, 44, 5, 8, -45, 'light')}
      ${leaf(28, 32, 5, 8, 45, 'light')}
      <path d="M 26 22 q 3 -3 6 -2" stroke="${C.stem}" stroke-width="1" fill="none"/>`,
    reif: SOIL_BAND + `
      <path d="M 32 54 Q 32 32 22 14" stroke="${C.stem}" stroke-width="1.6" fill="none"/>
      ${leaf(28, 46, 5, 9, -45, 'light')}
      ${leaf(30, 36, 5, 9, 45, 'light')}
      ${leaf(26, 22, 5, 8, -40, 'light')}
      <path d="M 22 14 q 3 -3 6 -2" stroke="${C.stem}" stroke-width="1" fill="none"/>
      <ellipse cx="38" cy="40" rx="2.6" ry="6.5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(20 38 40)"/>
      <ellipse cx="34" cy="26" rx="2.4" ry="6" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(15 34 26)"/>
      <circle cx="38" cy="40" r="0.8" fill="${C.leafD}"/>
      <circle cx="34" cy="26" r="0.8" fill="${C.leafD}"/>`,
  },

  buschbohne: {
    aussaat: SOIL_FRESH + `
      <path d="M 16 60 q 3 -3 8 0 q -1 4 -8 2 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <path d="M 42 60 q 3 -3 8 0 q -1 4 -8 2 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>`,
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="40" stroke="${C.stem}" stroke-width="1.5"/>
      ${cotyledon(27, 40, 'L', 'light')}
      ${cotyledon(37, 40, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="32" stroke="${C.stem}" stroke-width="1.6"/>
      ${leaf(26, 46, 6, 10, -35)}
      ${leaf(38, 40, 6, 10, 35)}
      ${leaf(30, 32, 5, 8, -10)}`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="22" stroke="${C.stem}" stroke-width="1.7"/>
      ${leaf(24, 46, 7, 11, -40)}
      ${leaf(40, 40, 7, 11, 40)}
      ${leaf(28, 30, 5, 9, -25)}
      <ellipse cx="22" cy="46" rx="1.6" ry="8" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(-20 22 46)"/>
      <ellipse cx="42" cy="40" rx="1.6" ry="8" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(20 42 40)"/>
      <ellipse cx="40" cy="28" rx="1.5" ry="7" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(15 40 28)"/>`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // OBST
  // ════════════════════════════════════════════════════════════════════════
  erdbeere: {
    aussaat: SOIL_FRESH + `
      <path d="M 24 52 q 4 -6 8 -2 q -2 4 -8 2 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 32 51 q 4 -6 10 -2 q -3 4 -10 2 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8"/>
      <circle cx="28" cy="51" r="0.8" fill="${C.pink}"/>
      <circle cx="38" cy="50" r="0.8" fill="${C.pink}"/>`,
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      <path d="M 28 48 l 3 -8 l 3 4 l 3 -8 l 3 4" stroke="${C.leafD}" stroke-width="1" fill="${C.leafL}"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      <path d="M 22 50 q 6 -12 10 -12 q 4 0 10 12 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.9"/>
      <path d="M 22 50 l 3 -8 l 2 4 l 2 -8 l 2 4 l 2 -8 l 2 4 l 2 -8 l 2 4 l 3 8" stroke="${C.leafD}" stroke-width="0.8" fill="none"/>`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      <path d="M 18 48 q 2 -14 10 -16 q 4 0 6 4 q 4 -3 8 0 q 4 4 4 12 q -6 4 -14 4 q -10 0 -14 -4 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.9"/>
      <path d="M 22 46 q 6 -8 10 -10 M 32 36 q 4 -4 8 0 M 42 44 q -4 -4 -6 -2" stroke="${C.leafD}" stroke-width="0.7" fill="none"/>
      <path d="M 22 54 q 1 -5 4 -3 l 3 6 q -3 2 -7 -3 z" fill="${C.pink}" stroke="${C.pinkD}" stroke-width="0.8"/>
      <path d="M 37 52 q 1 -5 4 -3 l 2 6 q -3 2 -6 -3 z" fill="${C.pink}" stroke="${C.pinkD}" stroke-width="0.8"/>
      <circle cx="24" cy="53" r="0.4" fill="${C.flower}"/>
      <circle cx="26" cy="55" r="0.4" fill="${C.flower}"/>
      <circle cx="39" cy="51" r="0.4" fill="${C.flower}"/>
      <circle cx="41" cy="53" r="0.4" fill="${C.flower}"/>
      <path d="M 22 50 l 4 0 l 0 2 M 38 48 l 4 0 l 0 2" stroke="${C.leafD}" stroke-width="0.8" fill="${C.leaf}"/>`,
  },

  himbeere: {
    aussaat: SOIL_FRESH + `
      <line x1="28" y1="54" x2="28" y2="60" stroke="${C.stem}" stroke-width="2.2"/>
      <line x1="38" y1="54" x2="38" y2="60" stroke="${C.stem}" stroke-width="2.2"/>
      <circle cx="28" cy="62" r="0.6" fill="${C.leafD}"/>
      <circle cx="38" cy="62" r="0.6" fill="${C.leafD}"/>`,
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="44" stroke="${C.stem}" stroke-width="2"/>
      ${leaf(28, 46, 4, 7, -35)}
      ${leaf(36, 44, 4, 7, 35)}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="22" stroke="${C.stem}" stroke-width="2"/>
      ${leaf(28, 46, 5, 9, -40)}
      ${leaf(36, 36, 5, 9, 40)}
      ${leaf(28, 26, 5, 8, -35)}`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="12" stroke="${C.stem}" stroke-width="2"/>
      ${leaf(28, 48, 5, 10, -45)}
      ${leaf(36, 36, 5, 10, 45)}
      ${leaf(28, 22, 5, 9, -40)}
      <g fill="${C.pink}" stroke="${C.pinkD}" stroke-width="0.5">
        <circle cx="38" cy="42" r="1.8"/><circle cx="41" cy="40" r="1.8"/><circle cx="39" cy="38" r="1.8"/>
        <circle cx="42" cy="36" r="1.8"/><circle cx="40" cy="44" r="1.8"/><circle cx="44" cy="38" r="1.8"/>
        <circle cx="22" cy="32" r="1.8"/><circle cx="19" cy="30" r="1.8"/><circle cx="23" cy="28" r="1.8"/>
        <circle cx="20" cy="26" r="1.8"/><circle cx="24" cy="24" r="1.8"/>
      </g>`,
  },

  ribisel: {
    aussaat: SOIL_FRESH + `
      <line x1="26" y1="54" x2="26" y2="60" stroke="${C.stem}" stroke-width="2"/>
      <line x1="32" y1="54" x2="32" y2="60" stroke="${C.stem}" stroke-width="2"/>
      <line x1="38" y1="54" x2="38" y2="60" stroke="${C.stem}" stroke-width="2"/>`,
    keimling: SOIL_BAND + `
      <line x1="28" y1="54" x2="28" y2="46" stroke="${C.stem}" stroke-width="1.8"/>
      <line x1="32" y1="54" x2="32" y2="42" stroke="${C.stem}" stroke-width="1.8"/>
      <line x1="36" y1="54" x2="36" y2="46" stroke="${C.stem}" stroke-width="1.8"/>
      ${leaf(28, 44, 3, 5, -25)}
      ${leaf(36, 44, 3, 5, 25)}`,
    jungpflanze: SOIL_BAND + `
      <line x1="22" y1="54" x2="22" y2="28" stroke="${C.stem}" stroke-width="1.8"/>
      <line x1="32" y1="54" x2="32" y2="22" stroke="${C.stem}" stroke-width="1.8"/>
      <line x1="42" y1="54" x2="42" y2="28" stroke="${C.stem}" stroke-width="1.8"/>
      ${leaf(22, 36, 4, 7, -25)}
      ${leaf(32, 30, 4, 7, 0)}
      ${leaf(42, 36, 4, 7, 25)}`,
    reif: SOIL_BAND + `
      <line x1="22" y1="54" x2="22" y2="22" stroke="${C.stem}" stroke-width="1.8"/>
      <line x1="32" y1="54" x2="32" y2="18" stroke="${C.stem}" stroke-width="1.8"/>
      <line x1="42" y1="54" x2="42" y2="22" stroke="${C.stem}" stroke-width="1.8"/>
      ${leaf(22, 30, 5, 8, -25)}
      ${leaf(32, 24, 5, 8, 0)}
      ${leaf(42, 30, 5, 8, 25)}
      <line x1="22" y1="42" x2="22" y2="48" stroke="${C.stem}" stroke-width="1"/>
      <line x1="32" y1="40" x2="32" y2="48" stroke="${C.stem}" stroke-width="1"/>
      <line x1="42" y1="42" x2="42" y2="48" stroke="${C.stem}" stroke-width="1"/>
      <g fill="${C.red}" stroke="${C.redD}" stroke-width="0.6">
        <circle cx="22" cy="48" r="2.2"/><circle cx="19" cy="46" r="2.2"/><circle cx="25" cy="45" r="2.2"/>
        <circle cx="32" cy="50" r="2.2"/><circle cx="29" cy="46" r="2.2"/><circle cx="35" cy="46" r="2.2"/>
        <circle cx="42" cy="48" r="2.2"/><circle cx="45" cy="46" r="2.2"/><circle cx="39" cy="45" r="2.2"/>
      </g>`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // KRÄUTER
  // ════════════════════════════════════════════════════════════════════════
  basilikum: {
    aussaat: SOIL_FRESH + dustSeeds([20, 28, 36, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 48, 'L', 'light')}
      ${cotyledon(36, 48, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="38" stroke="${C.stem}" stroke-width="1.4"/>
      ${leaf(26, 46, 5, 7, -45)}
      ${leaf(38, 46, 5, 7, 45)}
      ${leaf(28, 38, 4, 6, -25)}
      ${leaf(36, 38, 4, 6, 25)}`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="20" stroke="${C.stem}" stroke-width="1.5"/>
      ${leaf(24, 48, 6, 8, -55)}
      ${leaf(40, 48, 6, 8, 55)}
      ${leaf(24, 38, 6, 8, -55)}
      ${leaf(40, 38, 6, 8, 55)}
      ${leaf(26, 28, 5, 7, -45)}
      ${leaf(38, 28, 5, 7, 45)}
      ${leaf(32, 20, 4, 6, 0)}`,
  },

  petersilie: {
    aussaat: SOIL_FRESH + dustSeeds([20, 28, 36, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 48, 'L', 'mid')}
      ${cotyledon(36, 48, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="32" y1="54" x2="26" y2="48" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="32" y1="54" x2="38" y2="48" stroke="${C.stem}" stroke-width="1.2"/>
      <path d="M 26 48 q 2 -4 4 -4 q 2 0 2 4 q -2 1 -4 1 q -2 0 -2 -1 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 28 44 q 2 -4 4 -4 q 2 0 2 4 q -2 1 -4 1 q -2 0 -2 -1 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 32 44 q 2 -4 4 -4 q 2 0 2 4 q -2 1 -4 1 q -2 0 -2 -1 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>`,
    reif: SOIL_BAND + `
      <line x1="22" y1="54" x2="22" y2="40" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="32" y1="54" x2="32" y2="36" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="42" y1="54" x2="42" y2="40" stroke="${C.stem}" stroke-width="1.2"/>
      <path d="M 14 42 q 6 -8 8 0 M 22 42 q 4 -6 8 0 M 30 38 q 4 -8 8 0 M 38 38 q 4 -6 8 0 M 46 42 q 4 -4 8 0" stroke="${C.leafD}" stroke-width="0.8" fill="${C.leaf}"/>
      <path d="M 18 38 q 4 -4 4 0 M 38 34 q 4 -4 4 0 M 26 32 q 4 -4 4 0 M 32 28 q 4 -4 4 0" stroke="${C.leafD}" stroke-width="0.8" fill="${C.leafL}"/>`,
  },

  schnittlauch: {
    aussaat: SOIL_FRESH + dustSeeds([24, 32, 40]),
    keimling: SOIL_BAND + `
      <line x1="30" y1="54" x2="29" y2="46" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="32" y1="54" x2="32" y2="44" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="34" y1="54" x2="35" y2="46" stroke="${C.stem}" stroke-width="1.4"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="26" y1="54" x2="24" y2="34" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="30" y1="54" x2="29" y2="28" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="32" y1="54" x2="32" y2="24" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="34" y1="54" x2="35" y2="28" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="38" y1="54" x2="40" y2="34" stroke="${C.leaf}" stroke-width="1.6"/>`,
    reif: SOIL_BAND + `
      <line x1="22" y1="54" x2="20" y2="28" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="26" y1="54" x2="24" y2="20" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="30" y1="54" x2="29" y2="14" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="32" y1="54" x2="32" y2="12" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="34" y1="54" x2="35" y2="14" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="38" y1="54" x2="40" y2="20" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="42" y1="54" x2="44" y2="28" stroke="${C.leaf}" stroke-width="1.6"/>
      <circle cx="24" cy="20" r="3.2" fill="${C.violet}" stroke="${C.violetD}" stroke-width="0.8"/>
      <circle cx="32" cy="12" r="3.8" fill="${C.violet}" stroke="${C.violetD}" stroke-width="0.8"/>
      <circle cx="40" cy="20" r="3.2" fill="${C.violet}" stroke="${C.violetD}" stroke-width="0.8"/>`,
  },
};

// ─── stage display order ─────────────────────────────────────────────────────
const STAGES = [
  { key: 'aussaat',     label: 'Aussaat',     hint: 'Sowing / planting' },
  { key: 'keimling',    label: 'Keimling',    hint: 'Germination' },
  { key: 'jungpflanze', label: 'Jungpflanze', hint: 'Young plant' },
  { key: 'reif',        label: 'Reif',        hint: 'Mature / harvest-ready' },
];

// ─── plant metadata ──────────────────────────────────────────────────────────
const PLANT_META = {
  tomate:          { name: 'Tomate',         type: 'Fruchtgemüse', latin: 'Solanum lycopersicum', seedType: 'oval' },
  melanzani:       { name: 'Melanzani',      type: 'Fruchtgemüse', latin: 'Solanum melongena',    seedType: 'oval' },
  paprika:         { name: 'Paprika',        type: 'Fruchtgemüse', latin: 'Capsicum annuum',      seedType: 'dust' },
  kuerbis:         { name: 'Kürbis',         type: 'Fruchtgemüse', latin: 'Cucurbita maxima',     seedType: 'flat' },
  zucchini:        { name: 'Zucchini',       type: 'Fruchtgemüse', latin: 'Cucurbita pepo',       seedType: 'flat' },
  gurke:           { name: 'Gurke',          type: 'Fruchtgemüse', latin: 'Cucumis sativus',      seedType: 'flat' },
  spinat:          { name: 'Spinat',         type: 'Blattgemüse',  latin: 'Spinacia oleracea',    seedType: 'cluster' },
  mangold:         { name: 'Mangold',        type: 'Blattgemüse',  latin: 'Beta vulgaris',        seedType: 'cluster' },
  kohl:            { name: 'Kohl / Kraut',   type: 'Blattgemüse',  latin: 'Brassica oleracea',    seedType: 'oval' },
  kohlrabi:        { name: 'Kohlrabi',       type: 'Blattgemüse',  latin: 'B. o. var. gongylodes',seedType: 'oval' },
  salat:           { name: 'Salat (Pflück)', type: 'Salat',        latin: 'Lactuca sativa',       seedType: 'dust' },
  rucola:          { name: 'Rucola',         type: 'Salat',        latin: 'Eruca vesicaria',      seedType: 'dust' },
  feldsalat:       { name: 'Feldsalat',      type: 'Salat',        latin: 'Valerianella locusta', seedType: 'dust' },
  karotte:         { name: 'Karotte',        type: 'Wurzel/Knolle',latin: 'Daucus carota',        seedType: 'dust' },
  radieschen:      { name: 'Radieschen',     type: 'Wurzel/Knolle',latin: 'Raphanus sativus',     seedType: 'oval' },
  'rote-bete':     { name: 'Rote Bete',      type: 'Wurzel/Knolle',latin: 'Beta vulgaris',        seedType: 'cluster' },
  pastinake:       { name: 'Pastinake',      type: 'Wurzel/Knolle',latin: 'Pastinaca sativa',     seedType: 'dust' },
  knollensellerie: { name: 'Knollensellerie',type: 'Wurzel/Knolle',latin: 'Apium graveolens',     seedType: 'dust' },
  knollenfenchel:  { name: 'Knollenfenchel', type: 'Wurzel/Knolle',latin: 'Foeniculum vulgare',   seedType: 'dust' },
  kartoffel:       { name: 'Kartoffel',      type: 'Wurzel/Knolle',latin: 'Solanum tuberosum',    seedType: 'tuber' },
  zwiebel:         { name: 'Zwiebel',        type: 'Wurzel/Knolle',latin: 'Allium cepa',          seedType: 'bulb' },
  knoblauch:       { name: 'Knoblauch',      type: 'Wurzel/Knolle',latin: 'Allium sativum',       seedType: 'clove' },
  erbse:           { name: 'Erbse',          type: 'Hülsenfrucht', latin: 'Pisum sativum',        seedType: 'pea' },
  buschbohne:      { name: 'Buschbohne',     type: 'Hülsenfrucht', latin: 'Phaseolus vulgaris',   seedType: 'bean' },
  erdbeere:        { name: 'Erdbeere',       type: 'Obst',         latin: 'Fragaria × ananassa',  seedType: 'runner' },
  himbeere:        { name: 'Himbeere',       type: 'Obst',         latin: 'Rubus idaeus',         seedType: 'cutting' },
  ribisel:         { name: 'Ribisel',        type: 'Obst',         latin: 'Ribes rubrum',         seedType: 'cutting' },
  basilikum:       { name: 'Basilikum',      type: 'Kraut',        latin: 'Ocimum basilicum',     seedType: 'dust' },
  petersilie:      { name: 'Petersilie',     type: 'Kraut',        latin: 'Petroselinum crispum', seedType: 'dust' },
  schnittlauch:    { name: 'Schnittlauch',   type: 'Kraut',        latin: 'Allium schoenoprasum', seedType: 'dust' },
};

// ─── built-in palettes (apply to wrapper to retheme all icons) ───────────────
const PALETTES = {
  natur: {
    '--pi-soil':         '#8a6a42',
    '--pi-soil-dark':    '#5a3f25',
    '--pi-soil-line':    '#6a4a28',
    '--pi-leaf':         '#6da848',
    '--pi-leaf-dark':    '#2f5a26',
    '--pi-leaf-light':   '#9ec870',
    '--pi-stem':         '#3a6a30',
    '--pi-flower':       '#e6c34a',
    '--pi-red':          '#e85d4a',
    '--pi-red-dark':     '#a02a1a',
    '--pi-purple':       '#7a3a8a',
    '--pi-purple-dark':  '#4a1a5a',
    '--pi-orange':       '#e08940',
    '--pi-orange-dark':  '#9a5818',
    '--pi-yellow':       '#e6c34a',
    '--pi-yellow-dark':  '#9a7820',
    '--pi-pink':         '#d0335f',
    '--pi-pink-dark':    '#8a1f3a',
    '--pi-white':        '#f0e8d4',
    '--pi-white-dark':   '#a89a72',
    '--pi-violet':       '#a878c8',
    '--pi-violet-dark':  '#5a2f7a',
  },
  pastell: {
    '--pi-soil':         '#c9a878',
    '--pi-soil-dark':    '#8a6a42',
    '--pi-soil-line':    '#9a7a52',
    '--pi-leaf':         '#a8d090',
    '--pi-leaf-dark':    '#5a8a4a',
    '--pi-leaf-light':   '#d0e8b8',
    '--pi-stem':         '#6a9a5a',
    '--pi-flower':       '#f0d878',
    '--pi-red':          '#f5a090',
    '--pi-red-dark':     '#c06a5a',
    '--pi-purple':       '#c0a0d0',
    '--pi-purple-dark':  '#8a6a9a',
    '--pi-orange':       '#f0b878',
    '--pi-orange-dark':  '#c08840',
    '--pi-yellow':       '#f0d878',
    '--pi-yellow-dark':  '#c0a040',
    '--pi-pink':         '#f0a0b8',
    '--pi-pink-dark':    '#c06a82',
    '--pi-white':        '#fafaef',
    '--pi-white-dark':   '#c0b8a0',
    '--pi-violet':       '#d0b0e0',
    '--pi-violet-dark':  '#9070a8',
  },
  monochrom_gruen: {
    '--pi-soil':         '#3a5a2a',
    '--pi-soil-dark':    '#1a3a0a',
    '--pi-soil-line':    '#2a4a1a',
    '--pi-leaf':         '#6da848',
    '--pi-leaf-dark':    '#2f5a26',
    '--pi-leaf-light':   '#9ec870',
    '--pi-stem':         '#3a6a30',
    '--pi-flower':       '#a8d068',
    '--pi-red':          '#6da848',
    '--pi-red-dark':     '#2f5a26',
    '--pi-purple':       '#4a8a3a',
    '--pi-purple-dark':  '#1a3a0a',
    '--pi-orange':       '#8ec068',
    '--pi-orange-dark':  '#3a6a30',
    '--pi-yellow':       '#a8d068',
    '--pi-yellow-dark':  '#4a7a3a',
    '--pi-pink':         '#7ab058',
    '--pi-pink-dark':    '#2a5a1a',
    '--pi-white':        '#d0e0c0',
    '--pi-white-dark':   '#7a9a6a',
    '--pi-violet':       '#5a8a4a',
    '--pi-violet-dark':  '#1a3a0a',
  },
  herbst: {
    '--pi-soil':         '#7a4a2a',
    '--pi-soil-dark':    '#4a2a18',
    '--pi-soil-line':    '#5a3520',
    '--pi-leaf':         '#c08840',
    '--pi-leaf-dark':    '#7a4a18',
    '--pi-leaf-light':   '#e6b878',
    '--pi-stem':         '#7a4a2a',
    '--pi-flower':       '#e6a040',
    '--pi-red':          '#c04020',
    '--pi-red-dark':     '#7a200a',
    '--pi-purple':       '#7a3a3a',
    '--pi-purple-dark':  '#4a1a1a',
    '--pi-orange':       '#e07020',
    '--pi-orange-dark':  '#9a4818',
    '--pi-yellow':       '#e6b820',
    '--pi-yellow-dark':  '#a07a10',
    '--pi-pink':         '#c05020',
    '--pi-pink-dark':    '#7a2a0a',
    '--pi-white':        '#e0d0a0',
    '--pi-white-dark':   '#a08a5a',
    '--pi-violet':       '#a06a40',
    '--pi-violet-dark':  '#5a3520',
  },
};

// ─── exports ────────────────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  window.PLANT_ICONS  = PLANT_ICONS;
  window.PLANT_STAGES = STAGES;
  window.PLANT_META   = PLANT_META;
  window.PLANT_PALETTES = PALETTES;
}

export { PLANT_ICONS, STAGES, PLANT_META, PALETTES };
