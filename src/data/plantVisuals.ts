// Visual config for every plant: foliage colors, fruit colors, varieties, growth rendering.
// Separates the "what it looks like" from the yield/sowing data in yieldData.ts.

export interface PlantVariety {
  name: string;
  fruitColor: string;
  description: string;
}

export interface PlantVisual {
  plantId: string;
  // Foliage
  leafColor: string;        // main leaf/foliage color
  leafColorDark: string;    // darker accent for depth
  stemColor: string;
  // Fruit / harvest organ
  fruitColor: string;       // ripe color
  fruitUnripeColor: string; // unripe (usually green)
  fruitSizeCm: number;      // actual fruit diameter in cm (used for relative sizing)
  fruitShape: 'round' | 'elongated' | 'flat' | 'bulb' | 'cluster' | 'pod' | 'head';
  fruitCount: number;       // visible fruits per plant at peak
  fruitBelowGround: boolean;
  isLeafCrop: boolean;      // salat, spinat, kräuter  -  the leaf IS the harvest
  leafDarkensAtHarvest: boolean; // leaf crops mature/darken when ready
  // Named varieties with alternative colors
  varieties: PlantVariety[];
  // Wikipedia commons photo (already in WIKI_IMAGES for most)
  wikiPhotoId?: string;     // plantId key in WIKI_IMAGE_MAP
}

