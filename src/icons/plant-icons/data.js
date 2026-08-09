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

  // ════════════════════════════════════════════════════════════════════════
  // ─── KRÄUTER ─ Erweiterung ──────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════


  dill: {
    aussaat: SOIL_FRESH + dustSeeds([20, 28, 36, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.2"/>
      <path d="M 32 47 l -4 -3 M 32 47 l 4 -3 M 32 46 l 0 -4" stroke="${C.stem}" stroke-width="1"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="32" stroke="${C.stem}" stroke-width="1.3"/>
      <path d="M 32 47 l -6 -3 M 32 47 l 6 -3 M 32 40 l -5 -4 M 32 40 l 5 -4 M 32 34 l -4 -4 M 32 34 l 4 -4" stroke="${C.leaf}" stroke-width="1"/>
      <path d="M 28 45 l -3 -2 M 36 45 l 3 -2 M 28 38 l -2 -2 M 36 38 l 2 -2" stroke="${C.leaf}" stroke-width="0.8"/>`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="20" stroke="${C.stem}" stroke-width="1.4"/>
      <path d="M 32 47 l -7 -4 M 32 47 l 7 -4 M 32 39 l -6 -4 M 32 39 l 6 -4 M 32 31 l -5 -3 M 32 31 l 5 -3" stroke="${C.leaf}" stroke-width="1"/>
      <path d="M 27 44 l -3 -3 M 37 44 l 3 -3 M 28 36 l -3 -2 M 36 36 l 3 -2 M 29 29 l -2 -2 M 35 29 l 2 -2" stroke="${C.leaf}" stroke-width="0.8"/>
      <path d="M 32 20 l -10 -4 M 32 20 l -5 -6 M 32 20 l 0 -7 M 32 20 l 5 -6 M 32 20 l 10 -4" stroke="${C.stem}" stroke-width="0.9" fill="none"/>
      <g fill="${C.flower}" stroke="${C.flowerD}" stroke-width="0.5">
        <circle cx="22" cy="16" r="1.5"/><circle cx="27" cy="14" r="1.5"/><circle cx="32" cy="13" r="1.5"/>
        <circle cx="37" cy="14" r="1.5"/><circle cx="42" cy="16" r="1.5"/>
      </g>`,
  },

  koriander: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 48, 'L', 'light')}
      ${cotyledon(36, 48, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="27" y2="47" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="32" y1="54" x2="32" y2="45" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="32" y1="54" x2="37" y2="47" stroke="${C.stem}" stroke-width="1.2"/>
      <path d="M 24 48 q -1 -4 3 -5 q 4 -1 4 3 q 0 3 -3 3 q -3 0 -4 -1 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 29 45 q 0 -4 3 -5 q 4 0 4 4 q -1 3 -4 3 q -3 0 -3 -2 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 36 48 q 0 -4 3 -5 q 4 0 4 4 q -1 3 -4 3 q -3 0 -3 -2 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>`,
    reif: SOIL_BAND + `
      <line x1="28" y1="54" x2="26" y2="27" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="34" y1="54" x2="38" y2="30" stroke="${C.stem}" stroke-width="1.3"/>
      <path d="M 20 50 q -1 -4 3 -5 q 4 -1 4 3 q 0 3 -3 3 q -3 0 -4 -1 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 38 50 q 0 -4 3 -5 q 4 0 4 4 q -1 3 -4 3 q -3 0 -3 -2 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 27 42 l -4 -2 M 27 42 l 3 -3 M 37 38 l -3 -3 M 37 38 l 4 -2" stroke="${C.leaf}" stroke-width="0.9"/>
      <path d="M 26 27 l -6 -4 M 26 27 l 0 -6 M 26 27 l 6 -4 M 38 30 l -5 -4 M 38 30 l 1 -6 M 38 30 l 6 -3" stroke="${C.stem}" stroke-width="0.8" fill="none"/>
      <g fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.5">
        <circle cx="20" cy="23" r="1.3"/><circle cx="26" cy="21" r="1.3"/><circle cx="32" cy="23" r="1.3"/>
        <circle cx="33" cy="26" r="1.2"/><circle cx="39" cy="24" r="1.2"/><circle cx="44" cy="27" r="1.2"/>
      </g>`,
  },

  kresse: {
    aussaat: SOIL_FRESH + dustSeeds([18, 26, 34, 42, 50]),
    keimling: SOIL_BAND + `
      <line x1="22" y1="54" x2="22" y2="49" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="28" y1="54" x2="28" y2="48" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="34" y1="54" x2="34" y2="48" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="40" y1="54" x2="40" y2="49" stroke="${C.stem}" stroke-width="1.1"/>
      <ellipse cx="27" cy="47" rx="1.6" ry="1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="29" cy="47" rx="1.6" ry="1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="33" cy="47" rx="1.6" ry="1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="35" cy="47" rx="1.6" ry="1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="19" y1="54" x2="19" y2="46" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="26" y1="54" x2="26" y2="45" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="32" y1="54" x2="32" y2="44" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="38" y1="54" x2="38" y2="45" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="45" y1="54" x2="45" y2="46" stroke="${C.stem}" stroke-width="1.1"/>
      <ellipse cx="18" cy="45" rx="1.8" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="20" cy="45" rx="1.8" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="25" cy="44" rx="1.8" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="27" cy="44" rx="1.8" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="31" cy="43" rx="1.8" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="33" cy="43" rx="1.8" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="37" cy="44" rx="1.8" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="39" cy="44" rx="1.8" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="44" cy="45" rx="1.8" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="46" cy="45" rx="1.8" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>`,
    reif: SOIL_BAND + `
      <line x1="16" y1="54" x2="16" y2="44" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="22" y1="54" x2="22" y2="42" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="28" y1="54" x2="28" y2="41" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="34" y1="54" x2="34" y2="41" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="40" y1="54" x2="40" y2="42" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="46" y1="54" x2="46" y2="44" stroke="${C.stem}" stroke-width="1.1"/>
      <ellipse cx="14.5" cy="43" rx="2" ry="1.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="17.5" cy="43" rx="2" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="20.5" cy="41" rx="2" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="23.5" cy="41" rx="2" ry="1.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="26.5" cy="40" rx="2" ry="1.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="29.5" cy="40" rx="2" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="32.5" cy="40" rx="2" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="35.5" cy="40" rx="2" ry="1.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="38.5" cy="41" rx="2" ry="1.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="41.5" cy="41" rx="2" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="44.5" cy="43" rx="2" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="47.5" cy="43" rx="2" ry="1.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>`,
  },

  thymian: {
    aussaat: SOIL_FRESH + dustSeeds([24, 32, 40]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="50" stroke="${C.stem}" stroke-width="1"/>
      <ellipse cx="30" cy="49" rx="1.6" ry="1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="34" cy="49" rx="1.6" ry="1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>`,
    jungpflanze: SOIL_BAND + `
      <path d="M 32 54 Q 26 48 24 44" stroke="${C.stem}" stroke-width="1" fill="none"/>
      <path d="M 32 54 Q 32 48 32 43" stroke="${C.stem}" stroke-width="1" fill="none"/>
      <path d="M 32 54 Q 38 48 40 44" stroke="${C.stem}" stroke-width="1" fill="none"/>
      <ellipse cx="25" cy="47" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="23.5" cy="43.5" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="31" cy="47" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="32" cy="42.5" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="39" cy="47" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="40.5" cy="43.5" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>`,
    reif: SOIL_BAND + `
      <path d="M 32 54 Q 22 48 18 40" stroke="${C.stem}" stroke-width="1" fill="none"/>
      <path d="M 32 54 Q 27 46 25 38" stroke="${C.stem}" stroke-width="1" fill="none"/>
      <path d="M 32 54 Q 32 46 32 36" stroke="${C.stem}" stroke-width="1" fill="none"/>
      <path d="M 32 54 Q 37 46 39 38" stroke="${C.stem}" stroke-width="1" fill="none"/>
      <path d="M 32 54 Q 42 48 46 40" stroke="${C.stem}" stroke-width="1" fill="none"/>
      <ellipse cx="20" cy="45" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="18.5" cy="41" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="26.5" cy="44" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="25" cy="39.5" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="32" cy="44" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="32" cy="39" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="37.5" cy="44" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="39" cy="39.5" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="44" cy="45" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <ellipse cx="45.5" cy="41" rx="1.1" ry="0.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.4"/>
      <g fill="${C.pink}" stroke="${C.pinkD}" stroke-width="0.4">
        <circle cx="18" cy="38.5" r="1"/><circle cx="25" cy="36.5" r="1"/><circle cx="32" cy="34.5" r="1"/>
        <circle cx="39" cy="36.5" r="1"/><circle cx="46" cy="38.5" r="1"/>
      </g>`,
  },

  salbei: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="47" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 47, 'L', 'mid')}
      ${cotyledon(36, 47, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="38" stroke="${C.stem}" stroke-width="1.4"/>
      <ellipse cx="26" cy="46" rx="2.6" ry="5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-40 26 46)"/>
      <ellipse cx="38" cy="46" rx="2.6" ry="5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(40 38 46)"/>
      <ellipse cx="32" cy="37" rx="2.4" ry="4.5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7"/>`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="22" stroke="${C.stem}" stroke-width="1.5"/>
      <ellipse cx="25" cy="47" rx="2.8" ry="5.5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-45 25 47)"/>
      <ellipse cx="39" cy="47" rx="2.8" ry="5.5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(45 39 47)"/>
      <ellipse cx="26" cy="38" rx="2.6" ry="5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-40 26 38)"/>
      <ellipse cx="38" cy="38" rx="2.6" ry="5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(40 38 38)"/>
      <ellipse cx="27" cy="30" rx="2.4" ry="4.5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-35 27 30)"/>
      <ellipse cx="37" cy="30" rx="2.4" ry="4.5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(35 37 30)"/>
      <g fill="${C.violet}" stroke="${C.violetD}" stroke-width="0.5">
        <circle cx="31" cy="20" r="1.3"/><circle cx="33.5" cy="18" r="1.3"/><circle cx="30.5" cy="16" r="1.3"/>
        <circle cx="33" cy="13.5" r="1.3"/><circle cx="31.5" cy="11" r="1.2"/>
      </g>`,
  },

  oregano: {
    aussaat: SOIL_FRESH + dustSeeds([20, 28, 36, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="49" stroke="${C.stem}" stroke-width="1.2"/>
      ${cotyledon(29, 49, 'L', 'light')}
      ${cotyledon(35, 49, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <path d="M 32 54 Q 25 48 22 43" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <path d="M 32 54 Q 32 47 32 41" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <path d="M 32 54 Q 39 48 42 43" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <circle cx="24" cy="46" r="1.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="21.5" cy="42.5" r="1.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="30.5" cy="45" r="1.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="32" cy="40.5" r="1.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="40" cy="46" r="1.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="42.5" cy="42.5" r="1.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>`,
    reif: SOIL_BAND + `
      <path d="M 32 54 Q 20 48 15 38" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <path d="M 32 54 Q 26 46 24 36" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <path d="M 32 54 Q 32 45 32 34" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <path d="M 32 54 Q 38 46 40 36" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <path d="M 32 54 Q 44 48 49 38" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <circle cx="18" cy="44" r="1.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="16" cy="40" r="1.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="26" cy="43" r="1.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="24.5" cy="38.5" r="1.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="32" cy="42" r="1.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="32" cy="37" r="1.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="38" cy="43" r="1.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="39.5" cy="38.5" r="1.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="46" cy="44" r="1.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <circle cx="48" cy="40" r="1.7" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5"/>
      <g fill="${C.pink}" stroke="${C.pinkD}" stroke-width="0.4">
        <circle cx="15" cy="36.5" r="1"/>
        <circle cx="23" cy="34.5" r="1"/><circle cx="25" cy="34" r="1"/>
        <circle cx="31" cy="32.5" r="1"/><circle cx="33" cy="32.5" r="1"/>
        <circle cx="39" cy="34" r="1"/><circle cx="41" cy="34.5" r="1"/>
        <circle cx="49" cy="36.5" r="1"/>
      </g>`,
  },

  rosmarin: {
    aussaat: SOIL_FRESH + `
      <line x1="27" y1="54" x2="27" y2="60" stroke="${C.stem}" stroke-width="2"/>
      <line x1="37" y1="54" x2="37" y2="60" stroke="${C.stem}" stroke-width="2"/>
      <path d="M 27 53 l -2 -1.5 M 27 53 l 2 -1.5 M 37 53 l -2 -1.5 M 37 53 l 2 -1.5" stroke="${C.leaf}" stroke-width="0.8"/>`,
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="45" stroke="${C.stem}" stroke-width="1.6"/>
      <path d="M 32 52 l -3 -1.5 M 32 52 l 3 -1.5 M 32 49 l -3 -1.5 M 32 49 l 3 -1.5 M 32 46 l -2.5 -1.5 M 32 46 l 2.5 -1.5" stroke="${C.leaf}" stroke-width="0.9"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="27" y1="54" x2="25" y2="36" stroke="${C.stem}" stroke-width="1.5"/>
      <line x1="37" y1="54" x2="39" y2="34" stroke="${C.stem}" stroke-width="1.5"/>
      <path d="M 26.5 50 l -3 -1.5 M 26.5 50 l 3 -1.5 M 26 46 l -3 -1.5 M 26 46 l 3 -1.5 M 25.7 42 l -3 -1.5 M 25.7 42 l 3 -1.5 M 25.3 38 l -2.5 -1.5 M 25.3 38 l 2.5 -1.5" stroke="${C.leaf}" stroke-width="0.9"/>
      <path d="M 37.5 50 l -3 -1.5 M 37.5 50 l 3 -1.5 M 38 46 l -3 -1.5 M 38 46 l 3 -1.5 M 38.3 42 l -3 -1.5 M 38.3 42 l 3 -1.5 M 38.7 38 l -2.5 -1.5 M 38.7 38 l 2.5 -1.5" stroke="${C.leaf}" stroke-width="0.9"/>`,
    reif: SOIL_BAND + `
      <line x1="24" y1="54" x2="21" y2="28" stroke="${C.stem}" stroke-width="1.6"/>
      <line x1="32" y1="54" x2="32" y2="22" stroke="${C.stem}" stroke-width="1.6"/>
      <line x1="40" y1="54" x2="43" y2="28" stroke="${C.stem}" stroke-width="1.6"/>
      <path d="M 23.5 50 l -3 -2 M 23.5 50 l 3 -2 M 23 46 l -3 -2 M 23 46 l 3 -2 M 22.5 42 l -3 -2 M 22.5 42 l 3 -2 M 22 38 l -3 -2 M 22 38 l 3 -2 M 21.5 34 l -2.5 -2 M 21.5 34 l 2.5 -2 M 21.2 30 l -2.5 -1.5 M 21.2 30 l 2.5 -1.5" stroke="${C.leaf}" stroke-width="0.9"/>
      <path d="M 32 50 l -3 -2 M 32 50 l 3 -2 M 32 46 l -3 -2 M 32 46 l 3 -2 M 32 42 l -3 -2 M 32 42 l 3 -2 M 32 38 l -3 -2 M 32 38 l 3 -2 M 32 34 l -3 -2 M 32 34 l 3 -2 M 32 30 l -2.5 -2 M 32 30 l 2.5 -2 M 32 26 l -2.5 -1.5 M 32 26 l 2.5 -1.5" stroke="${C.leaf}" stroke-width="0.9"/>
      <path d="M 40.5 50 l -3 -2 M 40.5 50 l 3 -2 M 41 46 l -3 -2 M 41 46 l 3 -2 M 41.5 42 l -3 -2 M 41.5 42 l 3 -2 M 42 38 l -3 -2 M 42 38 l 3 -2 M 42.5 34 l -2.5 -2 M 42.5 34 l 2.5 -2 M 42.8 30 l -2.5 -1.5 M 42.8 30 l 2.5 -1.5" stroke="${C.leaf}" stroke-width="0.9"/>
      <g fill="${C.violet}" stroke="${C.violetD}" stroke-width="0.4">
        <circle cx="22.5" cy="40" r="1"/><circle cx="32.8" cy="36" r="1"/><circle cx="31.2" cy="28" r="1"/><circle cx="42" cy="40" r="1"/>
      </g>`,
  },

  minze: {
    aussaat: SOIL_FRESH + `
      <line x1="20" y1="57" x2="44" y2="57" stroke="${C.stem}" stroke-width="1.8"/>
      <circle cx="25" cy="57" r="0.8" fill="${C.leafD}"/>
      <circle cx="32" cy="57" r="0.8" fill="${C.leafD}"/>
      <circle cx="39" cy="57" r="0.8" fill="${C.leafD}"/>`,
    keimling: SOIL_BAND + `
      <line x1="22" y1="57" x2="42" y2="57" stroke="${C.stem}" stroke-width="1.6" opacity="0.6"/>
      <line x1="32" y1="57" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.4"/>
      <ellipse cx="29" cy="46" rx="2.4" ry="1.6" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.6" transform="rotate(-25 29 46)"/>
      <ellipse cx="35" cy="46" rx="2.4" ry="1.6" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.6" transform="rotate(25 35 46)"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="20" y1="58" x2="44" y2="58" stroke="${C.stem}" stroke-width="1.6" opacity="0.6"/>
      <line x1="26" y1="58" x2="26" y2="38" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="38" y1="58" x2="38" y2="40" stroke="${C.stem}" stroke-width="1.4"/>
      <ellipse cx="22.5" cy="46" rx="2.6" ry="4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-35 22.5 46)"/>
      <ellipse cx="29.5" cy="46" rx="2.6" ry="4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(35 29.5 46)"/>
      <ellipse cx="23" cy="39" rx="2.4" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-35 23 39)"/>
      <ellipse cx="29" cy="39" rx="2.4" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(35 29 39)"/>
      <ellipse cx="35" cy="46" rx="2.4" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-35 35 46)"/>
      <ellipse cx="41" cy="46" rx="2.4" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(35 41 46)"/>`,
    reif: SOIL_BAND + `
      <line x1="18" y1="58" x2="46" y2="58" stroke="${C.stem}" stroke-width="1.6" opacity="0.6"/>
      <line x1="24" y1="58" x2="24" y2="32" stroke="${C.stem}" stroke-width="1.5"/>
      <line x1="32" y1="58" x2="32" y2="24" stroke="${C.stem}" stroke-width="1.5"/>
      <line x1="40" y1="58" x2="40" y2="32" stroke="${C.stem}" stroke-width="1.5"/>
      <ellipse cx="20.5" cy="46" rx="2.6" ry="4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-35 20.5 46)"/>
      <ellipse cx="27.5" cy="46" rx="2.6" ry="4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(35 27.5 46)"/>
      <ellipse cx="21" cy="37" rx="2.4" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-35 21 37)"/>
      <ellipse cx="27" cy="37" rx="2.4" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(35 27 37)"/>
      <ellipse cx="28.5" cy="40" rx="2.6" ry="4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-35 28.5 40)"/>
      <ellipse cx="35.5" cy="40" rx="2.6" ry="4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(35 35.5 40)"/>
      <ellipse cx="29" cy="31" rx="2.4" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-35 29 31)"/>
      <ellipse cx="35" cy="31" rx="2.4" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(35 35 31)"/>
      <ellipse cx="36.5" cy="46" rx="2.6" ry="4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-35 36.5 46)"/>
      <ellipse cx="43.5" cy="46" rx="2.6" ry="4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(35 43.5 46)"/>
      <ellipse cx="37" cy="37" rx="2.4" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-35 37 37)"/>
      <ellipse cx="43" cy="37" rx="2.4" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(35 43 37)"/>
      <g fill="${C.violet}" stroke="${C.violetD}" stroke-width="0.5">
        <circle cx="31" cy="22" r="1.2"/><circle cx="33" cy="20" r="1.2"/><circle cx="31.5" cy="17.5" r="1.2"/><circle cx="32.5" cy="15" r="1.1"/>
      </g>`,
  },

  liebstoeckel: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="47" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 47, 'L', 'mid')}
      ${cotyledon(36, 47, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="28" y1="54" x2="26" y2="40" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="32" y1="54" x2="32" y2="36" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="36" y1="54" x2="38" y2="40" stroke="${C.stem}" stroke-width="1.4"/>
      ${leaf(26, 38, 4, 7, -25)}
      ${leaf(32, 34, 4, 7, 0)}
      ${leaf(38, 38, 4, 7, 25)}`,
    reif: SOIL_BAND + `
      <line x1="26" y1="54" x2="23" y2="26" stroke="${C.stem}" stroke-width="1.6"/>
      <line x1="32" y1="54" x2="32" y2="18" stroke="${C.stem}" stroke-width="1.6"/>
      <line x1="38" y1="54" x2="41" y2="26" stroke="${C.stem}" stroke-width="1.6"/>
      ${leaf(25, 42, 5, 8, -35)}
      ${leaf(30, 38, 5, 8, -20)}
      ${leaf(34, 38, 5, 8, 20)}
      ${leaf(39, 42, 5, 8, 35)}
      ${leaf(23, 24, 4, 6, -25)}
      ${leaf(41, 24, 4, 6, 25)}
      <path d="M 32 18 l -8 -3 M 32 18 l -4 -5 M 32 18 l 0 -6 M 32 18 l 4 -5 M 32 18 l 8 -3" stroke="${C.stem}" stroke-width="0.9" fill="none"/>
      <g fill="${C.flower}" stroke="${C.flowerD}" stroke-width="0.5">
        <circle cx="24" cy="15" r="1.4"/><circle cx="28" cy="13" r="1.4"/><circle cx="32" cy="12" r="1.4"/>
        <circle cx="36" cy="13" r="1.4"/><circle cx="40" cy="15" r="1.4"/>
      </g>`,
  },

  bohnenkraut: {
    aussaat: SOIL_FRESH + dustSeeds([20, 28, 36, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="49" stroke="${C.stem}" stroke-width="1.2"/>
      <ellipse cx="30" cy="48" rx="1.8" ry="1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="34" cy="48" rx="1.8" ry="1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="38" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="32" y1="50" x2="26" y2="42" stroke="${C.stem}" stroke-width="1"/>
      <line x1="32" y1="48" x2="38" y2="40" stroke="${C.stem}" stroke-width="1"/>
      <ellipse cx="27" cy="44" rx="0.9" ry="2.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(35 27 44)"/>
      <ellipse cx="37" cy="42" rx="0.9" ry="2.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-35 37 42)"/>
      <ellipse cx="30" cy="42" rx="0.9" ry="2.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(20 30 42)"/>
      <ellipse cx="34" cy="40" rx="0.9" ry="2.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-20 34 40)"/>`,
    reif: SOIL_BAND + `
      <line x1="26" y1="54" x2="23" y2="30" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="32" y1="54" x2="32" y2="26" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="38" y1="54" x2="41" y2="30" stroke="${C.stem}" stroke-width="1.3"/>
      <ellipse cx="22" cy="45" rx="0.9" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(40 22 45)"/>
      <ellipse cx="28" cy="43" rx="0.9" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-40 28 43)"/>
      <ellipse cx="23" cy="37" rx="0.9" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(40 23 37)"/>
      <ellipse cx="29" cy="44" rx="0.9" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(40 29 44)"/>
      <ellipse cx="35" cy="42" rx="0.9" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-40 35 42)"/>
      <ellipse cx="29" cy="35" rx="0.9" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(40 29 35)"/>
      <ellipse cx="35" cy="33" rx="0.9" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-40 35 33)"/>
      <ellipse cx="36" cy="45" rx="0.9" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-40 36 45)"/>
      <ellipse cx="42" cy="37" rx="0.9" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-40 42 37)"/>
      <g fill="${C.pink}" stroke="${C.pinkD}" stroke-width="0.4">
        <circle cx="23.5" cy="32" r="0.9"/><circle cx="22.5" cy="28.5" r="0.9"/>
        <circle cx="32.5" cy="30" r="0.9"/><circle cx="31.5" cy="26.5" r="0.9"/><circle cx="32.5" cy="24" r="0.9"/>
        <circle cx="40.5" cy="32" r="0.9"/><circle cx="41.5" cy="28.5" r="0.9"/>
      </g>`,
  },

  estragon: {
    aussaat: SOIL_FRESH + `
      <line x1="30" y1="54" x2="30" y2="61" stroke="${C.stem}" stroke-width="2"/>
      <path d="M 30 58 l -4 2 M 30 58 l 4 2 M 30 61 l -3 2 M 30 61 l 3 2" stroke="${C.soilD}" stroke-width="0.9" fill="none"/>
      <path d="M 30 53 l -2 -1.5 M 30 53 l 2 -1.5" stroke="${C.leaf}" stroke-width="0.8"/>`,
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="45" stroke="${C.stem}" stroke-width="1.4"/>
      <ellipse cx="29.5" cy="48" rx="1" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(30 29.5 48)"/>
      <ellipse cx="34.5" cy="46" rx="1" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-30 34.5 46)"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="28" y1="54" x2="26" y2="32" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="36" y1="54" x2="38" y2="34" stroke="${C.stem}" stroke-width="1.3"/>
      <ellipse cx="24.5" cy="46" rx="1" ry="3.4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(30 24.5 46)"/>
      <ellipse cx="30" cy="42" rx="1" ry="3.4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-30 30 42)"/>
      <ellipse cx="23.5" cy="37" rx="1" ry="3.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(30 23.5 37)"/>
      <ellipse cx="33.5" cy="46" rx="1" ry="3.4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(30 33.5 46)"/>
      <ellipse cx="40" cy="42" rx="1" ry="3.4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-30 40 42)"/>
      <ellipse cx="40.5" cy="37" rx="1" ry="3.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-30 40.5 37)"/>`,
    reif: SOIL_BAND + `
      <line x1="26" y1="54" x2="23" y2="22" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="32" y1="54" x2="32" y2="16" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="38" y1="54" x2="41" y2="22" stroke="${C.stem}" stroke-width="1.3"/>
      <ellipse cx="22" cy="45" rx="1" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(30 22 45)"/>
      <ellipse cx="28.5" cy="41" rx="1" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-30 28.5 41)"/>
      <ellipse cx="21" cy="35" rx="1" ry="3.4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(30 21 35)"/>
      <ellipse cx="27" cy="30" rx="1" ry="3.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-30 27 30)"/>
      <ellipse cx="28.5" cy="46" rx="1" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(30 28.5 46)"/>
      <ellipse cx="35.5" cy="40" rx="1" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-30 35.5 40)"/>
      <ellipse cx="28.8" cy="33" rx="1" ry="3.4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(30 28.8 33)"/>
      <ellipse cx="35" cy="26" rx="1" ry="3.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-30 35 26)"/>
      <ellipse cx="42" cy="45" rx="1" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-30 42 45)"/>
      <ellipse cx="36" cy="46" rx="1" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(30 36 46)"/>
      <ellipse cx="43" cy="35" rx="1" ry="3.4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(-30 43 35)"/>
      <ellipse cx="37.5" cy="30" rx="1" ry="3.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.5" transform="rotate(30 37.5 30)"/>
      <g fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.4">
        <circle cx="23" cy="20" r="0.8"/><circle cx="32" cy="14" r="0.8"/><circle cx="41" cy="20" r="0.8"/>
      </g>`,
  },

  majoran: {
    aussaat: SOIL_FRESH + dustSeeds([24, 32, 40]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="49" stroke="${C.stem}" stroke-width="1.2"/>
      ${cotyledon(29, 49, 'L', 'light')}
      ${cotyledon(35, 49, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="27" y1="54" x2="26" y2="42" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="32" y1="54" x2="32" y2="40" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="37" y1="54" x2="38" y2="42" stroke="${C.stem}" stroke-width="1.1"/>
      <ellipse cx="24.5" cy="46" rx="1.5" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="27.5" cy="44" rx="1.5" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="30.5" cy="45" rx="1.5" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="33.5" cy="42" rx="1.5" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="36.5" cy="46" rx="1.5" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="39.5" cy="44" rx="1.5" ry="1.1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>`,
    reif: SOIL_BAND + `
      <line x1="23" y1="54" x2="21" y2="34" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="28" y1="54" x2="27" y2="30" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="33" y1="54" x2="33" y2="28" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="38" y1="54" x2="39" y2="30" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="43" y1="54" x2="45" y2="34" stroke="${C.stem}" stroke-width="1.2"/>
      <ellipse cx="20" cy="46" rx="1.6" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="24" cy="43" rx="1.6" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="29.5" cy="41" rx="1.6" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="25.5" cy="37" rx="1.6" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="30.5" cy="46" rx="1.6" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="35.5" cy="42" rx="1.6" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="31" cy="36" rx="1.6" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="36" cy="34" rx="1.6" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="41" cy="44" rx="1.6" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="42" cy="38" rx="1.6" ry="1.2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <g fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.5">
        <circle cx="20.5" cy="32.5" r="1.1"/><circle cx="21.8" cy="31" r="1.1"/>
        <circle cx="26.3" cy="28.5" r="1.1"/><circle cx="27.8" cy="27.2" r="1.1"/>
        <circle cx="32.3" cy="26.5" r="1.1"/><circle cx="33.8" cy="25.5" r="1.1"/>
        <circle cx="38.3" cy="28.5" r="1.1"/><circle cx="39.8" cy="27.2" r="1.1"/>
        <circle cx="44.8" cy="31.8" r="1.1"/>
      </g>`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // ─── KOHL & ASIA-SALATE ─ Erweiterung ────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════


  brokkoli: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.4"/>
      ${cotyledon(28, 46, 'L', 'mid')}
      ${cotyledon(36, 46, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="40" stroke="${C.stem}" stroke-width="1.5"/>
      ${leaf(26, 46, 5, 8, -30)}
      ${leaf(38, 44, 5, 8, 30)}
      <circle cx="32" cy="37" r="4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <circle cx="30" cy="36" r="1" fill="${C.leafD}"/>
      <circle cx="33" cy="34.5" r="1" fill="${C.leafD}"/>
      <circle cx="34" cy="37.5" r="1" fill="${C.leafD}"/>`,
    reif: SOIL_BAND + `
      <path d="M 29 54 l 0 -16 q 3 -2 6 0 l 0 16 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8"/>
      ${leaf(20, 52, 7, 11, -50)}
      ${leaf(44, 52, 7, 11, 50)}
      <path d="M 18 36 q 0 -16 14 -16 q 14 0 14 16 q -7 4 -14 4 q -7 0 -14 -4 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="1"/>
      <g fill="${C.leafD}">
        <circle cx="22" cy="33" r="1.6"/><circle cx="26" cy="27" r="1.6"/>
        <circle cx="32" cy="23" r="1.6"/><circle cx="38" cy="27" r="1.6"/>
        <circle cx="42" cy="33" r="1.6"/><circle cx="27" cy="33" r="1.6"/>
        <circle cx="32" cy="29" r="1.6"/><circle cx="37" cy="33" r="1.6"/>
      </g>`,
  },

  karfiol: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.4"/>
      ${cotyledon(28, 46, 'L', 'mid')}
      ${cotyledon(36, 46, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="42" stroke="${C.stem}" stroke-width="1.5"/>
      ${leaf(26, 46, 5, 9, -25)}
      ${leaf(38, 44, 5, 9, 25)}
      <circle cx="32" cy="39" r="3.5" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8"/>`,
    reif: SOIL_BAND + `
      <path d="M 30 54 l 0 -8 l 4 0 l 0 8 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 17 52 q -3 -16 9 -26 q 4 3 4 8 l -3 18 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.9"/>
      <path d="M 47 52 q 3 -16 -9 -26 q -4 3 -4 8 l 3 18 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.9"/>
      ${leaf(22, 53, 6, 9, -55)}
      ${leaf(42, 53, 6, 9, 55)}
      <g fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8">
        <circle cx="26" cy="40" r="4"/><circle cx="38" cy="40" r="4"/>
        <circle cx="32" cy="35" r="4.2"/><circle cx="29" cy="44" r="3.8"/>
        <circle cx="35" cy="44" r="3.8"/><circle cx="32" cy="40" r="4"/>
      </g>`,
  },

  chinakohl: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.4"/>
      ${cotyledon(28, 46, 'L', 'mid')}
      ${cotyledon(36, 46, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="28" cy="46" rx="3" ry="7" fill="${C.leafL}" stroke="${C.leaf}" stroke-width="0.8" transform="rotate(-10 28 46)"/>
      <ellipse cx="36" cy="46" rx="3" ry="7" fill="${C.leafL}" stroke="${C.leaf}" stroke-width="0.8" transform="rotate(10 36 46)"/>
      <ellipse cx="32" cy="45" rx="3.2" ry="8" fill="${C.leafL}" stroke="${C.leaf}" stroke-width="0.8"/>`,
    reif: SOIL_BAND + `
      <ellipse cx="24" cy="42" rx="4.5" ry="12" fill="${C.leafL}" stroke="${C.leaf}" stroke-width="0.9" transform="rotate(-6 24 42)"/>
      <ellipse cx="40" cy="42" rx="4.5" ry="12" fill="${C.leafL}" stroke="${C.leaf}" stroke-width="0.9" transform="rotate(6 40 42)"/>
      <ellipse cx="28" cy="39" rx="5" ry="14" fill="${C.leafL}" stroke="${C.leaf}" stroke-width="0.9" transform="rotate(-3 28 39)"/>
      <ellipse cx="36" cy="39" rx="5" ry="14" fill="${C.leafL}" stroke="${C.leaf}" stroke-width="0.9" transform="rotate(3 36 39)"/>
      <ellipse cx="32" cy="38" rx="5.5" ry="15" fill="${C.leafL}" stroke="${C.leaf}" stroke-width="0.9"/>
      <path d="M 32 28 v 22" stroke="${C.leaf}" stroke-width="0.7" opacity="0.7"/>
      <path d="M 27 26 q 2 -2 5 -2 q 3 0 5 2" stroke="${C.leaf}" stroke-width="0.8" fill="none"/>`,
  },

  gruenkohl: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.4"/>
      ${cotyledon(28, 46, 'L', 'mid')}
      ${cotyledon(36, 46, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="44" stroke="${C.stem}" stroke-width="1.5"/>
      <path d="M 32 44 Q 27 42 25 36 q 2 1 3 -1 q 2 2 4 2 q 0 4 0 7 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 32 44 Q 37 42 39 36 q -2 1 -3 -1 q -2 2 -4 2 q 0 4 0 7 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 32 44 q -2 -5 0 -10 q 2 5 0 10 z" fill="${C.leafD}" stroke="${C.leafD}" stroke-width="0.6"/>`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="30" stroke="${C.stem}" stroke-width="2"/>
      <path d="M 31 50 l -3 -1 M 33 47 l 3 -1 M 31 44 l -3 -1 M 33 41 l 3 -1 M 31 38 l -3 -1" stroke="${C.stem}" stroke-width="1"/>
      <path d="M 32 31 Q 24 32 17 27 q 2 -2 1 -4 q 3 1 5 -1 q 3 2 5 1 q 2 2 4 7 z" fill="${C.leafD}" stroke="${C.leafD}" stroke-width="0.6"/>
      <path d="M 32 31 Q 40 32 47 27 q -2 -2 -1 -4 q -3 1 -5 -1 q -3 2 -5 1 q -2 2 -4 7 z" fill="${C.leafD}" stroke="${C.leafD}" stroke-width="0.6"/>
      <path d="M 32 30 Q 26 26 24 18 q 2 1 3 -1 q 2 2 4 1 q 1 2 3 2 q 0 5 -2 10 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 32 30 Q 38 26 40 18 q -2 1 -3 -1 q -2 2 -4 1 q -1 2 -3 2 q 0 5 2 10 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 32 30 q -3 -6 -2 -13 q 2 2 2 -1 q 0 3 2 1 q 1 7 -2 13 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>`,
  },

  rosenkohl: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.4"/>
      ${cotyledon(28, 46, 'L', 'mid')}
      ${cotyledon(36, 46, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="34" stroke="${C.stem}" stroke-width="1.8"/>
      ${leaf(26, 34, 5, 8, -30)}
      ${leaf(32, 30, 5, 8, 0)}
      ${leaf(38, 34, 5, 8, 30)}`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="18" stroke="${C.stem}" stroke-width="2.2"/>
      <g fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7">
        <circle cx="29" cy="50" r="2"/><circle cx="35" cy="47" r="2"/>
        <circle cx="29" cy="44" r="2"/><circle cx="35" cy="41" r="2"/>
        <circle cx="29" cy="38" r="2"/><circle cx="35" cy="35" r="2"/>
        <circle cx="29" cy="32" r="2"/><circle cx="35" cy="29" r="2"/>
        <circle cx="29" cy="26" r="2"/><circle cx="35" cy="23" r="2"/>
      </g>
      ${leaf(26, 18, 5, 7, -35)}
      ${leaf(32, 14, 5, 8, 0)}
      ${leaf(38, 18, 5, 7, 35)}`,
  },

  pakchoi: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="47" stroke="${C.stem}" stroke-width="1.4"/>
      ${cotyledon(28, 47, 'L', 'light')}
      ${cotyledon(36, 47, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <path d="M 31 52 Q 28 48 27 42 l 3 -1 Q 32 47 33 51 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7"/>
      <path d="M 33 52 Q 36 48 37 42 l -3 -1 Q 32 47 31 51 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7"/>
      <path d="M 31 52 l 0.5 -10 l 1 0 l 0.5 10 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7"/>
      <ellipse cx="27" cy="39" rx="3" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-15 27 39)"/>
      <ellipse cx="37" cy="39" rx="3" ry="3.6" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(15 37 39)"/>
      <ellipse cx="32" cy="38" rx="3" ry="3.8" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>`,
    reif: SOIL_BAND + `
      <path d="M 31 52 Q 24 49 21 41 l 3 -2 Q 27 45 33 50 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7"/>
      <path d="M 33 52 Q 40 49 43 41 l -3 -2 Q 37 45 31 50 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7"/>
      <path d="M 31 52 Q 28 47 27 39 l 3.5 -0.5 Q 31 46 33 51 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7"/>
      <path d="M 33 52 Q 36 47 37 39 l -3.5 -0.5 Q 33 46 31 51 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7"/>
      <path d="M 30.5 52 l 0.5 -15 l 2 0 l 0.5 15 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7"/>
      <ellipse cx="21" cy="36" rx="4.5" ry="5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(-25 21 36)"/>
      <ellipse cx="43" cy="36" rx="4.5" ry="5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(25 43 36)"/>
      <ellipse cx="27.5" cy="34" rx="4" ry="5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(-10 27.5 34)"/>
      <ellipse cx="36.5" cy="34" rx="4" ry="5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(10 36.5 34)"/>
      <ellipse cx="32" cy="32" rx="4.5" ry="5.5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>`,
  },

  mizuna: {
    aussaat: SOIL_FRESH + dustSeeds([20, 28, 36, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 48, 'L', 'light')}
      ${cotyledon(36, 48, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="30" y1="54" x2="26" y2="44" stroke="${C.stem}" stroke-width="1"/>
      <line x1="32" y1="54" x2="32" y2="42" stroke="${C.stem}" stroke-width="1"/>
      <line x1="34" y1="54" x2="38" y2="44" stroke="${C.stem}" stroke-width="1"/>
      <path d="M 0 0 l -2 -3 l 1.6 0.6 l -0.8 -3.4 l 1.6 1.2 l 0.2 -3.6 l 1.4 3 l 1.4 -1.8 l -0.2 3.6 l 1.6 -0.8 l -1.8 3.6 q -1.5 1.2 -3 0.6 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.6" transform="translate(26 44) rotate(-20) scale(0.75)"/>
      <path d="M 0 0 l -2 -3 l 1.6 0.6 l -0.8 -3.4 l 1.6 1.2 l 0.2 -3.6 l 1.4 3 l 1.4 -1.8 l -0.2 3.6 l 1.6 -0.8 l -1.8 3.6 q -1.5 1.2 -3 0.6 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.6" transform="translate(32 42) scale(0.75)"/>
      <path d="M 0 0 l -2 -3 l 1.6 0.6 l -0.8 -3.4 l 1.6 1.2 l 0.2 -3.6 l 1.4 3 l 1.4 -1.8 l -0.2 3.6 l 1.6 -0.8 l -1.8 3.6 q -1.5 1.2 -3 0.6 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.6" transform="translate(38 44) rotate(20) scale(0.75)"/>`,
    reif: SOIL_BAND + `
      <line x1="31" y1="54" x2="18" y2="46" stroke="${C.stem}" stroke-width="1"/>
      <line x1="31" y1="54" x2="24" y2="40" stroke="${C.stem}" stroke-width="1"/>
      <line x1="32" y1="54" x2="32" y2="36" stroke="${C.stem}" stroke-width="1"/>
      <line x1="33" y1="54" x2="40" y2="40" stroke="${C.stem}" stroke-width="1"/>
      <line x1="33" y1="54" x2="46" y2="46" stroke="${C.stem}" stroke-width="1"/>
      <path d="M 0 0 l -2 -3 l 1.6 0.6 l -0.8 -3.4 l 1.6 1.2 l 0.2 -3.6 l 1.4 3 l 1.4 -1.8 l -0.2 3.6 l 1.6 -0.8 l -1.8 3.6 q -1.5 1.2 -3 0.6 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.6" transform="translate(18 46) rotate(-50)"/>
      <path d="M 0 0 l -2 -3 l 1.6 0.6 l -0.8 -3.4 l 1.6 1.2 l 0.2 -3.6 l 1.4 3 l 1.4 -1.8 l -0.2 3.6 l 1.6 -0.8 l -1.8 3.6 q -1.5 1.2 -3 0.6 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.6" transform="translate(24 40) rotate(-25)"/>
      <path d="M 0 0 l -2 -3 l 1.6 0.6 l -0.8 -3.4 l 1.6 1.2 l 0.2 -3.6 l 1.4 3 l 1.4 -1.8 l -0.2 3.6 l 1.6 -0.8 l -1.8 3.6 q -1.5 1.2 -3 0.6 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.6" transform="translate(32 36)"/>
      <path d="M 0 0 l -2 -3 l 1.6 0.6 l -0.8 -3.4 l 1.6 1.2 l 0.2 -3.6 l 1.4 3 l 1.4 -1.8 l -0.2 3.6 l 1.6 -0.8 l -1.8 3.6 q -1.5 1.2 -3 0.6 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.6" transform="translate(40 40) rotate(25)"/>
      <path d="M 0 0 l -2 -3 l 1.6 0.6 l -0.8 -3.4 l 1.6 1.2 l 0.2 -3.6 l 1.4 3 l 1.4 -1.8 l -0.2 3.6 l 1.6 -0.8 l -1.8 3.6 q -1.5 1.2 -3 0.6 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.6" transform="translate(46 46) rotate(50)"/>`,
  },

  rettich: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 48, 'L', 'mid')}
      ${cotyledon(36, 48, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <path d="M 29 54 l 6 0 l -1.5 8 l -1.5 3 l -1.5 -3 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8" opacity="0.5"/>
      ${leaf(27, 48, 4, 7, -25)}
      ${leaf(32, 44, 4, 8, 0)}
      ${leaf(37, 48, 4, 7, 25)}`,
    reif: SOIL_BAND + `
      <path d="M 27 47 q 0 -3 5 -3 q 5 0 5 3 l -1 6 l -1.5 7 l -1.5 3 q -1 1 -2 0 l -1.5 -3 l -1.5 -7 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <path d="M 28.5 56 l 7 0 M 29.5 60 l 5 0" stroke="${C.whiteD}" stroke-width="0.6"/>
      <line x1="29" y1="47" x2="24" y2="30" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="32" y1="46" x2="32" y2="26" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="35" y1="47" x2="40" y2="30" stroke="${C.stem}" stroke-width="1.2"/>
      ${leaf(24, 30, 5, 9, -25)}
      ${leaf(32, 26, 5, 10, 0)}
      ${leaf(40, 30, 5, 9, 25)}
      ${leaf(26, 40, 3, 5, -45)}
      ${leaf(38, 40, 3, 5, 45)}`,
  },

  mairuebchen: {
    aussaat: SOIL_FRESH + dustSeeds([22, 30, 38, 46]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 48, 'L', 'light')}
      ${cotyledon(36, 48, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="32" cy="53" rx="5" ry="4" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8" opacity="0.55"/>
      ${leaf(27, 47, 4, 7, -25, 'light')}
      ${leaf(32, 44, 4, 8, 0, 'light')}
      ${leaf(37, 47, 4, 7, 25, 'light')}`,
    reif: SOIL_BAND + `
      <path d="M 32 60 l 0 3" stroke="${C.whiteD}" stroke-width="0.8"/>
      <ellipse cx="32" cy="53" rx="9" ry="7" fill="${C.white}" stroke="${C.whiteD}" stroke-width="1"/>
      <path d="M 23.5 51 q 3 -5 8.5 -5 q 5.5 0 8.5 5 q -4 2.5 -8.5 2.5 q -4.5 0 -8.5 -2.5 z" fill="${C.violet}" stroke="${C.violetD}" stroke-width="0.8"/>
      <line x1="29" y1="47" x2="26" y2="34" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="32" y1="46" x2="32" y2="30" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="35" y1="47" x2="38" y2="34" stroke="${C.stem}" stroke-width="1.1"/>
      ${leaf(26, 34, 4, 7, -20, 'light')}
      ${leaf(32, 30, 4, 8, 0, 'light')}
      ${leaf(38, 34, 4, 7, 20, 'light')}`,
  },

  endivie: {
    aussaat: SOIL_FRESH + dustSeeds([20, 28, 36, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="48" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 48, 'L', 'light')}
      ${cotyledon(36, 48, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="32" cy="48" rx="10" ry="5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 25 48 l 2 -5 l 2 4 l 2 -6 l 2 4 M 34 47 l 2 -5 l 2 4 l 2 -4" stroke="${C.leafD}" stroke-width="0.7" fill="none"/>
      <ellipse cx="32" cy="49" rx="4" ry="2" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.6"/>`,
    reif: SOIL_BAND + `
      <path d="M 10 50 q 0 -6 6 -8 q -1 -4 2 -6 q 3 3 3 6 q 4 -8 11 -8 q 7 0 11 8 q 0 -3 3 -6 q 3 2 2 6 q 6 2 6 8 q -10 4 -22 4 q -12 0 -22 -4 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="1"/>
      <path d="M 20 46 l 2 -6 M 27 43 l 1 -6 M 37 43 l -1 -6 M 44 46 l -2 -6" stroke="${C.leafD}" stroke-width="0.8" fill="none"/>
      <ellipse cx="32" cy="46" rx="8" ry="4" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 26 46 q 6 -4 12 0" stroke="${C.leafD}" stroke-width="0.6" fill="none" opacity="0.6"/>`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // ─── OBST & BEEREN ─ Erweiterung ─────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════


  heidelbeere: {
    aussaat: SOIL_FRESH + `
      <line x1="28" y1="54" x2="28" y2="60" stroke="${C.stem}" stroke-width="2"/>
      <line x1="37" y1="54" x2="37" y2="60" stroke="${C.stem}" stroke-width="2"/>
      <circle cx="28" cy="61.5" r="0.6" fill="${C.leafD}"/>
      <circle cx="37" cy="61.5" r="0.6" fill="${C.leafD}"/>`,
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="45" stroke="${C.stem}" stroke-width="1.6"/>
      <path d="M 32 49 l -4 -3" stroke="${C.stem}" stroke-width="1" fill="none"/>
      ${leaf(28, 46, 3, 5, -30)}
      ${leaf(34, 44, 3, 5, 25)}`,
    jungpflanze: SOIL_BAND + `
      <line x1="26" y1="54" x2="24" y2="38" stroke="${C.stem}" stroke-width="1.5"/>
      <line x1="32" y1="54" x2="32" y2="34" stroke="${C.stem}" stroke-width="1.5"/>
      <line x1="38" y1="54" x2="40" y2="38" stroke="${C.stem}" stroke-width="1.5"/>
      <path d="M 32 44 l -4 -4 M 32 40 l 4 -4 M 25 44 l -3 -3 M 39 44 l 3 -3" stroke="${C.stem}" stroke-width="1" fill="none"/>
      ${leaf(24, 38, 3, 5, -20)}
      ${leaf(32, 34, 3, 5, 0)}
      ${leaf(40, 38, 3, 5, 20)}
      ${leaf(28, 40, 3, 5, -10)}`,
    reif: SOIL_BAND + `
      <line x1="24" y1="54" x2="22" y2="34" stroke="${C.stem}" stroke-width="1.6"/>
      <line x1="32" y1="54" x2="32" y2="28" stroke="${C.stem}" stroke-width="1.6"/>
      <line x1="40" y1="54" x2="42" y2="34" stroke="${C.stem}" stroke-width="1.6"/>
      <path d="M 32 40 l -5 -5 M 32 36 l 5 -5 M 23 42 l -4 -4 M 41 42 l 4 -4" stroke="${C.stem}" stroke-width="1" fill="none"/>
      ${leaf(22, 34, 3.5, 6, -20)}
      ${leaf(27, 35, 3.5, 6, -10)}
      ${leaf(32, 28, 3.5, 6, 0)}
      ${leaf(37, 35, 3.5, 6, 10)}
      ${leaf(42, 34, 3.5, 6, 20)}
      <g fill="${C.violet}" stroke="${C.violetD}" stroke-width="0.7">
        <circle cx="25" cy="45" r="2.3"/><circle cx="31" cy="47" r="2.3"/>
        <circle cx="38" cy="45" r="2.3"/><circle cx="34" cy="41" r="2.3"/>
      </g>
      <path d="M 24 42.2 h 2 M 25 41.2 v 2 M 30 44.2 h 2 M 31 43.2 v 2 M 37 42.2 h 2 M 38 41.2 v 2 M 33 38.2 h 2 M 34 37.2 v 2" stroke="${C.violetD}" stroke-width="0.6" fill="none"/>`,
  },

  stachelbeere: {
    aussaat: SOIL_FRESH + `
      <line x1="26" y1="54" x2="26" y2="60" stroke="${C.stem}" stroke-width="2"/>
      <line x1="32" y1="54" x2="32" y2="60" stroke="${C.stem}" stroke-width="2"/>
      <line x1="38" y1="54" x2="38" y2="60" stroke="${C.stem}" stroke-width="2"/>`,
    keimling: SOIL_BAND + `
      <line x1="28" y1="54" x2="28" y2="46" stroke="${C.stem}" stroke-width="1.7"/>
      <line x1="36" y1="54" x2="36" y2="44" stroke="${C.stem}" stroke-width="1.7"/>
      ${leaf(28, 44, 3, 5, -25)}
      ${leaf(36, 42, 3, 5, 25)}`,
    jungpflanze: SOIL_BAND + `
      <path d="M 32 54 Q 24 44 18 40" stroke="${C.stem}" stroke-width="1.6" fill="none"/>
      <path d="M 32 54 Q 40 44 46 40" stroke="${C.stem}" stroke-width="1.6" fill="none"/>
      <line x1="32" y1="54" x2="32" y2="40" stroke="${C.stem}" stroke-width="1.6"/>
      <path d="M 26 47 l -1.6 -1.4 M 38 47 l 1.6 -1.4 M 32 46 l 1.6 -1.4" stroke="${C.stem}" stroke-width="0.8" fill="none"/>
      ${leaf(18, 40, 4, 6, -30)}
      ${leaf(46, 40, 4, 6, 30)}
      ${leaf(32, 40, 4, 6, 0)}`,
    reif: SOIL_BAND + `
      <path d="M 32 54 Q 20 46 14 36" stroke="${C.stem}" stroke-width="1.7" fill="none"/>
      <path d="M 32 54 Q 44 46 50 36" stroke="${C.stem}" stroke-width="1.7" fill="none"/>
      <line x1="32" y1="54" x2="32" y2="34" stroke="${C.stem}" stroke-width="1.7"/>
      <path d="M 24 48 l -1.8 -1 M 40 48 l 1.8 -1 M 18 41 l -1.8 -1 M 46 41 l 1.8 -1 M 32 44 l 1.8 -1.4" stroke="${C.stem}" stroke-width="0.8" fill="none"/>
      ${leaf(14, 36, 4, 7, -30)}
      ${leaf(50, 36, 4, 7, 30)}
      ${leaf(32, 34, 4, 7, 0)}
      ${leaf(24, 44, 4, 6, -25)}
      ${leaf(40, 44, 4, 6, 25)}
      <path d="M 20 41 v 2 M 44 41 v 2 M 33 42 v 2" stroke="${C.stem}" stroke-width="0.8" fill="none"/>
      <circle cx="20" cy="46" r="3" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8"/>
      <circle cx="44" cy="46" r="3" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8"/>
      <circle cx="33" cy="47" r="3" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 20 43.6 v 4.8 M 18.7 44 q -0.5 2 0 4 M 21.3 44 q 0.5 2 0 4 M 44 43.6 v 4.8 M 42.7 44 q -0.5 2 0 4 M 45.3 44 q 0.5 2 0 4 M 33 44.6 v 4.8 M 31.7 45 q -0.5 2 0 4 M 34.3 45 q 0.5 2 0 4" stroke="${C.leafD}" stroke-width="0.5" opacity="0.55" fill="none"/>`,
  },

  brombeere: {
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
      <path d="M 32 54 Q 34 36 22 26" stroke="${C.stem}" stroke-width="1.8" fill="none"/>
      <path d="M 33 44 l 2 -1 M 31 35 l -2 -1 M 26 29 l 0 -2" stroke="${C.stem}" stroke-width="0.8" fill="none"/>
      ${leaf(30, 44, 5, 8, -40)}
      ${leaf(28, 32, 4, 7, 35)}`,
    reif: SOIL_BAND + `
      <path d="M 32 54 Q 40 34 20 18" stroke="${C.stem}" stroke-width="1.8" fill="none"/>
      <path d="M 32 54 Q 24 38 44 26" stroke="${C.stem}" stroke-width="1.6" fill="none"/>
      <path d="M 36 44 l 2 0.8 M 34 32 l 2 -1 M 26 22 l 1 -2 M 29 42 l -2 0.6 M 40 29 l 1.6 -1" stroke="${C.stem}" stroke-width="0.8" fill="none"/>
      ${leaf(33, 35, 5, 8, -35)}
      ${leaf(24, 20, 4, 7, -30)}
      ${leaf(38, 32, 4, 7, 40)}
      <g fill="${C.purpleD}" stroke="${C.violetD}" stroke-width="0.4">
        <circle cx="20" cy="17.8" r="1.2"/><circle cx="18.3" cy="19.6" r="1.2"/><circle cx="21.7" cy="19.6" r="1.2"/>
        <circle cx="19.1" cy="21.5" r="1.2"/><circle cx="20.9" cy="21.5" r="1.2"/>
        <circle cx="44" cy="25.8" r="1.2"/><circle cx="42.3" cy="27.6" r="1.2"/><circle cx="45.7" cy="27.6" r="1.2"/>
        <circle cx="43.1" cy="29.5" r="1.2"/><circle cx="44.9" cy="29.5" r="1.2"/>
        <circle cx="28" cy="40" r="1.2"/><circle cx="26.5" cy="41.6" r="1.2"/>
        <circle cx="29.5" cy="41.6" r="1.2"/><circle cx="28" cy="43.2" r="1.2"/>
      </g>`,
  },

  aronia: {
    aussaat: SOIL_FRESH + `
      <line x1="26" y1="54" x2="26" y2="60" stroke="${C.stem}" stroke-width="2"/>
      <line x1="32" y1="54" x2="32" y2="60" stroke="${C.stem}" stroke-width="2"/>
      <line x1="38" y1="54" x2="38" y2="60" stroke="${C.stem}" stroke-width="2"/>`,
    keimling: SOIL_BAND + `
      <line x1="28" y1="54" x2="28" y2="46" stroke="${C.stem}" stroke-width="1.7"/>
      <line x1="36" y1="54" x2="36" y2="44" stroke="${C.stem}" stroke-width="1.7"/>
      <ellipse cx="28" cy="44.5" rx="1.8" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-15 28 44.5)"/>
      <ellipse cx="36" cy="42.5" rx="1.8" ry="3" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(15 36 42.5)"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="26" y1="54" x2="25" y2="34" stroke="${C.stem}" stroke-width="1.6"/>
      <line x1="32" y1="54" x2="32" y2="30" stroke="${C.stem}" stroke-width="1.6"/>
      <line x1="38" y1="54" x2="39" y2="34" stroke="${C.stem}" stroke-width="1.6"/>
      <ellipse cx="25" cy="31" rx="2" ry="3.5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-12 25 31)"/>
      <ellipse cx="32" cy="27" rx="2" ry="3.5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>
      <ellipse cx="39" cy="31" rx="2" ry="3.5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(12 39 31)"/>
      <ellipse cx="28" cy="38" rx="2" ry="3.5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-8 28 38)"/>
      <ellipse cx="36" cy="38" rx="2" ry="3.5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(8 36 38)"/>`,
    reif: SOIL_BAND + `
      <line x1="24" y1="54" x2="24" y2="26" stroke="${C.stem}" stroke-width="1.7"/>
      <line x1="32" y1="54" x2="32" y2="22" stroke="${C.stem}" stroke-width="1.7"/>
      <line x1="40" y1="54" x2="40" y2="26" stroke="${C.stem}" stroke-width="1.7"/>
      <ellipse cx="24" cy="29" rx="2.4" ry="4.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-12 24 29)"/>
      <ellipse cx="32" cy="25" rx="2.4" ry="4.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>
      <ellipse cx="40" cy="29" rx="2.4" ry="4.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(12 40 29)"/>
      <ellipse cx="28" cy="32" rx="2.2" ry="3.8" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-8 28 32)"/>
      <ellipse cx="36" cy="32" rx="2.2" ry="3.8" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(8 36 32)"/>
      <path d="M 24 34 l -3 3.2 M 24 34 v 3.2 M 24 34 l 3 3.2 M 32 38 l -3 3.2 M 32 38 v 3.2 M 32 38 l 3 3.2 M 40 34 l -3 3.2 M 40 34 v 3.2 M 40 34 l 3 3.2" stroke="${C.stem}" stroke-width="0.7" fill="none"/>
      <g fill="${C.purpleD}" stroke="${C.violetD}" stroke-width="0.5">
        <circle cx="21" cy="38" r="1.7"/><circle cx="24" cy="38.4" r="1.7"/><circle cx="27" cy="38" r="1.7"/>
        <circle cx="29" cy="42" r="1.7"/><circle cx="32" cy="42.4" r="1.7"/><circle cx="35" cy="42" r="1.7"/>
        <circle cx="37" cy="38" r="1.7"/><circle cx="40" cy="38.4" r="1.7"/><circle cx="43" cy="38" r="1.7"/>
      </g>`,
  },

  holunder: {
    aussaat: SOIL_FRESH + `
      <line x1="30" y1="54" x2="30" y2="61" stroke="${C.stem}" stroke-width="2.8"/>
      <line x1="38" y1="54" x2="38" y2="60" stroke="${C.stem}" stroke-width="2.2"/>
      <circle cx="30" cy="57" r="0.7" fill="${C.leafD}"/>
      <circle cx="38" cy="57.5" r="0.6" fill="${C.leafD}"/>`,
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="44" stroke="${C.stem}" stroke-width="2"/>
      <path d="M 32 46 l -5 -2 M 32 46 l 5 -2" stroke="${C.stem}" stroke-width="0.9" fill="none"/>
      ${leaf(28, 43.5, 2.5, 4, -45)}
      ${leaf(36, 43.5, 2.5, 4, 45)}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="30" stroke="${C.stem}" stroke-width="2"/>
      <path d="M 32 50 Q 26 44 24 36" stroke="${C.stem}" stroke-width="1.6" fill="none"/>
      <path d="M 32 50 Q 38 44 40 36" stroke="${C.stem}" stroke-width="1.6" fill="none"/>
      ${leaf(24, 36, 3, 5, -30)}
      ${leaf(40, 36, 3, 5, 30)}
      ${leaf(29, 31, 3, 5, -15)}
      ${leaf(35, 31, 3, 5, 15)}`,
    reif: SOIL_BAND + `
      <path d="M 32 54 Q 30 34 30 16" stroke="${C.stem}" stroke-width="2.2" fill="none"/>
      <path d="M 32 50 Q 22 40 18 26" stroke="${C.stem}" stroke-width="1.8" fill="none"/>
      <path d="M 32 50 Q 42 40 46 26" stroke="${C.stem}" stroke-width="1.8" fill="none"/>
      <path d="M 28 36 l -8 -2 M 34 34 l 8 -2" stroke="${C.stem}" stroke-width="0.9" fill="none"/>
      ${leaf(24, 34, 2.5, 4.5, -45)}
      ${leaf(20, 33, 2.5, 4.5, -55)}
      ${leaf(38, 32, 2.5, 4.5, 45)}
      ${leaf(42, 31, 2.5, 4.5, 55)}
      <path d="M 30 16 l -6 -3.4 M 30 16 l -2.2 -4.4 M 30 16 l 2.2 -4.4 M 30 16 l 6 -3.4" stroke="${C.stem}" stroke-width="0.8" fill="none"/>
      <path d="M 18 26 l -4.5 -2.6 M 18 26 l -1.5 -3.4 M 18 26 l 1.8 -3.2" stroke="${C.stem}" stroke-width="0.7" fill="none"/>
      <path d="M 46 26 l 4.5 -2.6 M 46 26 l 1.5 -3.4 M 46 26 l -1.8 -3.2" stroke="${C.stem}" stroke-width="0.7" fill="none"/>
      <g fill="${C.purpleD}" stroke="${C.violetD}" stroke-width="0.4">
        <circle cx="24" cy="12.4" r="1.1"/><circle cx="27" cy="11.2" r="1.1"/><circle cx="30" cy="10.8" r="1.1"/>
        <circle cx="33" cy="11.2" r="1.1"/><circle cx="36" cy="12.4" r="1.1"/>
        <circle cx="26" cy="13.8" r="1.1"/><circle cx="34" cy="13.8" r="1.1"/>
        <circle cx="13.5" cy="22.8" r="1"/><circle cx="16.2" cy="21.9" r="1"/><circle cx="18.8" cy="21.9" r="1"/>
        <circle cx="21.4" cy="22.8" r="1"/><circle cx="17.5" cy="23.9" r="1"/>
        <circle cx="50.5" cy="22.8" r="1"/><circle cx="47.8" cy="21.9" r="1"/><circle cx="45.2" cy="21.9" r="1"/>
        <circle cx="42.6" cy="22.8" r="1"/><circle cx="46.5" cy="23.9" r="1"/>
      </g>`,
  },

  weintraube: {
    aussaat: SOIL_FRESH + `
      <line x1="32" y1="54" x2="32" y2="61" stroke="${C.stem}" stroke-width="2.4"/>
      <circle cx="32" cy="56.5" r="0.7" fill="${C.leafD}"/>
      <circle cx="32" cy="59.5" r="0.7" fill="${C.leafD}"/>`,
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="2"/>
      ${leaf(29, 45, 4, 6, -25)}
      ${leaf(35, 44, 4, 6, 25)}`,
    jungpflanze: SOIL_BAND + `
      <line x1="36" y1="54" x2="36" y2="26" stroke="${C.soilLine}" stroke-width="2" stroke-linecap="round"/>
      <path d="M 32 54 Q 38 46 34 38 Q 31 32 36 26" stroke="${C.stem}" stroke-width="1.8" fill="none"/>
      ${leaf(30, 40, 5, 8, -35)}
      ${leaf(38, 32, 5, 8, 35)}
      <path d="M 36 26 q 3 -2 2.4 -4.4 q -0.5 -1.8 -2.2 -1.2" stroke="${C.stem}" stroke-width="0.8" fill="none"/>`,
    reif: SOIL_BAND + `
      <line x1="36" y1="54" x2="36" y2="16" stroke="${C.soilLine}" stroke-width="2" stroke-linecap="round"/>
      <path d="M 31 54 Q 39 46 33 38 Q 28 30 36 24 Q 40 20 36 16" stroke="${C.stem}" stroke-width="2.4" fill="none"/>
      <path d="M 25 36 q -6 -1 -6.5 -6 q 2.2 1.2 3.6 0.2 q -2.6 -3 -1.6 -7 q 2 2.8 4.5 2.8 q 2.5 0 4.5 -2.8 q 1 4 -1.6 7 q 1.4 1 3.6 -0.2 q -0.5 5 -6.5 6 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 44 28 q -6 -1 -6.5 -6 q 2.2 1.2 3.6 0.2 q -2.6 -3 -1.6 -7 q 2 2.8 4.5 2.8 q 2.5 0 4.5 -2.8 q 1 4 -1.6 7 q 1.4 1 3.6 -0.2 q -0.5 5 -6.5 6 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 34 30 q 3 1 4 3 M 33 38 q -3 1.6 -4.5 3.4" stroke="${C.stem}" stroke-width="1" fill="none"/>
      <g fill="${C.violet}" stroke="${C.violetD}" stroke-width="0.6">
        <circle cx="36" cy="34.5" r="1.9"/><circle cx="39" cy="34.5" r="1.9"/><circle cx="42" cy="34.5" r="1.9"/>
        <circle cx="37.5" cy="38" r="1.9"/><circle cx="40.5" cy="38" r="1.9"/><circle cx="39" cy="41.4" r="1.9"/>
        <circle cx="25.5" cy="43" r="1.9"/><circle cx="28.5" cy="43" r="1.9"/><circle cx="31.5" cy="43" r="1.9"/>
        <circle cx="27" cy="46.4" r="1.9"/><circle cx="30" cy="46.4" r="1.9"/><circle cx="28.5" cy="49.6" r="1.9"/>
      </g>
      <path d="M 36 16 q 3 -2 2.4 -4.4 q -0.5 -1.8 -2.2 -1.2" stroke="${C.stem}" stroke-width="0.8" fill="none"/>`,
  },

  feigenbaum: {
    aussaat: SOIL_FRESH + `
      <line x1="32" y1="57" x2="32" y2="43" stroke="${C.stem}" stroke-width="2"/>
      ${leaf(30, 45, 2.5, 4, -30)}
      ${leaf(34, 43.5, 2.5, 4, 25)}`,
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="41" stroke="${C.stem}" stroke-width="2"/>
      ${leaf(29, 43, 3, 5, -35)}
      ${leaf(35, 42, 3, 5, 35)}
      ${leaf(32, 41, 3, 6, 0)}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="38" stroke="${C.stem}" stroke-width="2.2"/>
      <path d="M 32 42 l -5 -3" stroke="${C.stem}" stroke-width="1.3" fill="none"/>
      ${leaf(27, 39, 3, 5.5, -40)}
      ${leaf(27, 39, 3, 7, 0)}
      ${leaf(27, 39, 3, 5.5, 40)}
      ${leaf(32, 38, 3, 6, -40)}
      ${leaf(32, 38, 3.5, 8, 0)}
      ${leaf(32, 38, 3, 6, 40)}`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="34" stroke="${C.stem}" stroke-width="2.8"/>
      <path d="M 32 40 L 23 32 M 32 42 L 41 33 M 32 34 v -4" stroke="${C.stem}" stroke-width="1.6" fill="none"/>
      ${leaf(23, 32, 3.5, 7, -40)}
      ${leaf(23, 32, 4, 9.5, 0)}
      ${leaf(23, 32, 3.5, 7, 40)}
      ${leaf(41, 33, 3.5, 7, -40)}
      ${leaf(41, 33, 4, 9.5, 0)}
      ${leaf(41, 33, 3.5, 7, 40)}
      ${leaf(32, 30, 3.5, 7, -40)}
      ${leaf(32, 30, 4, 9.5, 0)}
      ${leaf(32, 30, 3.5, 7, 40)}
      <path d="M 27.5 36 q 3 3 3 5.2 a 3 3 0 1 1 -6 0 q 0 -2.2 3 -5.2 z" fill="${C.purple}" stroke="${C.purpleD}" stroke-width="0.8"/>
      <path d="M 37 37 q 3 3 3 5.2 a 3 3 0 1 1 -6 0 q 0 -2.2 3 -5.2 z" fill="${C.purple}" stroke="${C.purpleD}" stroke-width="0.8"/>`,
  },

  physalis: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="44" stroke="${C.stem}" stroke-width="1.5"/>
      ${cotyledon(28, 44, 'L', 'light')}
      ${cotyledon(36, 44, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="34" stroke="${C.stem}" stroke-width="1.6"/>
      ${leaf(27, 44, 5, 8, -30)}
      ${leaf(37, 40, 5, 8, 30)}
      ${leaf(30, 36, 4, 7, -15)}
      <path d="M 32 42 q 3 1 4 3" stroke="${C.stem}" stroke-width="0.8" fill="none"/>
      <path d="M 36 45 c 2.6 1.2 2.6 6 0 7.6 c -2.6 -1.6 -2.6 -6.4 0 -7.6 z" fill="${C.yellow}" opacity="0.85" stroke="${C.yellowD}" stroke-width="0.7"/>
      <path d="M 36 45.8 v 6" stroke="${C.yellowD}" stroke-width="0.5" fill="none"/>`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="24" stroke="${C.stem}" stroke-width="1.7"/>
      <path d="M 32 34 l -8 -4 M 32 30 l 8 -4 M 32 40 l -7 -2" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      ${leaf(28, 32, 4, 6, -20)}
      ${leaf(36, 28, 4, 6, 20)}
      ${leaf(32, 24, 4.5, 7, 0)}
      ${leaf(29, 42, 4, 6, -15)}
      <path d="M 24 30 q 0.5 1.5 0.5 3 M 40 26 q 0.5 1.5 0.5 3 M 25 38 q 0.8 1.4 1 2.6" stroke="${C.stem}" stroke-width="0.8" fill="none"/>
      <path d="M 24.5 33 c 2.9 1.5 2.9 6.6 0 8.4 c -2.9 -1.8 -2.9 -6.9 0 -8.4 z" fill="${C.yellow}" opacity="0.85" stroke="${C.yellowD}" stroke-width="0.7"/>
      <path d="M 40.5 29 c 2.9 1.5 2.9 6.6 0 8.4 c -2.9 -1.8 -2.9 -6.9 0 -8.4 z" fill="${C.yellow}" opacity="0.85" stroke="${C.yellowD}" stroke-width="0.7"/>
      <path d="M 24.5 33.8 v 6.8 M 40.5 29.8 v 6.8" stroke="${C.yellowD}" stroke-width="0.5" fill="none"/>
      <path d="M 26 41 q 3.4 1.6 2.4 5.8 q -1.8 -0.6 -2.4 -1.6 z" fill="${C.yellow}" opacity="0.85" stroke="${C.yellowD}" stroke-width="0.7"/>
      <path d="M 26 41 q -3.4 1.6 -2.4 5.8 q 1.8 -0.6 2.4 -1.6 z" fill="${C.yellow}" opacity="0.85" stroke="${C.yellowD}" stroke-width="0.7"/>
      <circle cx="26" cy="45.6" r="2.1" fill="${C.orange}" stroke="${C.orangeD}" stroke-width="0.7"/>`,
  },

  melone: {
    aussaat: SOIL_FRESH + flatSeeds([24, 40]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.5"/>
      <ellipse cx="25" cy="44" rx="7" ry="3.5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-15 25 44)"/>
      <ellipse cx="39" cy="44" rx="7" ry="3.5" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(15 39 44)"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="42" stroke="${C.stem}" stroke-width="1.6"/>
      <path d="M 18 42 q 0 -9 14 -9 q 14 0 14 9 q -4 3 -14 3 q -10 0 -14 -3 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 25 40 q 4 -6 7 -6 M 32 34 v 8 M 39 40 q -4 -6 -7 -6" stroke="${C.leafD}" stroke-width="0.7" fill="none"/>`,
    reif: SOIL_BAND + `
      <path d="M 12 52 Q 26 46 34 48 Q 40 49.5 44 46" stroke="${C.stem}" stroke-width="1.6" fill="none"/>
      <path d="M 16 46 q 0 -7 8 -7 q 8 0 8 7 q -3 2.4 -8 2.4 q -5 0 -8 -2.4 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 28 42 q 0 -6 6.5 -6 q 6.5 0 6.5 6 q -2.6 2 -6.5 2 q -3.9 0 -6.5 -2 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <circle cx="44" cy="46" r="8" fill="${C.yellow}" stroke="${C.yellowD}" stroke-width="0.9"/>
      <path d="M 40 39.2 q -2.6 6.8 0 13.6 M 44 38 v 16 M 48 39.2 q 2.6 6.8 0 13.6 M 36.3 43 q 7.7 -2.8 15.4 0 M 36.3 49 q 7.7 2.8 15.4 0" stroke="${C.yellowD}" stroke-width="0.5" fill="none"/>
      <path d="M 44 38 q -1 -2.5 -3 -3" stroke="${C.stem}" stroke-width="1.2" fill="none"/>`,
  },

  'mini-wassermelone': {
    aussaat: SOIL_FRESH + flatSeeds([26, 40]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.5"/>
      ${cotyledon(27, 44, 'L', 'light')}
      ${cotyledon(37, 44, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="44" stroke="${C.stem}" stroke-width="1.5"/>
      <path d="M 26 44 q 0 -6 6 -6 q 6 0 6 6 q -2.4 2 -6 2 q -3.6 0 -6 -2 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 38 44 q 3 -2 2.4 -4.4 q -0.5 -1.8 -2.2 -1.2" stroke="${C.stem}" stroke-width="0.8" fill="none"/>`,
    reif: SOIL_BAND + `
      <path d="M 10 52 Q 26 45 40 49 Q 47 50.8 52 48" stroke="${C.stem}" stroke-width="1.5" fill="none"/>
      <path d="M 27.5 47 q 0 -6 5.5 -6 q 5.5 0 5.5 6 q -2.2 2 -5.5 2 q -3.3 0 -5.5 -2 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      ${leaf(46, 49, 4, 7, 20)}
      <path d="M 40 47 q 3.4 -2.6 2.6 -5.2 q -0.6 -2 -2.6 -1.4 q -1.6 0.5 -0.8 2" stroke="${C.stem}" stroke-width="0.8" fill="none"/>
      <circle cx="20" cy="47.5" r="6.5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.9"/>
      <path d="M 17 42.3 q -2.2 5.2 0 10.4 M 20 41 v 13 M 23 42.3 q 2.2 5.2 0 10.4" stroke="${C.leafD}" stroke-width="1.1" fill="none"/>
      <path d="M 20 41 q 0.5 -2.5 2.5 -3" stroke="${C.stem}" stroke-width="1.1" fill="none"/>`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // ─── GEMÜSE ─ Erweiterung ────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════


  porree: {
    aussaat: SOIL_FRESH + dustSeeds([22, 30, 38, 46]),
    keimling: SOIL_BAND + `
      <line x1="30" y1="54" x2="29" y2="45" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="32" y1="54" x2="32" y2="43" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="34" y1="54" x2="35" y2="45" stroke="${C.stem}" stroke-width="1.4"/>`,
    jungpflanze: SOIL_BAND + `
      <path d="M 30.5 58 q 1.5 0.8 3 0 l 0 -13 l -3 0 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8"/>
      <path d="M 31 45 Q 26 37 22 30" stroke="${C.leaf}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 33 45 Q 38 37 42 30" stroke="${C.leaf}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 32 45 L 32 28" stroke="${C.leafL}" stroke-width="1.8" stroke-linecap="round"/>`,
    reif: SOIL_BAND + `
      <path d="M 29 61 q 3 1.4 6 0 l 0 -25 l -6 0 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <path d="M 30 61 l -1 2.5 M 32 61.5 l 0 2.5 M 34 61 l 1 2.5" stroke="${C.whiteD}" stroke-width="0.6" fill="none"/>
      <path d="M 30 38 Q 22 28 16 17" stroke="${C.leaf}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      <path d="M 34 38 Q 42 28 48 17" stroke="${C.leaf}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      <path d="M 31 37 Q 27 25 24 13" stroke="${C.leafL}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M 33 37 Q 37 25 40 13" stroke="${C.leafL}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
  },

  chili: {
    aussaat: SOIL_FRESH + dustSeeds([24, 32, 40]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="44" stroke="${C.stem}" stroke-width="1.4"/>
      ${cotyledon(28, 44, 'L', 'light')}
      ${cotyledon(36, 44, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="34" stroke="${C.stem}" stroke-width="1.4"/>
      ${leaf(28, 46, 4, 7, -25)}
      ${leaf(36, 42, 4, 7, 25)}
      ${leaf(30, 35, 3.5, 6, -10)}`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="24" stroke="${C.stem}" stroke-width="1.5"/>
      <path d="M 32 38 L 25 35 M 32 32 L 39 29 M 32 44 L 37 42" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      ${leaf(27, 48, 4, 7, -30)}
      ${leaf(37, 46, 4, 7, 30)}
      ${leaf(28, 30, 4, 6, -25)}
      ${leaf(36, 26, 4, 6, 25)}
      <path d="M 23.5 36 q 1.5 -1.2 3 0 l -0.4 1.6 l -2.2 0 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.6"/>
      <path d="M 23.4 37.4 q -1.5 5 0.8 9 q 1 1.6 1.8 -0.2 q 1.8 -4.5 0.4 -8.8 z" fill="${C.red}" stroke="${C.redD}" stroke-width="0.7"/>
      <path d="M 37.8 30 q 1.5 -1.2 3 0 l -0.4 1.6 l -2.2 0 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.6"/>
      <path d="M 37.7 31.4 q -1.5 5 0.8 9 q 1 1.6 1.8 -0.2 q 1.8 -4.5 0.4 -8.8 z" fill="${C.red}" stroke="${C.redD}" stroke-width="0.7"/>
      <path d="M 36 42.6 q 1.5 -1.2 3 0 l -0.4 1.6 l -2.2 0 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.6"/>
      <path d="M 35.9 44 q -1.3 4.5 0.7 8 q 0.9 1.5 1.7 -0.2 q 1.6 -4 0.3 -7.8 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7"/>`,
  },

  minigurke: {
    aussaat: SOIL_FRESH + flatSeeds([26, 40]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.5"/>
      ${cotyledon(27, 44, 'L', 'light')}
      ${cotyledon(37, 44, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="40" y1="54" x2="40" y2="22" stroke="${C.soilLine}" stroke-width="1.1"/>
      <path d="M 30 54 Q 33 44 39 36" stroke="${C.stem}" stroke-width="1.6" fill="none"/>
      ${leaf(32, 46, 5, 8, -40)}
      ${leaf(36, 39, 5, 8, 35)}
      <path d="M 39 36 q 3 -2 2.5 1 q -0.5 2 -2.5 1.2" stroke="${C.stem}" stroke-width="0.9" fill="none"/>`,
    reif: SOIL_BAND + `
      <line x1="40" y1="54" x2="40" y2="14" stroke="${C.soilLine}" stroke-width="1.1"/>
      <path d="M 28 54 Q 33 46 39 40 Q 44 34 40 26 Q 38 20 40 14" stroke="${C.stem}" stroke-width="1.7" fill="none"/>
      ${leaf(30, 48, 6, 9, -45)}
      ${leaf(35, 36, 6, 9, 40)}
      ${leaf(36, 22, 5, 8, -35)}
      <ellipse cx="34" cy="46" rx="2" ry="3.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(12 34 46)"/>
      <ellipse cx="44" cy="33" rx="2" ry="3.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(-12 44 33)"/>
      <ellipse cx="35" cy="27" rx="1.8" ry="3" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7" transform="rotate(10 35 27)"/>
      <path d="M 42 39 q 3.5 -2 3 1 q -0.5 2.5 -3 1.5" stroke="${C.stem}" stroke-width="0.9" fill="none"/>`,
  },

  fruehlingszwiebel: {
    aussaat: SOIL_FRESH + dustSeeds([24, 32, 40]),
    keimling: SOIL_BAND + `
      <line x1="30" y1="54" x2="29" y2="45" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="32" y1="54" x2="32" y2="43" stroke="${C.stem}" stroke-width="1.3"/>
      <line x1="34" y1="54" x2="35" y2="45" stroke="${C.stem}" stroke-width="1.3"/>`,
    jungpflanze: SOIL_BAND + `
      <rect x="27" y="54" width="2" height="4" rx="1" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.5"/>
      <rect x="31" y="54" width="2" height="4" rx="1" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.5"/>
      <rect x="35" y="54" width="2" height="4" rx="1" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.5"/>
      <line x1="28" y1="54" x2="26" y2="36" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="32" y1="54" x2="32" y2="32" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="33" y1="54" x2="35" y2="36" stroke="${C.leafL}" stroke-width="1.4"/>
      <line x1="36" y1="54" x2="38" y2="38" stroke="${C.leaf}" stroke-width="1.6"/>`,
    reif: SOIL_BAND + `
      <rect x="23.7" y="54" width="2.6" height="7" rx="1.2" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.6"/>
      <rect x="28.7" y="54" width="2.6" height="7" rx="1.2" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.6"/>
      <rect x="32.7" y="54" width="2.6" height="7" rx="1.2" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.6"/>
      <rect x="37.7" y="54" width="2.6" height="7" rx="1.2" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.6"/>
      <path d="M 25 61.5 l -0.5 2 M 30 61.5 l 0 2 M 34 61.5 l 0 2 M 39 61.5 l 0.5 2" stroke="${C.whiteD}" stroke-width="0.5" fill="none"/>
      <line x1="25" y1="54" x2="21" y2="30" stroke="${C.leaf}" stroke-width="1.8"/>
      <line x1="30" y1="54" x2="28" y2="24" stroke="${C.leaf}" stroke-width="1.8"/>
      <line x1="30.8" y1="54" x2="32" y2="26" stroke="${C.leafL}" stroke-width="1.5"/>
      <line x1="34" y1="54" x2="35" y2="22" stroke="${C.leaf}" stroke-width="1.8"/>
      <line x1="39" y1="54" x2="43" y2="30" stroke="${C.leaf}" stroke-width="1.8"/>`,
  },

  mais: {
    aussaat: SOIL_FRESH + ovalSeeds([24, 34, 44]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="45" stroke="${C.leafL}" stroke-width="1.6"/>
      <path d="M 32 47 q -3 -2 -4 -7" stroke="${C.leaf}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="28" stroke="${C.stem}" stroke-width="2"/>
      <path d="M 32 46 Q 24 42 18 46" stroke="${C.leaf}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M 32 40 Q 40 36 46 40" stroke="${C.leaf}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M 32 33 Q 25 29 21 31" stroke="${C.leafL}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 32 28 q 2 -4 1 -8" stroke="${C.leaf}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    reif: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="12" stroke="${C.stem}" stroke-width="2.4"/>
      <path d="M 32 48 Q 22 44 14 50" stroke="${C.leaf}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M 32 42 Q 42 38 50 44" stroke="${C.leaf}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M 32 34 Q 22 30 16 36" stroke="${C.leaf}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M 32 26 Q 42 22 48 28" stroke="${C.leaf}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M 32 19 Q 25 15 21 19" stroke="${C.leafL}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="26.5" cy="33" rx="3" ry="6.5" fill="${C.yellow}" stroke="${C.yellowD}" stroke-width="0.8" transform="rotate(-15 26.5 33)"/>
      <path d="M 26.5 27.5 v 11 M 24.5 30 q 2 0.8 4 0 M 24.2 33 q 2.3 0.8 4.6 0 M 24.5 36 q 2 0.8 4 0" stroke="${C.yellowD}" stroke-width="0.5" fill="none" transform="rotate(-15 26.5 33)"/>
      <path d="M 24.5 39.5 q -1.5 -7 0.5 -12.5 l 1.5 1 q -1.5 5.5 -0.5 11.5 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.6" transform="rotate(-15 26.5 33)"/>
      <path d="M 28.5 39.5 q 1.5 -7 -0.5 -12.5 l -1.5 1 q 1.5 5.5 0.5 11.5 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.6" transform="rotate(-15 26.5 33)"/>
      <path d="M 32 12 l -5 -6 M 32 12 l -2 -7 M 32 12 l 2 -7 M 32 12 l 5 -6" stroke="${C.flowerD}" stroke-width="1" fill="none" stroke-linecap="round"/>`,
  },

  topinambur: {
    aussaat: SOIL_FRESH + `
      <ellipse cx="22" cy="58" rx="4.5" ry="3" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <circle cx="26" cy="56.5" r="2" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8"/>
      <circle cx="19" cy="60.5" r="1.8" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8"/>
      <ellipse cx="42" cy="59" rx="4" ry="2.8" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <circle cx="45.5" cy="57.5" r="1.8" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8"/>`,
    keimling: SOIL_BAND + `
      <ellipse cx="32" cy="59" rx="4" ry="2.6" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7" opacity="0.6"/>
      <circle cx="35.5" cy="57.6" r="1.6" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.6" opacity="0.6"/>
      <line x1="32" y1="54" x2="32" y2="45" stroke="${C.stem}" stroke-width="1.4"/>
      ${cotyledon(28, 45, 'L', 'mid')}
      ${cotyledon(36, 45, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="24" cy="59" rx="4" ry="2.6" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7" opacity="0.6"/>
      <circle cx="27.5" cy="57.8" r="1.6" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.6" opacity="0.6"/>
      <line x1="32" y1="54" x2="32" y2="30" stroke="${C.stem}" stroke-width="1.6"/>
      ${leaf(27, 46, 5, 8, -30)}
      ${leaf(37, 40, 5, 8, 30)}
      ${leaf(29, 32, 4, 7, -20)}`,
    reif: SOIL_BAND + `
      <ellipse cx="20" cy="59.5" rx="3.5" ry="2.4" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8"/>
      <circle cx="23.5" cy="58.3" r="1.5" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7"/>
      <ellipse cx="43" cy="60" rx="3.5" ry="2.4" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8"/>
      <circle cx="40" cy="58.6" r="1.5" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7"/>
      <line x1="25" y1="54" x2="23" y2="13" stroke="${C.stem}" stroke-width="1.7"/>
      <line x1="39" y1="54" x2="41" y2="10" stroke="${C.stem}" stroke-width="1.7"/>
      ${leaf(24, 42, 5, 8, -30)}
      ${leaf(24, 30, 4, 7, 25)}
      ${leaf(40, 40, 5, 8, 30)}
      ${leaf(40, 28, 4, 7, -25)}
      <g fill="${C.flower}" stroke="${C.flowerD}" stroke-width="0.5">
        <circle cx="20.4" cy="12" r="1.4"/><circle cx="25.6" cy="12" r="1.4"/><circle cx="21.5" cy="9.8" r="1.4"/>
        <circle cx="24.5" cy="9.8" r="1.4"/><circle cx="21.5" cy="14.2" r="1.4"/><circle cx="24.5" cy="14.2" r="1.4"/>
        <circle cx="38.6" cy="9" r="1.3"/><circle cx="43.4" cy="9" r="1.3"/><circle cx="39.5" cy="6.9" r="1.3"/>
        <circle cx="42.5" cy="6.9" r="1.3"/><circle cx="39.5" cy="11.1" r="1.3"/><circle cx="42.5" cy="11.1" r="1.3"/>
      </g>
      <circle cx="23" cy="12" r="1.6" fill="${C.flowerD}"/>
      <circle cx="41" cy="9" r="1.5" fill="${C.flowerD}"/>`,
  },

  rhabarber: {
    aussaat: SOIL_FRESH + `
      <path d="M 25 60 q -1 -4 3 -4.5 q 1.5 -2 4 -1.5 q 4 -0.5 4.5 2.5 q 2 2 0 4 q -1 3 -5 2.5 q -4 1 -5.5 -1 q -1.5 0 -1 -2 z" fill="${C.soilD}" stroke="${C.soilLine}" stroke-width="0.9"/>
      <circle cx="30" cy="54.8" r="1.3" fill="${C.red}" stroke="${C.redD}" stroke-width="0.5"/>
      <circle cx="34" cy="55.2" r="1.1" fill="${C.red}" stroke="${C.redD}" stroke-width="0.5"/>`,
    keimling: SOIL_BAND + `
      <path d="M 27 60 q 0 -3.5 5 -3.5 q 5 0 5 3.5 q -2 2 -5 2 q -3 0 -5 -2 z" fill="${C.soilD}" stroke="${C.soilLine}" stroke-width="0.8" opacity="0.6"/>
      <path d="M 31 54 l -1.5 -8 l 2.5 -0.4 l 1 8.4 z" fill="${C.red}" stroke="${C.redD}" stroke-width="0.6"/>
      ${leaf(30, 46, 5, 7, -15)}`,
    jungpflanze: SOIL_BAND + `
      <path d="M 28 54 L 24 40 L 26.5 39.3 L 30.5 54 z" fill="${C.red}" stroke="${C.redD}" stroke-width="0.6"/>
      <path d="M 36 54 L 40 40 L 37.5 39.3 L 33.5 54 z" fill="${C.red}" stroke="${C.redD}" stroke-width="0.6"/>
      <path d="M 25 41 q -7 -1 -7.5 -6.5 q 0.5 -5.5 7 -6 q 7 -0.5 7.5 5.5 q 0 6 -7 7 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 39 41 q 7 -1 7.5 -6.5 q -0.5 -5.5 -7 -6 q -7 -0.5 -7.5 5.5 q 0 6 7 7 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 24.8 39 q -1 -5 0 -9 M 39.2 39 q 1 -5 0 -9" stroke="${C.leafD}" stroke-width="0.6" fill="none"/>`,
    reif: SOIL_BAND + `
      <path d="M 26 54 L 18 34 L 21 32.8 L 29 54 z" fill="${C.red}" stroke="${C.redD}" stroke-width="0.7"/>
      <path d="M 30.6 54 L 30.2 28 L 33.4 28 L 33.4 54 z" fill="${C.red}" stroke="${C.redD}" stroke-width="0.7"/>
      <path d="M 38 54 L 46 34 L 43 32.8 L 35 54 z" fill="${C.red}" stroke="${C.redD}" stroke-width="0.7"/>
      <path d="M 19.5 34 q -9 -1 -10 -8 q 0 -7 8 -8 q 9 -1 10 7 q 0 8 -8 9 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.9"/>
      <path d="M 32 29 q -9 -2 -9 -10 q 1 -7 9 -7 q 8 0 9 7 q 0 8 -9 10 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.9"/>
      <path d="M 44.5 34 q 9 -1 10 -8 q 0 -7 -8 -8 q -9 -1 -10 7 q 0 8 8 9 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.9"/>
      <path d="M 18.5 32 q -1.5 -8 0 -13 M 32 27 q 0 -8 0 -13 M 45.5 32 q 1.5 -8 0 -13" stroke="${C.leafD}" stroke-width="0.7" fill="none"/>
      <path d="M 14 26 q 4 -3 7 -1 M 27 21 q 4 -3 8 0 M 43 26 q 4 -1 7 -3" stroke="${C.leafD}" stroke-width="0.6" fill="none"/>`,
  },

  spargel: {
    aussaat: SOIL_FRESH + `
      <circle cx="32" cy="56.5" r="1.5" fill="${C.whiteD}"/>
      <path d="M 32 56.5 l -9 3 M 32 56.5 l -5 5.5 M 32 56.5 l 0 6.5 M 32 56.5 l 5 5.5 M 32 56.5 l 9 3" stroke="${C.whiteD}" stroke-width="0.8" fill="none"/>
      <circle cx="32" cy="54.5" r="0.9" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>`,
    keimling: SOIL_BAND + `
      <path d="M 32 57 l -8 3 M 32 57 l -4 5 M 32 57 l 0 6 M 32 57 l 4 5 M 32 57 l 8 3" stroke="${C.whiteD}" stroke-width="0.8" opacity="0.55" fill="none"/>
      <path d="M 30.8 54 l 0 -6 q 1.2 -2.6 2.4 0 l 0 6 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 31 51 l 2 -1 M 31 49 l 2 -1" stroke="${C.leafD}" stroke-width="0.5" fill="none"/>`,
    jungpflanze: SOIL_BAND + `
      <path d="M 32 57 l -8 3 M 32 57 l -4 5 M 32 57 l 0 6 M 32 57 l 4 5 M 32 57 l 8 3" stroke="${C.whiteD}" stroke-width="0.8" opacity="0.5" fill="none"/>
      <path d="M 26.9 54 l 0 -9 q 1.1 -2.4 2.2 0 l 0 9 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 30.9 54 l 0 -12 q 1.1 -2.4 2.2 0 l 0 12 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 34.9 54 l 0 -8 q 1.1 -2.4 2.2 0 l 0 8 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.7"/>
      <path d="M 27.3 49 l 1.6 -0.8 M 31.3 46 l 1.6 -0.8 M 31.3 49 l 1.6 -0.8 M 35.3 50 l 1.6 -0.8" stroke="${C.leafD}" stroke-width="0.5" fill="none"/>`,
    reif: SOIL_BAND + `
      <path d="M 24.4 54 l 0 -10.5 q 1.6 -3 3.2 0 l 0 10.5 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 30.4 54 l 0 -13.5 q 1.6 -3 3.2 0 l 0 13.5 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 35.6 54 l 0 -9 q 1.4 -2.8 2.8 0 l 0 9 z" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 25 48 l 2 -1 M 25 45 l 2 -1 M 31 47 l 2 -1 M 31 44 l 2 -1 M 31 41 l 2 -1 M 36.2 49 l 2 -1 M 36.2 46.5 l 2 -1" stroke="${C.leafD}" stroke-width="0.5" fill="none"/>
      <path d="M 44 54 Q 45 36 43 16" stroke="${C.stem}" stroke-width="1.2" fill="none"/>
      <path d="M 44.5 46 l -5 -2 M 44.5 46 l 4.5 -2.5 M 44.4 40 l -4.5 -2 M 44.4 40 l 4.5 -2 M 44.2 34 l -4 -2 M 44.2 34 l 4 -2 M 43.9 28 l -3.5 -2 M 43.9 28 l 3.5 -2 M 43.6 22 l -3 -2 M 43.6 22 l 3 -2 M 43.4 17 l -2 -2.5 M 43.4 17 l 2 -2.5" stroke="${C.leaf}" stroke-width="0.8" fill="none"/>
      <path d="M 39.5 44 l -1.5 -1.5 m 1.5 1.5 l -0.5 -2 M 49 43.5 l 1.5 -1.5 m -1.5 1.5 l 0.5 -2 M 39.9 38 l -1.5 -1.5 m 1.5 1.5 l -0.4 -2 M 48.9 38 l 1.5 -1.5 m -1.5 1.5 l 0.4 -2 M 40.2 32 l -1.4 -1.4 m 1.4 1.4 l -0.4 -1.8 M 48.2 32 l 1.4 -1.4 m -1.4 1.4 l 0.4 -1.8 M 40.4 26 l -1.3 -1.3 m 1.3 1.3 l -0.3 -1.7 M 47.4 26 l 1.3 -1.3 m -1.3 1.3 l 0.3 -1.7" stroke="${C.leafL}" stroke-width="0.6" fill="none"/>`,
  },

  linse: {
    aussaat: SOIL_FRESH + `
      <ellipse cx="24" cy="58" rx="2" ry="1.2" fill="${C.orange}" stroke="${C.orangeD}" stroke-width="0.7"/>
      <ellipse cx="33" cy="59" rx="2" ry="1.2" fill="${C.orange}" stroke="${C.orangeD}" stroke-width="0.7"/>
      <ellipse cx="42" cy="58" rx="2" ry="1.2" fill="${C.orange}" stroke="${C.orangeD}" stroke-width="0.7"/>`,
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="46" stroke="${C.stem}" stroke-width="1.1"/>
      <ellipse cx="30" cy="46.5" rx="1.6" ry="1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>
      <ellipse cx="34" cy="46.5" rx="1.6" ry="1" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5"/>`,
    jungpflanze: SOIL_BAND + `
      <path d="M 31 54 Q 28 46 26 38" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <path d="M 33 54 Q 36 45 38 39" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <g fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5">
        <ellipse cx="27.2" cy="45" rx="1.5" ry="0.9"/><ellipse cx="30.8" cy="44" rx="1.5" ry="0.9"/>
        <ellipse cx="24.5" cy="40.5" rx="1.5" ry="0.9"/><ellipse cx="28" cy="39.5" rx="1.5" ry="0.9"/>
        <ellipse cx="34.6" cy="46" rx="1.5" ry="0.9"/><ellipse cx="38" cy="45" rx="1.5" ry="0.9"/>
        <ellipse cx="36.2" cy="41" rx="1.5" ry="0.9"/><ellipse cx="39.6" cy="40.5" rx="1.5" ry="0.9"/>
      </g>`,
    reif: SOIL_BAND + `
      <path d="M 30 54 Q 24 44 21 34" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <path d="M 31.5 54 Q 29 42 28 32" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <path d="M 32.5 54 Q 35 42 36 32" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <path d="M 34 54 Q 40 44 43 34" stroke="${C.stem}" stroke-width="1.1" fill="none"/>
      <g fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.5">
        <ellipse cx="24.6" cy="45" rx="1.4" ry="0.9"/><ellipse cx="27.8" cy="44" rx="1.4" ry="0.9"/>
        <ellipse cx="22.6" cy="40" rx="1.4" ry="0.9"/><ellipse cx="25.8" cy="39" rx="1.4" ry="0.9"/>
        <ellipse cx="20.2" cy="35.5" rx="1.4" ry="0.9"/><ellipse cx="23.4" cy="34.8" rx="1.4" ry="0.9"/>
        <ellipse cx="28" cy="42" rx="1.4" ry="0.9"/><ellipse cx="31" cy="40.5" rx="1.4" ry="0.9"/>
        <ellipse cx="27.2" cy="36" rx="1.4" ry="0.9"/><ellipse cx="30.2" cy="35" rx="1.4" ry="0.9"/>
        <ellipse cx="35.8" cy="42" rx="1.4" ry="0.9"/><ellipse cx="33" cy="40.5" rx="1.4" ry="0.9"/>
        <ellipse cx="36.8" cy="36" rx="1.4" ry="0.9"/><ellipse cx="33.8" cy="35" rx="1.4" ry="0.9"/>
        <ellipse cx="39.4" cy="45" rx="1.4" ry="0.9"/><ellipse cx="42.4" cy="44" rx="1.4" ry="0.9"/>
        <ellipse cx="41.4" cy="40" rx="1.4" ry="0.9"/><ellipse cx="44.2" cy="38.8" rx="1.4" ry="0.9"/>
      </g>
      <g fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.5">
        <circle cx="21" cy="32.5" r="1.1"/><circle cx="28" cy="30.5" r="1.1"/><circle cx="36" cy="30.5" r="1.1"/><circle cx="43" cy="32.5" r="1.1"/>
      </g>
      <ellipse cx="26" cy="47" rx="1.5" ry="2.6" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.6" transform="rotate(15 26 47)"/>
      <ellipse cx="39" cy="47" rx="1.5" ry="2.6" fill="${C.leafL}" stroke="${C.leafD}" stroke-width="0.6" transform="rotate(-15 39 47)"/>
      <g fill="${C.leafD}">
        <circle cx="25.7" cy="46" r="0.5"/><circle cx="26.3" cy="48" r="0.5"/>
        <circle cx="39.3" cy="46" r="0.5"/><circle cx="38.7" cy="48" r="0.5"/>
      </g>`,
  },

  schwarzwurzel: {
    aussaat: SOIL_FRESH + dustSeeds([22, 30, 38, 46]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="47" stroke="${C.stem}" stroke-width="1.2"/>
      <path d="M 32 49 l -2.5 -5 M 32 49 l 2.5 -5 M 32 47 l 0 -5" stroke="${C.stem}" stroke-width="1" fill="none"/>`,
    jungpflanze: SOIL_BAND + `
      <path d="M 30.8 54 l 1.2 7 l 1.2 -7 z" fill="${C.soilD}" stroke="${C.soilLine}" stroke-width="0.7" opacity="0.55"/>
      <line x1="29" y1="54" x2="26" y2="38" stroke="${C.leaf}" stroke-width="1.4"/>
      <line x1="31.5" y1="54" x2="30" y2="34" stroke="${C.leaf}" stroke-width="1.4"/>
      <line x1="33" y1="54" x2="34.5" y2="34" stroke="${C.leafL}" stroke-width="1.3"/>
      <line x1="35" y1="54" x2="38" y2="38" stroke="${C.leaf}" stroke-width="1.4"/>`,
    reif: SOIL_BAND + `
      <path d="M 30 54 l 2 9.5 l 2 -9.5 z" fill="${C.soilD}" stroke="${C.soilLine}" stroke-width="0.9"/>
      <line x1="32" y1="55.5" x2="32" y2="61.5" stroke="${C.white}" stroke-width="0.7"/>
      <line x1="27" y1="54" x2="21" y2="30" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="30" y1="54" x2="27" y2="24" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="32" y1="54" x2="32" y2="20" stroke="${C.leafL}" stroke-width="1.5"/>
      <line x1="34" y1="54" x2="37" y2="24" stroke="${C.leaf}" stroke-width="1.6"/>
      <line x1="37" y1="54" x2="43" y2="30" stroke="${C.leaf}" stroke-width="1.6"/>`,
  },

  meerrettich: {
    aussaat: SOIL_FRESH + `
      <rect x="25" y="56" width="13" height="3.2" rx="1.6" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.8" transform="rotate(-18 31.5 57.6)"/>
      <circle cx="37.5" cy="55.4" r="0.8" fill="${C.whiteD}"/>`,
    keimling: SOIL_BAND + `
      <rect x="26" y="56.5" width="12" height="3" rx="1.5" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.7" opacity="0.6" transform="rotate(-18 32 58)"/>
      <line x1="32" y1="54" x2="32" y2="45" stroke="${C.stem}" stroke-width="1.4"/>
      ${cotyledon(28, 45, 'L', 'mid')}
      ${cotyledon(36, 45, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <ellipse cx="26" cy="42" rx="3" ry="8" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(-12 26 42)"/>
      <ellipse cx="32" cy="39" rx="3" ry="9" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <ellipse cx="38" cy="42" rx="3" ry="8" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8" transform="rotate(12 38 42)"/>
      <path d="M 27 50 l -1 4 M 32 48 l 0 6 M 37 50 l 1 4" stroke="${C.stem}" stroke-width="1.1" fill="none"/>`,
    reif: SOIL_BAND + `
      <path d="M 29 54 l 3 9.5 l 3 -9.5 z" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <path d="M 30.5 59 l -1.5 1.5 M 33.5 59 l 1.5 1.5" stroke="${C.whiteD}" stroke-width="0.6" fill="none"/>
      <path d="M 24 54 q -8 -8 -7 -22 q 0.5 -6 5 -6 q 4.5 0 5 6 q 1 14 -3 22 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.9"/>
      <path d="M 30 54 q -3 -12 -1 -26 q 1 -5 3 -5 q 2 0 3 5 q 2 14 -1 26 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.9"/>
      <path d="M 40 54 q 8 -8 7 -22 q -0.5 -6 -5 -6 q -4.5 0 -5 6 q -1 14 3 22 z" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.9"/>
      <path d="M 24 52 q -4 -12 -3 -24 M 31.8 52 q -1 -14 0.4 -28 M 40 52 q 4 -12 3 -24" stroke="${C.leafD}" stroke-width="0.7" fill="none"/>
      <path d="M 19 38 q 3 -1 5 1 M 27 34 q 3 -1 5 1 M 40 38 q 3 1 5 -1" stroke="${C.leafD}" stroke-width="0.5" fill="none"/>`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // ─── BLUMEN ─ Begleitpflanzen ────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════


  tagetes: {
    aussaat: SOIL_FRESH + dustSeeds([22, 30, 38, 46]),
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="47" stroke="${C.stem}" stroke-width="1.3"/>
      ${cotyledon(28, 47, 'L', 'light')}
      ${cotyledon(36, 47, 'R', 'light')}`,
    jungpflanze: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="40" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="32" y1="50" x2="26" y2="42" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="32" y1="50" x2="38" y2="42" stroke="${C.stem}" stroke-width="1.2"/>
      <path d="M 26 42 l -3 -4 M 26 42 l 0 -5 M 26 42 l 3 -4" stroke="${C.stem}" stroke-width="1"/>
      <path d="M 32 40 l -3 -4 M 32 40 l 0 -5 M 32 40 l 3 -4" stroke="${C.stem}" stroke-width="1"/>
      <path d="M 38 42 l -3 -4 M 38 42 l 0 -5 M 38 42 l 3 -4" stroke="${C.stem}" stroke-width="1"/>`,
    reif: SOIL_BAND + `
      <line x1="27" y1="54" x2="23" y2="36" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="32" y1="54" x2="32" y2="26" stroke="${C.stem}" stroke-width="1.4"/>
      <line x1="37" y1="54" x2="41" y2="33" stroke="${C.stem}" stroke-width="1.4"/>
      <path d="M 25 45 l -4 -3 M 25 45 l -1 -5 M 25 45 l 2 -4" stroke="${C.stem}" stroke-width="1"/>
      <path d="M 32 42 l -3 -4 M 32 42 l 0 -5 M 32 42 l 3 -4" stroke="${C.stem}" stroke-width="1"/>
      <path d="M 39 44 l 4 -3 M 39 44 l 1 -5 M 39 44 l -2 -4" stroke="${C.stem}" stroke-width="1"/>
      <circle cx="23" cy="33" r="3.4" fill="${C.orange}" stroke="${C.orangeD}" stroke-width="0.8"/>
      <path d="M 27.2 33 l 1.8 0 M 26 30 l 1.3 -1.3 M 23 28.8 l 0 -1.8 M 20 30 l -1.3 -1.3 M 18.8 33 l -1.8 0 M 20 36 l -1.3 1.3 M 23 37.2 l 0 1.8 M 26 36 l 1.3 1.3" stroke="${C.orangeD}" stroke-width="0.9" stroke-linecap="round"/>
      <circle cx="23" cy="33" r="1.2" fill="${C.yellowD}"/>
      <circle cx="32" cy="22" r="3.4" fill="${C.orange}" stroke="${C.orangeD}" stroke-width="0.8"/>
      <path d="M 36.2 22 l 1.8 0 M 35 19 l 1.3 -1.3 M 32 17.8 l 0 -1.8 M 29 19 l -1.3 -1.3 M 27.8 22 l -1.8 0 M 29 25 l -1.3 1.3 M 32 26.2 l 0 1.8 M 35 25 l 1.3 1.3" stroke="${C.orangeD}" stroke-width="0.9" stroke-linecap="round"/>
      <circle cx="32" cy="22" r="1.2" fill="${C.yellowD}"/>
      <circle cx="41" cy="30" r="3.4" fill="${C.orange}" stroke="${C.orangeD}" stroke-width="0.8"/>
      <path d="M 45.2 30 l 1.8 0 M 44 27 l 1.3 -1.3 M 41 25.8 l 0 -1.8 M 38 27 l -1.3 -1.3 M 36.8 30 l -1.8 0 M 38 33 l -1.3 1.3 M 41 34.2 l 0 1.8 M 44 33 l 1.3 1.3" stroke="${C.orangeD}" stroke-width="0.9" stroke-linecap="round"/>
      <circle cx="41" cy="30" r="1.2" fill="${C.yellowD}"/>`,
  },

  kapuzinerkresse: {
    aussaat: SOIL_FRESH + `
      <circle cx="22" cy="58" r="3" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <circle cx="42" cy="59" r="3" fill="${C.white}" stroke="${C.whiteD}" stroke-width="0.9"/>
      <path d="M 20 57 q 2 1.5 4 0 M 21 59.5 q 1 1 2 0 M 40 58 q 2 1.5 4 0 M 41 60.5 q 1 1 2 0" stroke="${C.whiteD}" stroke-width="0.5" fill="none"/>`,
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="44" stroke="${C.stem}" stroke-width="1.5"/>
      ${cotyledon(28, 44, 'L', 'mid')}
      ${cotyledon(36, 44, 'R', 'mid')}`,
    jungpflanze: SOIL_BAND + `
      <path d="M 32 54 Q 24 52 17 44" stroke="${C.stem}" stroke-width="1.5" fill="none"/>
      <path d="M 32 54 Q 38 48 42 38" stroke="${C.stem}" stroke-width="1.5" fill="none"/>
      <circle cx="17" cy="43" r="4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 17 44 l -2.8 -2.2 M 17 44 l 2.8 -2.2 M 17 44 l -2.2 2.4 M 17 44 l 2.2 2.4 M 17 44 l 0 -3.4" stroke="${C.leafD}" stroke-width="0.6"/>
      <circle cx="17" cy="44" r="0.7" fill="${C.leafD}"/>
      <circle cx="42" cy="37" r="4.2" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 42 38 l -2.9 -2.3 M 42 38 l 2.9 -2.3 M 42 38 l -2.3 2.5 M 42 38 l 2.3 2.5 M 42 38 l 0 -3.6" stroke="${C.leafD}" stroke-width="0.6"/>
      <circle cx="42" cy="38" r="0.7" fill="${C.leafD}"/>`,
    reif: SOIL_BAND + `
      <path d="M 32 54 Q 20 52 12 46" stroke="${C.stem}" stroke-width="1.6" fill="none"/>
      <path d="M 32 54 Q 44 50 52 44" stroke="${C.stem}" stroke-width="1.6" fill="none"/>
      <path d="M 31 54 Q 30 40 30 28" stroke="${C.stem}" stroke-width="1.3" fill="none"/>
      <path d="M 14 46 Q 16 38 20 33" stroke="${C.stem}" stroke-width="1.2" fill="none"/>
      <path d="M 50 44 Q 47 38 44 33" stroke="${C.stem}" stroke-width="1.2" fill="none"/>
      <circle cx="13" cy="44" r="4.5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 13 45 l -3 -2.4 M 13 45 l 3 -2.4 M 13 45 l -2.4 2.6 M 13 45 l 2.4 2.6 M 13 45 l 0 -3.8" stroke="${C.leafD}" stroke-width="0.6"/>
      <circle cx="13" cy="45" r="0.7" fill="${C.leafD}"/>
      <circle cx="24" cy="49" r="4" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 24 50 l -2.8 -2.2 M 24 50 l 2.8 -2.2 M 24 50 l -2.2 2.4 M 24 50 l 2.2 2.4 M 24 50 l 0 -3.4" stroke="${C.leafD}" stroke-width="0.6"/>
      <circle cx="24" cy="50" r="0.7" fill="${C.leafD}"/>
      <circle cx="42" cy="47" r="4.5" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="0.8"/>
      <path d="M 42 48 l -3 -2.4 M 42 48 l 3 -2.4 M 42 48 l -2.4 2.6 M 42 48 l 2.4 2.6 M 42 48 l 0 -3.8" stroke="${C.leafD}" stroke-width="0.6"/>
      <circle cx="42" cy="48" r="0.7" fill="${C.leafD}"/>
      <path d="M 20 33 L 15.5 27 Q 17.5 25.2 20 26 Q 22.5 25.2 24.5 27 Z" fill="${C.orange}" stroke="${C.orangeD}" stroke-width="0.8"/>
      <path d="M 20 33 q 2.5 1.5 3.5 4" stroke="${C.orangeD}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M 44 33 L 39.5 27 Q 41.5 25.2 44 26 Q 46.5 25.2 48.5 27 Z" fill="${C.yellow}" stroke="${C.yellowD}" stroke-width="0.8"/>
      <path d="M 44 33 q -2.5 1.5 -3.5 4" stroke="${C.yellowD}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M 30 28 L 26 22.5 Q 27.8 20.8 30 21.5 Q 32.2 20.8 34 22.5 Z" fill="${C.orange}" stroke="${C.orangeD}" stroke-width="0.8"/>
      <path d="M 30 28 q 2.2 1.4 3 3.6" stroke="${C.orangeD}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`,
  },

  lavendel: {
    aussaat: SOIL_FRESH + `
      <line x1="30" y1="60" x2="30" y2="47" stroke="${C.stem}" stroke-width="2"/>
      <path d="M 30 49 l -3 -3 M 30 49 l 3 -3 M 30 52 l -3 -3 M 30 52 l 3 -3" stroke="${C.leafL}" stroke-width="1.1"/>
      <circle cx="30" cy="61.5" r="0.6" fill="${C.leafD}"/>
      <line x1="40" y1="60" x2="40" y2="50" stroke="${C.stem}" stroke-width="2"/>
      <path d="M 40 52 l -2.5 -2.5 M 40 52 l 2.5 -2.5" stroke="${C.leafL}" stroke-width="1.1"/>
      <circle cx="40" cy="61.5" r="0.6" fill="${C.leafD}"/>`,
    keimling: SOIL_BAND + `
      <line x1="32" y1="54" x2="32" y2="44" stroke="${C.stem}" stroke-width="1.6"/>
      <path d="M 32 46 l -3 -3 M 32 46 l 3 -3 M 32 49 l -3.5 -2.5 M 32 49 l 3.5 -2.5 M 32 52 l -3 -2 M 32 52 l 3 -2" stroke="${C.leafL}" stroke-width="1.1"/>`,
    jungpflanze: SOIL_BAND + `
      <line x1="26" y1="54" x2="24" y2="40" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="32" y1="54" x2="32" y2="37" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="38" y1="54" x2="40" y2="40" stroke="${C.stem}" stroke-width="1.2"/>
      <path d="M 25 46 l -3 -3 M 25 44 l 3 -3 M 24 42 l -3 -2.5" stroke="${C.leafL}" stroke-width="1.1"/>
      <path d="M 32 45 l -3 -3 M 32 42 l 3 -3 M 32 39 l -3 -2.5" stroke="${C.leafL}" stroke-width="1.1"/>
      <path d="M 39 46 l 3 -3 M 39 44 l -3 -3 M 40 42 l 3 -2.5" stroke="${C.leafL}" stroke-width="1.1"/>`,
    reif: SOIL_BAND + `
      <line x1="22" y1="54" x2="19" y2="40" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="27" y1="54" x2="26" y2="36" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="32" y1="54" x2="32" y2="34" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="37" y1="54" x2="38" y2="36" stroke="${C.stem}" stroke-width="1.2"/>
      <line x1="42" y1="54" x2="45" y2="40" stroke="${C.stem}" stroke-width="1.2"/>
      <path d="M 20 48 l -3 -3 M 20 45 l 3 -3 M 19 42 l -3 -2.5 M 26 46 l -3 -3 M 26 42 l 3 -3 M 26 38 l -3 -2.5" stroke="${C.leafL}" stroke-width="1.1"/>
      <path d="M 32 46 l -3 -3 M 32 42 l 3 -3 M 32 38 l -3 -3 M 32 36 l 3 -2.5" stroke="${C.leafL}" stroke-width="1.1"/>
      <path d="M 38 46 l 3 -3 M 38 42 l -3 -3 M 38 38 l 3 -2.5 M 44 48 l 3 -3 M 44 45 l -3 -3 M 45 42 l 3 -2.5" stroke="${C.leafL}" stroke-width="1.1"/>
      <line x1="25" y1="44" x2="23" y2="22" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="32" y1="40" x2="32" y2="15" stroke="${C.stem}" stroke-width="1.1"/>
      <line x1="39" y1="44" x2="41" y2="22" stroke="${C.stem}" stroke-width="1.1"/>
      <g fill="${C.violet}" stroke="${C.violetD}" stroke-width="0.6">
        <ellipse cx="23" cy="20.8" rx="1.9" ry="1.2"/><ellipse cx="23" cy="18.6" rx="1.7" ry="1.1"/><ellipse cx="23" cy="16.6" rx="1.4" ry="1"/>
        <ellipse cx="32" cy="13.8" rx="1.9" ry="1.2"/><ellipse cx="32" cy="11.6" rx="1.7" ry="1.1"/><ellipse cx="32" cy="9.6" rx="1.4" ry="1"/>
        <ellipse cx="41" cy="20.8" rx="1.9" ry="1.2"/><ellipse cx="41" cy="18.6" rx="1.7" ry="1.1"/><ellipse cx="41" cy="16.6" rx="1.4" ry="1"/>
      </g>`,
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

  dill:         { name: 'Dill',         type: 'Kraut', latin: 'Anethum graveolens',      seedType: 'dust' },
  koriander:    { name: 'Koriander',    type: 'Kraut', latin: 'Coriandrum sativum',      seedType: 'oval' },
  kresse:       { name: 'Kresse',       type: 'Kraut', latin: 'Lepidium sativum',        seedType: 'dust' },
  thymian:      { name: 'Thymian',      type: 'Kraut', latin: 'Thymus vulgaris',         seedType: 'dust' },
  salbei:       { name: 'Salbei',       type: 'Kraut', latin: 'Salvia officinalis',      seedType: 'oval' },
  oregano:      { name: 'Oregano',      type: 'Kraut', latin: 'Origanum vulgare',        seedType: 'dust' },
  rosmarin:     { name: 'Rosmarin',     type: 'Kraut', latin: 'Rosmarinus officinalis',  seedType: 'cutting' },
  minze:        { name: 'Minze',        type: 'Kraut', latin: 'Mentha × piperita',       seedType: 'cutting' },
  liebstoeckel: { name: 'Liebstöckel',  type: 'Kraut', latin: 'Levisticum officinale',   seedType: 'oval' },
  bohnenkraut:  { name: 'Bohnenkraut',  type: 'Kraut', latin: 'Satureja hortensis',      seedType: 'dust' },
  estragon:     { name: 'Estragon',     type: 'Kraut', latin: 'Artemisia dracunculus',   seedType: 'cutting' },
  majoran:      { name: 'Majoran',      type: 'Kraut', latin: 'Origanum majorana',       seedType: 'dust' },

  brokkoli:    { name: 'Brokkoli',   type: 'Blattgemüse',   latin: 'Brassica oleracea var. italica',       seedType: 'oval' },
  karfiol:     { name: 'Karfiol',    type: 'Blattgemüse',   latin: 'Brassica oleracea var. botrytis',      seedType: 'oval' },
  chinakohl:   { name: 'Chinakohl',  type: 'Blattgemüse',   latin: 'Brassica rapa subsp. pekinensis',      seedType: 'oval' },
  gruenkohl:   { name: 'Grünkohl',   type: 'Blattgemüse',   latin: 'Brassica oleracea var. sabellica',     seedType: 'oval' },
  rosenkohl:   { name: 'Rosenkohl',  type: 'Blattgemüse',   latin: 'Brassica oleracea var. gemmifera',     seedType: 'oval' },
  pakchoi:     { name: 'Pak Choi',   type: 'Salat',         latin: 'Brassica rapa subsp. chinensis',       seedType: 'oval' },
  mizuna:      { name: 'Mizuna',     type: 'Salat',         latin: 'Brassica rapa var. niposinica',        seedType: 'dust' },
  rettich:     { name: 'Rettich',    type: 'Wurzel/Knolle', latin: 'Raphanus sativus var. longipinnatus',  seedType: 'oval' },
  mairuebchen: { name: 'Mairübchen', type: 'Wurzel/Knolle', latin: 'Brassica rapa subsp. rapa',            seedType: 'dust' },
  endivie:     { name: 'Endivie',    type: 'Salat',         latin: 'Cichorium endivia',                    seedType: 'dust' },

  heidelbeere:         { name: 'Heidelbeere',       type: 'Obst',         latin: 'Vaccinium corymbosum', seedType: 'cutting' },
  stachelbeere:        { name: 'Stachelbeere',      type: 'Obst',         latin: 'Ribes uva-crispa',     seedType: 'cutting' },
  brombeere:           { name: 'Brombeere',         type: 'Obst',         latin: 'Rubus fruticosus',     seedType: 'cutting' },
  aronia:              { name: 'Aronia',            type: 'Obst',         latin: 'Aronia melanocarpa',   seedType: 'cutting' },
  holunder:            { name: 'Holunder',          type: 'Obst',         latin: 'Sambucus nigra',       seedType: 'cutting' },
  weintraube:          { name: 'Weintraube',        type: 'Obst',         latin: 'Vitis vinifera',       seedType: 'cutting' },
  feigenbaum:          { name: 'Feige',             type: 'Obst',         latin: 'Ficus carica',         seedType: 'cutting' },
  physalis:            { name: 'Physalis',          type: 'Obst',         latin: 'Physalis peruviana',   seedType: 'oval' },
  melone:              { name: 'Zuckermelone',      type: 'Fruchtgemüse', latin: 'Cucumis melo',         seedType: 'flat' },
  'mini-wassermelone': { name: 'Mini-Wassermelone', type: 'Fruchtgemüse', latin: 'Citrullus lanatus',    seedType: 'flat' },

  porree:            { name: 'Porree',           type: 'Wurzel/Knolle', latin: 'Allium ampeloprosum',  seedType: 'dust' },
  chili:             { name: 'Chili',            type: 'Fruchtgemüse',  latin: 'Capsicum annuum',      seedType: 'dust' },
  minigurke:         { name: 'Mini-Snack-Gurke', type: 'Fruchtgemüse',  latin: 'Cucumis sativus',      seedType: 'flat' },
  fruehlingszwiebel: { name: 'Frühlingszwiebel', type: 'Wurzel/Knolle', latin: 'Allium fistulosum',    seedType: 'dust' },
  mais:              { name: 'Zuckermais',       type: 'Fruchtgemüse',  latin: 'Zea mays',             seedType: 'oval' },
  topinambur:        { name: 'Topinambur',       type: 'Wurzel/Knolle', latin: 'Helianthus tuberosus', seedType: 'tuber' },
  rhabarber:         { name: 'Rhabarber',        type: 'Blattgemüse',   latin: 'Rheum rhabarbarum',    seedType: 'tuber' },
  spargel:           { name: 'Spargel',          type: 'Blattgemüse',   latin: 'Asparagus officinalis',seedType: 'tuber' },
  linse:             { name: 'Linse',            type: 'Hülsenfrucht',  latin: 'Lens culinaris',       seedType: 'pea' },
  schwarzwurzel:     { name: 'Schwarzwurzel',    type: 'Wurzel/Knolle', latin: 'Scorzonera hispanica', seedType: 'dust' },
  meerrettich:       { name: 'Meerrettich',      type: 'Wurzel/Knolle', latin: 'Armoracia rusticana',  seedType: 'cutting' },

  tagetes:         { name: 'Tagetes',         type: 'Blume', latin: 'Tagetes patula',         seedType: 'dust' },
  kapuzinerkresse: { name: 'Kapuzinerkresse', type: 'Blume', latin: 'Tropaeolum majus',       seedType: 'pea' },
  lavendel:        { name: 'Lavendel',        type: 'Kraut', latin: 'Lavandula angustifolia', seedType: 'cutting' },
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