export const PLANT_VISUALS: PlantVisual[] = [
  // ── Fruchtgemüse ──────────────────────────────────────────────────────────
  {
    plantId: 'tomate',
    leafColor: '#2d7a2d', leafColorDark: '#1a4d1a', stemColor: '#4a7a2a',
    fruitColor: '#e02020', fruitUnripeColor: '#4a7a2a',
    fruitSizeCm: 6, fruitShape: 'round', fruitCount: 8, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Sungold', fruitColor: '#f5a020', description: 'Süße Cherry, orangegelb' },
      { name: 'Black Cherry', fruitColor: '#5a1a2a', description: 'Dunkelrot bis fast schwarz, sehr aromatisch' },
      { name: 'San Märzano', fruitColor: '#cc1010', description: 'Langliche Flaschentomaten, ideal für Sugo' },
      { name: 'Ochsenherz', fruitColor: '#d01818', description: 'Fleischtomate, sehr groß, kaum Kerne' },
      { name: 'Yellow Pear', fruitColor: '#f0d020', description: 'Gelbe Birnenform, süßlich' },
    ],
    wikiPhotoId: 'tomate',
  },
  {
    plantId: 'paprika',
    leafColor: '#2a6030', leafColorDark: '#1a4020', stemColor: '#3a5a25',
    fruitColor: '#e83030', fruitUnripeColor: '#2a6030',
    fruitSizeCm: 8, fruitShape: 'elongated', fruitCount: 5, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Rot (Standard)', fruitColor: '#e02020', description: 'Klassisch süßer Paprika' },
      { name: 'Gelb', fruitColor: '#f0d020', description: 'Mild und süß' },
      { name: 'Orange', fruitColor: '#e07820', description: 'Fruchtig-mild' },
      { name: 'Grün (unreif)', fruitColor: '#2a7a2a', description: 'Unreif geerntet, etwas bitter' },
      { name: 'Burgenland Spitz', fruitColor: '#c83020', description: 'Spitzpaprika typisch für Burgenland' },
      { name: 'Violett (Bio)', fruitColor: '#2a0a3a', description: 'Schwarz-violette Schale, reift später zu Rot - sehr dekorativ' },
    ],
    wikiPhotoId: 'paprika',
  },
  {
    plantId: 'melanzani',
    leafColor: '#2a5f3a', leafColorDark: '#1a3f28', stemColor: '#3a5030',
    fruitColor: '#4a0d6e', fruitUnripeColor: '#2a5f3a',
    fruitSizeCm: 14, fruitShape: 'elongated', fruitCount: 4, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Black Beauty', fruitColor: '#3a0a5e', description: 'Klassisch dunkelviolett' },
      { name: 'Violette Lange', fruitColor: '#5a1a8a', description: 'Lang und schlank' },
      { name: 'Weiße Ei', fruitColor: '#e8e8d0', description: 'Weiß, eiförmig  -  weniger bitter' },
      { name: 'Rosa Bianca', fruitColor: '#c090a0', description: 'Zart rosé-lila, cremiges Fruchtfleisch' },
    ],
    wikiPhotoId: 'melanzani',
  },
  {
    plantId: 'zucchini',
    leafColor: '#3a7a1a', leafColorDark: '#235010', stemColor: '#2a6010',
    fruitColor: '#5a8a1a', fruitUnripeColor: '#4a7a10',
    fruitSizeCm: 20, fruitShape: 'elongated', fruitCount: 3, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Grün (Standard)', fruitColor: '#4a7a1a', description: 'Klassisch grün mit hellen Streifen' },
      { name: 'Gelb', fruitColor: '#e8c030', description: 'Gelbe Zucchini, optisch ein Highlight' },
      { name: 'Rund', fruitColor: '#4a8a2a', description: 'Runde Zucchini, ideal zum Füllen' },
      { name: 'Striped', fruitColor: '#6a9a2a', description: 'Hellgrün mit Längsstreifen' },
    ],
    wikiPhotoId: 'zucchini',
  },
  {
    plantId: 'kuerbis',
    leafColor: '#3a6a1a', leafColorDark: '#264510', stemColor: '#2a5010',
    fruitColor: '#e07820', fruitUnripeColor: '#4a7a1a',
    fruitSizeCm: 30, fruitShape: 'round', fruitCount: 2, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Hokkaido', fruitColor: '#c85010', description: 'Kleiner Kürbis, orangerot, Schale essbar' },
      { name: 'Butternut', fruitColor: '#d4a060', description: 'Birnenform, beige, sehr lagerfähig' },
      { name: 'Muskat', fruitColor: '#c06820', description: 'Riesenkürbis, abgeflacht, sehr aromatisch' },
      { name: 'Gelb Zentner', fruitColor: '#e8c030', description: 'Leuchtend gelb, bis 20kg' },
    ],
    wikiPhotoId: 'kuerbis',
  },
  {
    plantId: 'mini-wassermelone',
    leafColor: '#3a7a2a', leafColorDark: '#235a18', stemColor: '#2a6018',
    fruitColor: '#1a4a1a', fruitUnripeColor: '#5a8a3a',
    fruitSizeCm: 18, fruitShape: 'round', fruitCount: 3, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Mini Love F1', fruitColor: '#1a4a1a', description: 'Kompakte Hybride aus AT, ca. 2 kg, dunkelgrün gestreift' },
      { name: 'Sugar Baby', fruitColor: '#243d1a', description: 'Klassische Mini, ~3 kg, sehr süß' },
      { name: 'Golden Midget', fruitColor: '#c8b830', description: 'Gelbe Schale bei Reife, sehr früh' },
    ],
  },
  {
    plantId: 'gurke',
    leafColor: '#2a7a2a', leafColorDark: '#1a5a1a', stemColor: '#2a6a1a',
    fruitColor: '#2a6a10', fruitUnripeColor: '#3a8a20',
    fruitSizeCm: 18, fruitShape: 'elongated', fruitCount: 4, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Einlegegurke', fruitColor: '#4a7a1a', description: 'Klein, warzig, ideal für Essiggurken' },
      { name: 'Salatgurke', fruitColor: '#2a6a10', description: 'Lang und glatt, Supermarkt-Typ' },
      { name: 'Schälgurke', fruitColor: '#5a8a1a', description: 'Mittelgroß, aromatisch' },
      { name: 'Schlangengurke', fruitColor: '#1a5a10', description: 'Sehr lang, wenig Kerne' },
    ],
    wikiPhotoId: 'gurke',
  },
  {
    plantId: 'kartoffel',
    leafColor: '#3a6a2a', leafColorDark: '#264520', stemColor: '#2a5020',
    fruitColor: '#c8a040', fruitUnripeColor: '#8a7030',
    fruitSizeCm: 8, fruitShape: 'round', fruitCount: 6, fruitBelowGround: true,
    isLeafCrop: false, leafDarkensAtHarvest: true,
    varieties: [
      { name: 'Annabelle (festk.)', fruitColor: '#e0c060', description: 'Frühkartoffel, sehr zu empfehlen für Anfänger' },
      { name: 'Sieglinde (festk.)', fruitColor: '#d4b050', description: 'Klassisch österreichisch, festkochend' },
      { name: 'Blaue (fest)', fruitColor: '#6a5a9a', description: 'Blaue Schale, violettes Inneres, Novelty' },
      { name: 'Rote (fest)', fruitColor: '#c04040', description: 'Rote Schale, optisch attraktiv' },
    ],
  },
  // ── Kopfgemüse & Blattgemüse ───────────────────────────────────────────────
  {
    plantId: 'kohl',
    leafColor: '#5a8a5a', leafColorDark: '#3a6a3a', stemColor: '#4a7040',
    fruitColor: '#6a9a6a', fruitUnripeColor: '#7aaa7a',
    fruitSizeCm: 25, fruitShape: 'head', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: true, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Weißkohl', fruitColor: '#d8e8d0', description: 'Für Sauerkraut, sehr lagerfähig' },
      { name: 'Rotkohl', fruitColor: '#7a2a6a', description: 'Rotviolett, für Blaukraut/Rotkraut' },
      { name: 'Wirsing', fruitColor: '#4a7a3a', description: 'Krause Blätter, mild' },
      { name: 'Spitzkohl', fruitColor: '#aad8a0', description: 'Zart, schnell reif' },
    ],
  },
  {
    plantId: 'salat',
    leafColor: '#8aca4a', leafColorDark: '#5a9a2a', stemColor: '#6aaa3a',
    fruitColor: '#9adc5a', fruitUnripeColor: '#b0f070',
    fruitSizeCm: 30, fruitShape: 'head', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: true, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Kopfsalat', fruitColor: '#9adc5a', description: 'Klassisch, mildes Aroma' },
      { name: 'Batavia', fruitColor: '#c8e870', description: 'Kraus, hitzeverträglich' },
      { name: 'Lollo Rosso', fruitColor: '#c04060', description: 'Rotbraune krause Blätter' },
      { name: 'Eichblatt', fruitColor: '#8a6030', description: 'Eichenblatt-Form, rot oder grün' },
      { name: 'Romana', fruitColor: '#7ab840', description: 'Länglich, knackig für Caesar Salad' },
    ],
    wikiPhotoId: 'salat',
  },
  {
    plantId: 'feldsalat',
    leafColor: '#3a7a3a', leafColorDark: '#2a5a2a', stemColor: '#3a6a3a',
    fruitColor: '#4a8a4a', fruitUnripeColor: '#5a9a5a',
    fruitSizeCm: 8, fruitShape: 'cluster', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: true, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Großsamiger (Standard)', fruitColor: '#4a8a4a', description: 'Ertragreich, mild' },
      { name: 'Eichblättrige', fruitColor: '#3a7a3a', description: 'Kompakte Rosetten' },
    ],
  },
  {
    plantId: 'spinat',
    leafColor: '#2a6a2a', leafColorDark: '#1a4a1a', stemColor: '#3a6030',
    fruitColor: '#3a7a3a', fruitUnripeColor: '#5a9a5a',
    fruitSizeCm: 20, fruitShape: 'head', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: true, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Matador', fruitColor: '#2a6a2a', description: 'Klassisch, gut für Frühling/Herbst' },
      { name: 'Tetona', fruitColor: '#3a7a3a', description: 'Hitzeverträglich, für Sommer' },
      { name: 'Winterriesen', fruitColor: '#1a5a1a', description: 'Für Glashaus ab Oktober' },
    ],
    wikiPhotoId: 'spinat',
  },
  {
    plantId: 'mangold',
    leafColor: '#3a9a3a', leafColorDark: '#2a7a2a', stemColor: '#e04040',
    fruitColor: '#3aaa3a', fruitUnripeColor: '#5aaa5a',
    fruitSizeCm: 40, fruitShape: 'head', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: true, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Grünstielig', fruitColor: '#3a9a3a', description: 'Klassischer Mangold' },
      { name: 'Rotstielig', fruitColor: '#4aaa3a', description: 'Roter Stiel, optisch auffällig' },
      { name: 'Gelb (Goldene)', fruitColor: '#4aaa3a', description: 'Gelber Stiel, mild' },
      { name: 'Rainbow', fruitColor: '#4aaa3a', description: 'Mix aus roten, gelben, weißen Stielen' },
    ],
    wikiPhotoId: 'mangold',
  },
  {
    plantId: 'rucola',
    leafColor: '#4a8a2a', leafColorDark: '#2a6a1a', stemColor: '#3a7020',
    fruitColor: '#5a9a3a', fruitUnripeColor: '#6aaa4a',
    fruitSizeCm: 15, fruitShape: 'cluster', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: true, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Kulturrucola', fruitColor: '#5a9a3a', description: 'Milder, breitblättrig' },
      { name: 'Wilde Rauke', fruitColor: '#3a7a2a', description: 'Scharf, schmaler, aromatischer' },
    ],
  },
  // ── Wurzelgemüse ────────────────────────────────────────────────────────────
  {
    plantId: 'karotte',
    leafColor: '#2a8a2a', leafColorDark: '#1a6010', stemColor: '#3a7a1a',
    fruitColor: '#e07820', fruitUnripeColor: '#c05a10',
    fruitSizeCm: 3, fruitShape: 'elongated', fruitCount: 1, fruitBelowGround: true,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Nantes (Orange)', fruitColor: '#e07820', description: 'Klassisch orange, süß und saftig' },
      { name: 'Purple Haze', fruitColor: '#6a2a8a', description: 'Außen lila, innen orange  -  optisch spektakulär' },
      { name: 'Yellowstone', fruitColor: '#e8c840', description: 'Gelb, mild und süß' },
      { name: 'White Satin', fruitColor: '#e8e0c0', description: 'Weiß, zartes Aroma' },
      { name: 'Rote Riesen', fruitColor: '#c83020', description: 'Rot, leicht süßlich' },
    ],
    wikiPhotoId: 'karotte',
  },
  {
    plantId: 'rote-bete',
    leafColor: '#4a3a3a', leafColorDark: '#3a2a2a', stemColor: '#8a2a3a',
    fruitColor: '#9a1a3a', fruitUnripeColor: '#7a2040',
    fruitSizeCm: 7, fruitShape: 'round', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Rote Kugel', fruitColor: '#9a1a3a', description: 'Klassisch tiefrot' },
      { name: 'Chioggia', fruitColor: '#d05050', description: 'Rot-weiß geringelt im Querschnitt' },
      { name: 'Golden', fruitColor: '#e8c040', description: 'Goldgelb, süßer als rote Sorten' },
    ],
    wikiPhotoId: 'rote-bete',
  },
  {
    plantId: 'pastinake',
    leafColor: '#4a7a2a', leafColorDark: '#2a5a1a', stemColor: '#5a8020',
    fruitColor: '#e0d080', fruitUnripeColor: '#c0b060',
    fruitSizeCm: 5, fruitShape: 'elongated', fruitCount: 1, fruitBelowGround: true,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Tender & True', fruitColor: '#e0d080', description: 'Lange glatte Wurzel, süßlich' },
      { name: 'Hollow Crown', fruitColor: '#d4c870', description: 'Traditionelle Sorte' },
    ],
  },
  {
    plantId: 'sellerie',
    leafColor: '#4a9a2a', leafColorDark: '#2a7a1a', stemColor: '#5a8a30',
    fruitColor: '#d0c870', fruitUnripeColor: '#a09a50',
    fruitSizeCm: 12, fruitShape: 'round', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Monarch (Knolle)', fruitColor: '#d0c870', description: 'Große weiße Knolle' },
      { name: 'Prinz (Stangen)', fruitColor: '#8abd5a', description: 'Stangensellerie, grün' },
    ],
    wikiPhotoId: 'sellerie',
  },
  {
    plantId: 'fenchel',
    leafColor: '#5a9a3a', leafColorDark: '#3a7a2a', stemColor: '#6aaa40',
    fruitColor: '#c8e0a0', fruitUnripeColor: '#9aba7a',
    fruitSizeCm: 10, fruitShape: 'bulb', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Zefa Fino', fruitColor: '#c8e0a0', description: 'Frühreif, weit verbreitet' },
      { name: 'Selma', fruitColor: '#b8d090', description: 'Hitzeverträglich' },
    ],
    wikiPhotoId: 'fenchel',
  },
  // ── Zwiebeln & Lauch ───────────────────────────────────────────────────────
  {
    plantId: 'zwiebel',
    leafColor: '#5a8a2a', leafColorDark: '#3a6a1a', stemColor: '#4a7820',
    fruitColor: '#c85020', fruitUnripeColor: '#a04020',
    fruitSizeCm: 8, fruitShape: 'round', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Stuttgarter Riesen (gelb)', fruitColor: '#c07830', description: 'Klassisch gelbbraun, lagerfähig' },
      { name: 'Rote Zittauer', fruitColor: '#9a2020', description: 'Rotbraun, Österreich-Klassiker' },
      { name: 'Weiße Silber', fruitColor: '#e8e0c0', description: 'Weiß, mild, für frischen Verzehr' },
      { name: 'Frühlingszwiebel', fruitColor: '#6aaa2a', description: 'Frisch essen, kein Lagern' },
    ],
    wikiPhotoId: 'zwiebel',
  },
  {
    plantId: 'knoblauch',
    leafColor: '#5a8a2a', leafColorDark: '#3a6a1a', stemColor: '#5a8020',
    fruitColor: '#e8e0c0', fruitUnripeColor: '#c0c0a0',
    fruitSizeCm: 5, fruitShape: 'bulb', fruitCount: 1, fruitBelowGround: true,
    isLeafCrop: false, leafDarkensAtHarvest: true,
    varieties: [
      { name: 'Rocambole', fruitColor: '#d8c8a0', description: 'Würzig, lila Schuppenrand' },
      { name: 'Silverskin', fruitColor: '#e8e8d8', description: 'Weich-nektig, sehr lagerfähig' },
      { name: 'Lila Wight', fruitColor: '#c8a8c8', description: 'Violette Schale, fein-würzig' },
    ],
    wikiPhotoId: 'knoblauch',
  },
  // ── Hülsenfrüchte ──────────────────────────────────────────────────────────
  {
    plantId: 'bohne',
    leafColor: '#3a7a2a', leafColorDark: '#2a5a1a', stemColor: '#4a8030',
    fruitColor: '#4a7a2a', fruitUnripeColor: '#3a6a1a',
    fruitSizeCm: 12, fruitShape: 'pod', fruitCount: 8, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Buschbohne (Grün)', fruitColor: '#4a7a2a', description: 'Keine Rankhilfe, Anfänger-Ideal' },
      { name: 'Stangenbohne', fruitColor: '#3a6a2a', description: 'Klettert, viel Ertrag' },
      { name: 'Gelbe Wachsbohne', fruitColor: '#e0c030', description: 'Gelb, optisch schön' },
      { name: 'Violette', fruitColor: '#6a2a7a', description: 'Lila, wird beim Kochen grün' },
      { name: 'Käferbohne', fruitColor: '#7a2a1a', description: 'Steirisch! Trockenbohne, Eiweißreich' },
    ],
    wikiPhotoId: 'bohne',
  },
  {
    plantId: 'erbse',
    leafColor: '#5a9a2a', leafColorDark: '#3a7a1a', stemColor: '#6aaa30',
    fruitColor: '#6aaa2a', fruitUnripeColor: '#5a9a2a',
    fruitSizeCm: 8, fruitShape: 'pod', fruitCount: 6, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Markerbse', fruitColor: '#6aaa2a', description: 'Nur Kerne essen, süß' },
      { name: 'Zuckererbse', fruitColor: '#7aba3a', description: 'Schote mitessen! Kein Auspuhlen' },
      { name: 'Knackerbse', fruitColor: '#5a9a2a', description: 'Dicke Schote, knackig roh' },
    ],
    wikiPhotoId: 'erbse',
  },
  // ── Schnellgemüse ───────────────────────────────────────────────────────────
  {
    plantId: 'radieschen',
    leafColor: '#2a6a2a', leafColorDark: '#1a4a1a', stemColor: '#3a6a20',
    fruitColor: '#e02040', fruitUnripeColor: '#c01a30',
    fruitSizeCm: 3, fruitShape: 'round', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Rot (Standard)', fruitColor: '#e02040', description: 'Scharf und knackig' },
      { name: 'Weißer Eiszapfen', fruitColor: '#e8e8e0', description: 'Lang und weiß, mild' },
      { name: 'Viola (Lila)', fruitColor: '#7a2a9a', description: 'Violett, optisch attraktiv' },
      { name: 'Weiß mit rosa', fruitColor: '#f0a0c0', description: 'Rosa Hauch, sehr mild' },
    ],
    wikiPhotoId: 'radieschen',
  },
  {
    plantId: 'kohlrabi',
    leafColor: '#5a8a4a', leafColorDark: '#3a6a30', stemColor: '#4a7838',
    fruitColor: '#8aaa4a', fruitUnripeColor: '#7a9a40',
    fruitSizeCm: 10, fruitShape: 'bulb', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Grün (Delikatess)', fruitColor: '#8aaa4a', description: 'Hellgrün, klassisch' },
      { name: 'Blau / Violett', fruitColor: '#6a4a9a', description: 'Lila Schale, innen weiß, süßer' },
      { name: 'Superschmelz', fruitColor: '#7a9a3a', description: 'Riesig ohne holzig zu werden' },
    ],
    wikiPhotoId: 'kohlrabi',
  },
  // ── Obst & Beeren ─────────────────────────────────────────────────────────
  {
    plantId: 'erdbeere',
    leafColor: '#3a7a2a', leafColorDark: '#2a5a1a', stemColor: '#4a6a20',
    fruitColor: '#e02030', fruitUnripeColor: '#e8e8c0',
    fruitSizeCm: 3, fruitShape: 'round', fruitCount: 6, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Elsanta', fruitColor: '#e02030', description: 'Klassisch, gut lagerfähig' },
      { name: 'Mara des Bois', fruitColor: '#c81a28', description: 'Waldaroma, sehr aromatisch' },
      { name: 'Mieze Schindler', fruitColor: '#b82030', description: 'Alte Sorte, intensives Aroma' },
      { name: 'Rügen (Monatserdbeere)', fruitColor: '#d83040', description: 'Klein, durchgehend erntend' },
    ],
    wikiPhotoId: 'erdbeere',
  },
  {
    plantId: 'himbeere',
    leafColor: '#3a6a2a', leafColorDark: '#2a4a1a', stemColor: '#4a5a28',
    fruitColor: '#c82060', fruitUnripeColor: '#e8c8d0',
    fruitSizeCm: 1.5, fruitShape: 'cluster', fruitCount: 12, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Rot (Rubus idaeus)', fruitColor: '#c82060', description: 'Klassisch rote Himbeere' },
      { name: 'Gelb (Golden)', fruitColor: '#e8c040', description: 'Gelb, sehr süß' },
      { name: 'Schwarz (Loganberry)', fruitColor: '#3a0a2a', description: 'Dunkel, leicht säuerlich' },
    ],
  },
  {
    plantId: 'ribisel',
    leafColor: '#3a7a2a', leafColorDark: '#2a5a1a', stemColor: '#4a6a28',
    fruitColor: '#9a1a1a', fruitUnripeColor: '#e0c8c8',
    fruitSizeCm: 1, fruitShape: 'cluster', fruitCount: 15, fruitBelowGround: false,
    isLeafCrop: false, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Rote Ribisel', fruitColor: '#c02020', description: 'Sauer, ideal für Marmelade/Saft' },
      { name: 'Schwarze Ribisel', fruitColor: '#2a0a1a', description: 'Viel Vitamin C, starkes Aroma' },
      { name: 'Weiße Ribisel', fruitColor: '#e8e0c0', description: 'Mild und süßer als rote' },
    ],
  },
  // ── Kräuter ────────────────────────────────────────────────────────────────
  {
    plantId: 'basilikum',
    leafColor: '#3a8a2a', leafColorDark: '#2a6a1a', stemColor: '#4a7828',
    fruitColor: '#4a9a3a', fruitUnripeColor: '#3a8a2a',
    fruitSizeCm: 25, fruitShape: 'cluster', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: true, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Großes Genoveser', fruitColor: '#3a8a2a', description: 'Klassisch für Pesto, große Blätter' },
      { name: 'Lila Basilikum', fruitColor: '#5a2a6a', description: 'Violette Blätter, dekorativ' },
      { name: 'Thai Basilikum', fruitColor: '#4a9a3a', description: 'Anisartiges Aroma, für asiatische Küche' },
      { name: 'Zitronenbasilikum', fruitColor: '#7ab83a', description: 'Zitrusaroma, klein und buschig' },
    ],
    wikiPhotoId: 'basilikum',
  },
  {
    plantId: 'petersilie',
    leafColor: '#2a7a2a', leafColorDark: '#1a5a1a', stemColor: '#3a6a20',
    fruitColor: '#3a8a3a', fruitUnripeColor: '#3a8a3a',
    fruitSizeCm: 20, fruitShape: 'cluster', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: true, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Glattblättrig', fruitColor: '#2a7a2a', description: 'Intensiveres Aroma, für Kochen' },
      { name: 'Kraus', fruitColor: '#3a8a3a', description: 'Dekorativ, milder' },
      { name: 'Hamburger Schnitt', fruitColor: '#2a8a2a', description: 'Ertragreich, mehrschnittfähig' },
    ],
  },
  {
    plantId: 'schnittlauch',
    leafColor: '#4a9a4a', leafColorDark: '#2a7a2a', stemColor: '#5a9030',
    fruitColor: '#5aaa5a', fruitUnripeColor: '#5aaa5a',
    fruitSizeCm: 20, fruitShape: 'cluster', fruitCount: 1, fruitBelowGround: false,
    isLeafCrop: true, leafDarkensAtHarvest: false,
    varieties: [
      { name: 'Allium schoenoprasum', fruitColor: '#4a9a4a', description: 'Ausdauernd, immer wieder nachwachsend' },
      { name: 'Chinesischer Schnittlauch', fruitColor: '#5ab050', description: 'Flachblättrig, knoblauchähnlich' },
    ],
  },
];

export const PLANT_VISUAL_MAP = new Map(PLANT_VISUALS.map(v => [v.plantId, v]));

// ── Growth stage calculation ───────────────────────────────────────────────
// Returns normalized values 0-1 for driving all visual parameters.
export interface PlantStage {
  phase: 'dormant' | 'indoor' | 'growing' | 'harvest' | 'past';
  plantFraction: number;    // 0 = nothing, 1 = full size
  fruitFraction: number;    // 0 = no fruit, 1 = full fruit load
  ripenessFraction: number; // 0 = unripe green, 1 = fully ripe color
}

export function getPlantStage(
  sowIndoorMonth: number | undefined,
  sowOutdoorMonth: number,
  harvestStartMonth: number,
  harvestEndMonth: number,
  cursorMonth: number  // 0-indexed
): PlantStage {
  const m = cursorMonth + 1; // convert to 1-indexed

  // Before sowing
  const sowStart = sowIndoorMonth ?? sowOutdoorMonth;
  if (m < sowStart) return { phase: 'dormant', plantFraction: 0, fruitFraction: 0, ripenessFraction: 0 };

  // Indoor seedling phase
  if (sowIndoorMonth && m >= sowIndoorMonth && m < sowOutdoorMonth) {
    const indoorMonths = Math.max(1, sowOutdoorMonth - sowIndoorMonth);
    const elapsed = m - sowIndoorMonth;
    return {
      phase: 'indoor',
      plantFraction: 0.08 + (elapsed / indoorMonths) * 0.12,
      fruitFraction: 0,
      ripenessFraction: 0,
    };
  }

  // Outdoor growth phase (no fruit yet)
  if (m >= sowOutdoorMonth && m < harvestStartMonth) {
    const growMonths = Math.max(1, harvestStartMonth - sowOutdoorMonth);
    const elapsed = m - sowOutdoorMonth;
    const t = elapsed / growMonths;
    return {
      phase: 'growing',
      plantFraction: 0.2 + t * 0.8,
      fruitFraction: t > 0.8 ? (t - 0.8) * 3 : 0, // fruit buds appear last 20% of growth
      ripenessFraction: 0,
    };
  }

  // Harvest phase
  if (m >= harvestStartMonth && m <= harvestEndMonth) {
    const harvestMonths = Math.max(1, harvestEndMonth - harvestStartMonth);
    const elapsed = m - harvestStartMonth;
    const ripenessFraction = harvestMonths > 0 ? Math.min(1, elapsed / harvestMonths) : 1;
    return {
      phase: 'harvest',
      plantFraction: 1.0,
      fruitFraction: 1.0,
      ripenessFraction,
    };
  }

  // After harvest — plant declining smoothly over ~6 weeks, then gone
  const weeksAfter = (m - harvestEndMonth) * 4.33;
  const declineFraction = Math.max(0, 1 - weeksAfter / 6);
  if (declineFraction <= 0) return { phase: 'dormant', plantFraction: 0, fruitFraction: 0, ripenessFraction: 0 };
  return { phase: 'past', plantFraction: declineFraction, fruitFraction: declineFraction * 0.25, ripenessFraction: 1 };
}

// Interpolate between two hex colors
export function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bv = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bv.toString(16).padStart(2, '0')}`;
}
