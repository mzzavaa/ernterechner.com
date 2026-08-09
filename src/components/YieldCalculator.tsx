import { useState } from 'react';
import { YIELD_DATA, type YieldEntry, getRipeningTimeline } from '../data/yieldData';
import { WIKI_PLANTS } from '../data/wiki';
import { WIKI_PLANTS_EN } from '../data/en/plants';
import BedVisualizer from './BedVisualizer';
import { PlantIcon, resolveIconKey } from '../icons/plant-icons/PlantIcon.tsx';
import { useFormat, type Format } from '../units';
import { wikiPlantUrl } from '../links';
import { useT, useLang, type Lang } from '../i18n';

const WIKI_MAP = new Map(WIKI_PLANTS.map(p => [p.id, p]));
const WIKI_MAP_EN = new Map(WIKI_PLANTS_EN.map(p => [p.id, p]));

// English names for the few calculator-only crops the wiki doesn't cover.
const EXTRA_NAME_EN: Record<string, string> = {
  'kresse': 'Garden cress',
  'mini-snack-gurke': 'Mini snack cucumber',
  'pak-choi': 'Pak choi',
  'mairuebchen': 'May turnip',
  'fruehlingszwiebel': 'Spring onion',
};

type TFn = (de: string, en?: string) => string;

// Localised display name for a plant: English wiki name when EN is active,
// German (the yieldData name) otherwise. German output stays identical.
const plantName = (plantId: string, deName: string, lang: Lang) =>
  lang === 'en' ? (WIKI_MAP_EN.get(plantId)?.name ?? EXTRA_NAME_EN[plantId] ?? deName) : deName;

// Hook variant for components.
function usePlantName() {
  const { lang } = useLang();
  return (e: { plantId: string; name: string }) => plantName(e.plantId, e.name, lang);
}

// ── DRY German→English lookups for data strings shown in the UI ──────────────
// German (the raw data string) is always shown as-is; English only replaces it
// when a mapping exists, otherwise it falls back to the original German.
const dt = (map: Record<string, string>, v: string, lang: Lang) =>
  lang === 'en' ? (map[v] ?? v) : v;

const STORAGE_METHOD_EN: Record<string, string> = {
  'Dunkel, 4-8°C, in Jutesäcken': 'Dark, 4–8 °C, in jute sacks',
  'Frisch 1 Tag, einfrieren, Marmelade': 'Fresh 1 day, freeze, jam',
  'Frisch 1 Woche im Kühlschrank': 'Fresh 1 week in the fridge',
  'Frisch 1 Woche im Kühlschrank, einfrieren (Suppen-Würfel), im Beet frosthart': 'Fresh 1 week in the fridge, freeze (soup cubes), frost-hardy in the bed',
  'Frisch 1 Woche im Kühlschrank, in Wasserglas am Fenster nachwachsen lassen': 'Fresh 1 week in the fridge, regrow in a glass of water on the windowsill',
  'Frisch 1 Woche, einfrieren (blanchiert), im Beet frosthart bis −15 °C': 'Fresh 1 week, freeze (blanched), frost-hardy in the bed down to −15 °C',
  'Frisch 1 Woche, einfrieren (gegrillt)': 'Fresh 1 week, freeze (grilled)',
  'Frisch 1 Woche, einfrieren, einlegen': 'Fresh 1 week, freeze, pickle',
  'Frisch 1 Woche, rösten+einfrieren, einkochen (Letscho)': 'Fresh 1 week, roast + freeze, preserve (lecsó)',
  'Frisch 1 Woche, trocknen (Aroma bleibt!), in Öl einlegen': 'Fresh 1 week, dry (aroma stays!), preserve in oil',
  'Frisch 1 Woche, trocknen (Aroma intensiver!), in Öl': 'Fresh 1 week, dry (aroma more intense!), in oil',
  'Frisch 1 Woche, trocknen, in Essig einlegen, einfrieren': 'Fresh 1 week, dry, pickle in vinegar, freeze',
  'Frisch 2 Tage (Winterernte direkt aus Beet/Glashaus)': 'Fresh 2 days (winter harvest straight from bed/greenhouse)',
  'Frisch 2 Tage - sofort verzehren': 'Fresh 2 days - eat at once',
  'Frisch 2 Tage': 'Fresh 2 days',
  'Frisch 2 Tage, einfrieren (blanchiert)': 'Fresh 2 days, freeze (blanched)',
  'Frisch 2 Tage, einfrieren, Marmelade': 'Fresh 2 days, freeze, jam',
  'Frisch 2 Tage, einfrieren, oder trocknen (Trockenerbsen)': 'Fresh 2 days, freeze, or dry (dried peas)',
  'Frisch 2 Wochen Kühlschrank, in Sand 0-2 °C bis ~2 Mon., Blattgrün getrennt verwerten': 'Fresh 2 weeks in the fridge, in sand at 0–2 °C for ~2 months, use the leafy greens separately',
  'Frisch 2 Wochen ganz / 3 Tage angeschnitten, einfrieren in Würfeln': 'Fresh 2 weeks whole / 3 days cut, freeze in cubes',
  'Frisch 2 Wochen im Kühlschrank': 'Fresh 2 weeks in the fridge',
  'Frisch 2 Wochen, einfrieren (ganz), trocknen (Schnur), einlegen in Öl': 'Fresh 2 weeks, freeze (whole), dry (on a string), preserve in oil',
  'Frisch 2 Wochen, trocknen, in Öl/Essig einlegen': 'Fresh 2 weeks, dry, preserve in oil/vinegar',
  'Frisch 3 Tage': 'Fresh 3 days',
  'Frisch 3 Tage, Pesto einfrieren, Kräuterwürfel': 'Fresh 3 days, freeze pesto, herb cubes',
  'Frisch 3 Tage, einfrieren (Kräuterwürfel), trocknen für Samen': 'Fresh 3 days, freeze (herb cubes), dry for seeds',
  'Frisch 3 Tage, einfrieren (blanchiert) oder trocknen': 'Fresh 3 days, freeze (blanched) or dry',
  'Frisch 3 Tage, einfrieren (blanchiert)': 'Fresh 3 days, freeze (blanched)',
  'Frisch 3 Tage, einfrieren, Saft, Gelee': 'Fresh 3 days, freeze, juice, jelly',
  'Frisch 3 Tage, einfrieren, trocknen für Samen (Gewürz)': 'Fresh 3 days, freeze, dry for seeds (spice)',
  'Frisch 3 Tage, einkochen (Marmelade), trocknen, einlegen': 'Fresh 3 days, preserve (jam), dry, pickle',
  'Frisch 5 Tage - am besten täglich naschen': 'Fresh 5 days - best nibbled daily',
  'Frisch 5 Tage im Kühlschrank, einfrieren (blanchiert), Kimchi': 'Fresh 5 days in the fridge, freeze (blanched), kimchi',
  'Frisch 5 Tage, einfrieren (Kräuterwürfel)': 'Fresh 5 days, freeze (herb cubes)',
  'Frisch 5 Tage, einfrieren, trocknen': 'Fresh 5 days, freeze, dry',
  'Frisch 5 Tage, einlegen (Salzgurken, Essiggurken)': 'Fresh 5 days, pickle (salt & vinegar gherkins)',
  'Frisch 5 Tage, einlegen (wie Cornichons)': 'Fresh 5 days, pickle (like cornichons)',
  'Frisch 5 Tage, sonst einkochen/einfrieren': 'Fresh 5 days, otherwise preserve/freeze',
  'Im Beet lassen (frosthart) oder in Sand': 'Leave in the bed (frost-hardy) or in sand',
  'In Sand, 0-2°C': 'In sand, 0–2 °C',
  'In feuchtem Sand, 0-2°C': 'In moist sand, 0–2 °C',
  'Keller 0-2°C oder als Sauerkraut 12 Monate': 'Cellar 0–2 °C or as sauerkraut for 12 months',
  'Trocken, 10-15°C (Butternut bis 12 Monate)': 'Dry, 10–15 °C (Butternut up to 12 months)',
  'Trocken, luftig, 5-15°C, in Netzen/Zöpfen': 'Dry, airy, 5–15 °C, in nets/plaits',
  'Trocken, luftig, geflochten/gebündelt': 'Dry, airy, plaited/bundled',
};

const GROWTH_FORM_EN: Record<string, string> = {
  upright: 'upright', bushy: 'bushy', spreading: 'spreading',
  climbing: 'climbing', rosette: 'rosette', root: 'root',
};

const COLOR_STAGE_LABEL_EN: Record<string, string> = {
  'Anlage (grün)': 'Forming (green)',
  'Anlage (grün, hart)': 'Forming (green, hard)',
  'Anlage (grün-violett)': 'Forming (green-violet)',
  'Anlage (grüne Kugel)': 'Forming (green ball)',
  'Anlage (helles Stachelgrün)': 'Forming (pale prickly green)',
  'Anlage (hellgrün, Tennisball)': 'Forming (light green, tennis-ball)',
  'Anlage (hellgrün, klein)': 'Forming (light green, small)',
  'Anlage (klein, weißlich)': 'Forming (small, whitish)',
  'Anlage (rosa)': 'Forming (pink)',
  'Anlage (weißlich-rosa)': 'Forming (whitish-pink)',
  'Babyleaf (klein)': 'Baby leaf (small)',
  'Babymöhre (orange, fingerdick)': 'Baby carrot (orange, finger-thick)',
  'Blüte (weiß)': 'Flower (white)',
  'Erntegröße (15-20 cm)': 'Harvest size (15–20 cm)',
  'Erntegröße (Finger-dick)': 'Harvest size (finger-thick)',
  'Erntegröße (Tennisball)': 'Harvest size (tennis-ball)',
  'Erntegröße (Tischtennisball, weiß-violett oben)': 'Harvest size (table-tennis ball, white-violet on top)',
  'Erntegröße (mittelgrün)': 'Harvest size (medium green)',
  'Gelb (überreif)': 'Yellow (overripe)',
  'Glänzend violett (Ernte!)': 'Glossy violet (harvest!)',
  'Holzig (überreif)': 'Woody (overripe)',
  'Junge Blätter (hellgrün)': 'Young leaves (light green)',
  'Knolle (knackig-rot)': 'Bulb (crisp red)',
  'Knollig (golfballgroß)': 'Bulbous (golf-ball size)',
  'Laub abgestorben': 'Foliage died back',
  'Laub blüht (Knollen klein)': 'Foliage flowering (tubers small)',
  'Laub welkt': 'Foliage wilting',
  'Lauch dünn (Bleistift)': 'Leek thin (pencil)',
  'Matt (überreif)': 'Matt (overripe)',
  'Mit Knöllchen': 'With nodules',
  'Nach Frost (süß!)': 'After frost (sweet!)',
  'Pelzig (überreif)': 'Furry (overripe)',
  'Reif-Anfang (hellgrün/weißlich)': 'Early ripening (light green/whitish)',
  'Riesenkürbis (überreif)': 'Giant marrow (overripe)',
  'Rosette klein (Cut-and-Come-Again)': 'Small rosette (cut-and-come-again)',
  'Schosst (bitter)': 'Bolting (bitter)',
  'Stiel-Anlage': 'Stalk forming',
  'Streifig (dunkelgrün)': 'Striped (dark green)',
  'Umschlag (gelb-orange)': 'Turning (yellow-orange)',
  'Umschlag (gelbgrün)': 'Turning (yellow-green)',
  'Umschlag (weiß-rosa)': 'Turning (white-pink)',
  'Umschlag gelborange': 'Turning yellow-orange',
  'Umschlag': 'Turning',
  'Vollblättrig (sattgrün/violett)': 'Full foliage (deep green/violet)',
  'Voller Kopf': 'Full head',
  'Vollreif (dumpfer Klopfton)': 'Fully ripe (dull knock)',
  'Vollreif (orangerot, harter Stiel)': 'Fully ripe (orange-red, hard stalk)',
  'Vollreif (rot/orange)': 'Fully ripe (red/orange)',
  'Vollreif (sattrot)': 'Fully ripe (rich red)',
  'Vollreif (tieforange)': 'Fully ripe (deep orange)',
  'Vollreif (tiefrot)': 'Fully ripe (deep red)',
  'Vollreif (tiefrot, faustgroß)': 'Fully ripe (deep red, fist-sized)',
  'Vollreif (violettbraun, weich)': 'Fully ripe (violet-brown, soft)',
  'Vollreif rot': 'Fully ripe red',
  'Wechselphase': 'Transition phase',
  'Wurzel-Anlage (weißlich, dünn)': 'Root forming (whitish, thin)',
};

const COLOR_STAGE_DESC_EN: Record<string, string> = {
  'Ab 10 cm zart als Babyleaf': 'From 10 cm tender as baby leaf',
  'Ab 10 cm äußere Blätter zupfen': 'From 10 cm pick the outer leaves',
  'Ab Golfball-Größe schon verwendbar': 'Usable from golf-ball size',
  'Bei Hitze + Langtag schießt schnell': 'Bolts quickly in heat + long days',
  'Bildet kleine Zwiebel = Übergang zur Zwiebel': 'Forms a small bulb = transition to onion',
  'Bleistift-dick = bereits verwendbar': 'Pencil-thick = already usable',
  'Erste gelbe/orangene Stellen': 'First yellow/orange patches',
  'Fingerdicke - ideal als Babymöhre': 'Finger-thick - ideal as a baby carrot',
  'Frucht steckig, voll grün, noch im Wachstum': 'Fruit set, fully green, still growing',
  'Frühkartoffel: jetzt erste Probegrabung möglich': 'Early potato: first test dig now possible',
  'Gelb = nur noch für Samen verwendbar': 'Yellow = only usable for seed now',
  'Größer = holzig + faserig': 'Bigger = woody + fibrous',
  'Hängt herab, Tropfen am Boden, Honigtropfen sichtbar': 'Hangs down, drips at the base, honey drops visible',
  'Jetzt täglich ernten - sonst Riese': 'Harvest daily now - otherwise a giant',
  'Klassischer Farbumschlag - aroma startet': 'Classic colour change - aroma begins',
  'Laub gelb/braun = Knollenhaut härtet': 'Foliage yellow/brown = tuber skin hardening',
  'Matte Schale = bitter, kernig': 'Matt skin = bitter, seedy',
  'Murmelgröße - jetzt knackig': 'Marble size - crisp now',
  'Nach erstem Frost süßer + bekömmlicher': 'Sweeter + more digestible after the first frost',
  'Schale leicht aufgehellt - innen beginnt Reife': 'Skin slightly lightened - ripening begins inside',
  'Schale spiegelt - JETZT ernten': 'Skin is glossy - harvest NOW',
  'Schlangengurke 25 cm, Snack 8-10 cm': 'Snake cucumber 25 cm, snack 8–10 cm',
  'Schärfe nimmt erst mit Farbe richtig zu': 'Heat only really builds as the colour develops',
  'Stiel beginnt einzutrocknen, Klopftest: dumpfer Ton': 'Stalk starts to dry, knock test: dull sound',
  'Stiel schießt hoch = bitter, sofort raus': 'Stalk shoots up = bitter, pull at once',
  'Stiel verholzt, Fingernagel-Test: keine Delle': 'Stalk woody, fingernail test: no dent',
  'Süß + Aroma intensiv - täglich pflücken': 'Sweet + intense aroma - pick daily',
  'Süß und voll aromatisch - klassisch Letscho-reif': 'Sweet and fully aromatic - classic lecsó-ripe',
  'Tennisball-groß = jetzt zart': 'Tennis-ball size = tender now',
  'Tischtennisball-groß - zart, mild': 'Table-tennis-ball size - tender, mild',
  'Voll erntereif, lagerfähig': 'Fully ripe, storable',
  'Voll grün, knackig - schon essbar aber bitter': 'Fully green, crisp - already edible but bitter',
  'Voll scharf + voll aromatisch': 'Fully hot + fully aromatic',
  'Voll süß, pflückreif - leicht vom Stiel lösbar': 'Fully sweet, ready to pick - comes easily off the stalk',
  'Voller Kopf - ganz schneiden': 'Full head - cut whole',
  'Weiße Stiele knackig, Blattgrün sattgrün': 'White stalks crisp, leaves deep green',
  'Zu groß = holzig + faserig': 'Too big = woody + fibrous',
  'Zu groß = pelzig + holzig + scharf': 'Too big = furry + woody + hot',
  'Äußere Blätter laufend ernten - innere wachsen nach': 'Harvest outer leaves continuously - inner ones grow back',
};

const FRUIT_NOTE_EN: Record<string, string> = {
  'Burgenland Spitzpaprika eher länglich (15 cm)': 'Burgenland pointed pepper rather elongated (15 cm)',
  'Elsanta; Mara des Bois kleiner aber aromatischer': 'Elsanta; Mara des Bois smaller but more aromatic',
  'Ernte wenn Schale glänzt - sonst bitter': 'Harvest when the skin is glossy - otherwise bitter',
  'Erntegröße - größer wird mehlig': 'Harvest size - bigger turns mealy',
  'Erntegröße ~5 cm; größer wird holzig': 'Harvest size ~5 cm; bigger turns woody',
  'Hokkaido ~2 kg; Muskat bis 10 kg': 'Hokkaido ~2 kg; Muscat up to 10 kg',
  'Mini Love F1: ~2 kg': 'Mini Love F1: ~2 kg',
  'Nantes-Typ; Pariser kurz/rund, Riesen bis 25 cm': 'Nantes type; Paris short/round, giants up to 25 cm',
  'Pfefferoni; Habanero rund, 3 cm': 'Chilli pepper; Habanero round, 3 cm',
  'Pflück: nicht ganz ernten, äußere Blätter': 'Cut-and-come-again: do not harvest whole, take the outer leaves',
  'Pro Blatt; pro Pflanze gesamt ~1,2 kg über Saison': 'Per leaf; per plant ~1.2 kg total over the season',
  'Pro Pflanze 8-12 Knollen': 'Per plant 8–12 tubers',
  'Schlangengurke; Snack-Gurke 8-10 cm / 60 g': 'Snake cucumber; snack cucumber 8–10 cm / 60 g',
  'Schnelle Kultur - mehrfach pro Saison nachsäen': 'Fast crop - sow again several times per season',
  'Standard-Sorte; Cherry ~20g, Fleisch bis 400g': 'Standard variety; cherry ~20 g, beefsteak up to 400 g',
  'Superschmelz-Sorten ohne Verholzung bis 25 cm': 'Superschmelz varieties without woodiness up to 25 cm',
};

const MO_DE = ['Jän','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
const MOLONG_DE = ['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const MO_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MOLONG_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const moRange = (mo: string[], s: number, e: number) => Array.from({length: e - s + 1}, (_,i) => mo[s+i-1]).join('–');

function openPrintPlan(items: CalcState[], persons: number, gardenArea: number | null, fmt: Format, t: TFn, lang: Lang) {
  const pn = (e: YieldEntry) => plantName(e.plantId, e.name, lang);
  const mo = lang === 'en' ? MO_EN : MO_DE;
  const moLong = lang === 'en' ? MOLONG_EN : MOLONG_DE;
  // Separator between an item and its detail. German keeps its original em-dash
  // (unchanged output); English uses an en-dash instead.
  const sep = t('—', '–');
  const totalArea = items.reduce((s, i) => s + i.areaM2, 0);
  const totalYield = items.reduce((s, i) => s + i.yieldKg, 0);
  const totalKcal = items.reduce((s, i) => s + i.kcal, 0);
  const daysPerPerson = Math.round(totalKcal / (2200 * persons));
  const today = new Date().toLocaleDateString(lang === 'en' ? 'en-GB' : 'de-AT', { day: '2-digit', month: 'long', year: 'numeric' });

  // Spacing pair label (both values in active length unit)
  const L = (cm: number) => fmt.imperial ? fmt.lenVal(cm).toFixed(1) : String(Math.round(cm));

  const rows = items.map(({ entry: e, areaM2, plants, yieldKg }) =>
    `<tr><td><b>${pn(e)}</b></td><td>${fmt.area(areaM2)}</td><td>${Math.ceil(plants)} ${t('Stk', 'pcs')}</td>`+
    `<td>${L(e.spacingCm)}×${L(e.rowSpacingCm)} ${fmt.lenUnit}</td><td>${fmt.weight(yieldKg)}</td>`+
    `<td>${moRange(mo, e.harvestStartMonth, e.harvestEndMonth)}</td>`+
    `<td>${e.storageMonths > 0 ? e.storageMonths + ' ' + t('Mon.', 'mo.') : t('nur frisch', 'fresh only')}</td></tr>`
  ).join('');

  // Task calendar grouped by month
  const taskList: { month: number; cls: string; text: string }[] = [];
  items.forEach(({ entry: e, plants }) => {
    const n = Math.ceil(plants);
    if (e.sowIndoorMonth) {
      taskList.push({ month: e.sowIndoorMonth, cls: 'indoor', text: `<b>${pn(e)}</b> ${t('vorziehen', 'start indoors')} ${sep} ${n} ${t('Pflanzen', 'plants')}, ${t('Anzuchterde', 'seed compost')}` });
      taskList.push({ month: e.sowOutdoorMonth, cls: 'outdoor', text: `<b>${pn(e)}</b> ${t('auspflanzen', 'plant out')} ${sep} ${L(e.spacingCm)}×${L(e.rowSpacingCm)} ${fmt.lenUnit}${e.needsSupport ? ', ' + t('Stütze einsetzen', 'add support') : ''}` });
    } else {
      taskList.push({ month: e.sowOutdoorMonth, cls: 'outdoor', text: `<b>${pn(e)}</b> ${t('säen/setzen', 'sow/set')} ${sep} ${n} ${t('Stk', 'pcs')}, ${fmt.len(e.spacingCm)} ${t('Abstand', 'spacing')}` });
    }
    taskList.push({ month: e.harvestStartMonth, cls: 'harvest', text: `<b>${pn(e)}</b> ${t('Ernte beginnt', 'harvest begins')} ${sep} ${moRange(mo, e.harvestStartMonth, e.harvestEndMonth)}, ~${fmt.densityRange(e.yieldKgPerM2Low, e.yieldKgPerM2High)}` });
  });
  taskList.sort((a, b) => a.month - b.month);
  const grouped: Record<number, typeof taskList> = {};
  taskList.forEach(t => { (grouped[t.month] ??= []).push(t); });
  const taskHTML = Object.entries(grouped).map(([m, ts]) =>
    `<div class="tmonth"><div class="tmo-label">${moLong[+m-1]}</div>${ts.map(t =>
      `<div class="titem t-${t.cls}"><span class="tdot"></span><span>${t.text}</span></div>`
    ).join('')}</div>`
  ).join('');

  // ── SVG Aussaatkalender visualization ─────────────────────────────────────
  const SVG_W = 640, LABEL_W = 96, CELL_H = 20, HDR_H = 22;
  const COL_W = (SVG_W - LABEL_W) / 12;
  const svgH = HDR_H + items.length * CELL_H + 8;
  const MON_SHORT = ['J','F','M','A','M','J','J','A','S','O','N','D'];

  const svgCells = items.map(({ entry: e }, rowIdx) => {
    const y = HDR_H + rowIdx * CELL_H;
    const cells = Array.from({ length: 12 }, (_, mi) => {
      const m = mi + 1;
      const isIndoor = e.sowIndoorMonth && m >= e.sowIndoorMonth && m < e.sowOutdoorMonth;
      const isGrowing = m >= e.sowOutdoorMonth && m < e.harvestStartMonth;
      const isHarvest = m >= e.harvestStartMonth && m <= e.harvestEndMonth;
      const fill = isIndoor ? '#4a90c4' : isGrowing ? '#6baa46' : isHarvest ? '#f59e0b' : '#f0f0f0';
      const opacity = isIndoor || isGrowing || isHarvest ? 1 : 0;
      const x = LABEL_W + mi * COL_W;
      return opacity > 0
        ? `<rect x="${x+1}" y="${y+1}" width="${COL_W-2}" height="${CELL_H-2}" rx="3" fill="${fill}" opacity="0.85"/>`
        + (isHarvest ? `<text x="${x + COL_W/2}" y="${y + CELL_H/2 + 4}" text-anchor="middle" font-size="8" fill="#7a4800" font-family="monospace" font-weight="bold">E</text>` : '')
        : '';
    }).join('');
    const rowBg = rowIdx % 2 === 0 ? '#fafcf9' : '#fff';
    return `<rect x="0" y="${y}" width="${SVG_W}" height="${CELL_H}" fill="${rowBg}"/>`
      + `<text x="${LABEL_W - 6}" y="${y + CELL_H/2 + 4}" text-anchor="end" font-size="9" fill="#1a2e1a" font-family="DM Sans,sans-serif" font-weight="600">${pn(e)}</text>`
      + cells;
  }).join('');

  const svgGrid = Array.from({ length: 13 }, (_, i) =>
    `<line x1="${LABEL_W + i * COL_W}" y1="${HDR_H}" x2="${LABEL_W + i * COL_W}" y2="${svgH}" stroke="#ddd" stroke-width="0.5"/>`
  ).join('');

  const timelineSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_W}" height="${svgH}" style="border:1px solid #e0eed8;border-radius:6px;background:#fff">`
    + `<rect width="${SVG_W}" height="${HDR_H}" fill="#2d5a27"/>`
    + MON_SHORT.map((m, i) => `<text x="${LABEL_W + i*COL_W + COL_W/2}" y="15" text-anchor="middle" font-size="9" fill="#fff" font-family="monospace" font-weight="600">${m}</text>`).join('')
    + svgGrid + svgCells
    + `<rect x="0" y="0" width="${SVG_W}" height="${svgH}" fill="none" stroke="#c5dbb8" stroke-width="1"/>`
    + '</svg>';

  // ── Beet area visualization ──────────────────────────────────────────────
  const BAR_W = 640, BAR_H = 32;
  const totalAreaForBar = items.reduce((s, i) => s + i.areaM2, 0);
  let barX = 0;
  const barSegments = items.map(({ entry: e, areaM2 }) => {
    const w = totalAreaForBar > 0 ? (areaM2 / totalAreaForBar) * BAR_W : BAR_W / items.length;
    const seg = `<rect x="${barX+1}" y="1" width="${w-2}" height="${BAR_H-2}" rx="4" fill="${e.color}" opacity="0.25"/>`
      + `<rect x="${barX+1}" y="1" width="${w-2}" height="${BAR_H-2}" rx="4" fill="none" stroke="${e.color}" stroke-width="1.5"/>`
      + (w > 40 ? `<text x="${barX + w/2}" y="${BAR_H/2 + 4}" text-anchor="middle" font-size="9" fill="${e.color}" font-family="DM Sans,sans-serif" font-weight="700">${pn(e)} · ${fmt.areaVal(areaM2).toFixed(1)}${fmt.areaUnit}</text>` : '');
    barX += w;
    return seg;
  }).join('');
  const bedBarSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${BAR_W}" height="${BAR_H}" style="border-radius:6px">`
    + barSegments + '</svg>';

  // Shopping list
  const shopItems = items.flatMap(({ entry: e, plants }) => {
    const n = Math.ceil(plants);
    const base = e.sowIndoorMonth
      ? `${n}× <b>${pn(e)}</b> ${sep} ${t('Saatgut (Vorkultur ab', 'seeds (start indoors from')} ${moLong[e.sowIndoorMonth-1]})`
      : `${n}× <b>${pn(e)}</b> ${sep} ${t('Samen (Direktsaat', 'seeds (direct sowing')} ${moLong[e.sowOutdoorMonth-1]})`;
    return e.needsSupport ? [base, `&nbsp;&nbsp;↳ ${n} ${t('Rankhilfen / Stäbe für', 'supports / stakes for')} ${pn(e)}`] : [base];
  });
  shopItems.push(t('Anzuchterde + Töpfe, Etiketten, Schnur / Raffiabast', 'Seed compost + pots, labels, string / raffia'));
  const shopHTML = shopItems.map(s => `<li>${s}</li>`).join('');

  const html = [
    `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8">`,
    `<title>${t('Gartenplan', 'Garden plan')}</title>`,
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Fraunces:wght@700;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">',
    '<style>',
    '*{box-sizing:border-box;margin:0;padding:0}',
    'body{font-family:"DM Sans",sans-serif;background:#fff;color:#1a1a2e;font-size:10.5pt;line-height:1.5}',
    '@page{size:A4;margin:16mm 15mm}',
    '.pb{page-break-before:always}',
    '.hdr{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #2d5a27;padding-bottom:8px;margin-bottom:18px}',
    '.hdr h1{font-family:Fraunces,serif;font-size:24pt;color:#2d5a27;line-height:1}',
    '.hdr-meta{font-family:"JetBrains Mono",monospace;font-size:7.5pt;color:#777;text-align:right;line-height:1.8}',
    '.pills{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap}',
    '.pill{background:#f4f9f2;border:1px solid #c5dbb8;border-radius:8px;padding:7px 13px;flex:1;min-width:90px}',
    '.pl{font-family:"JetBrains Mono",monospace;font-size:7pt;color:#888;text-transform:uppercase;letter-spacing:.06em}',
    '.pv{font-family:Fraunces,serif;font-size:17pt;font-weight:900;color:#2d5a27}',
    '.ps{font-family:"JetBrains Mono",monospace;font-size:7pt;color:#999}',
    'h2{font-family:Fraunces,serif;font-size:13pt;color:#2d5a27;margin:18px 0 7px;border-left:3px solid #6baa46;padding-left:7px}',
    'table{width:100%;border-collapse:collapse;font-size:9pt}',
    'th{background:#2d5a27;color:#fff;padding:5px 7px;font-weight:600;text-align:left;font-size:8pt}',
    'td{padding:4px 7px;border-bottom:1px solid #e8f3e4}',
    'tr:nth-child(even) td{background:#f8fcf6}',
    '.tmonth{margin-bottom:10px}',
    '.tmo-label{font-family:Fraunces,serif;font-size:10.5pt;font-weight:700;color:#2d5a27;margin-bottom:3px}',
    '.titem{display:flex;align-items:flex-start;gap:6px;margin-bottom:3px;font-size:9pt;padding-left:4px}',
    '.tdot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:4px}',
    '.t-indoor .tdot{background:#4a90c4}',
    '.t-outdoor .tdot{background:#6baa46}',
    '.t-harvest .tdot{background:#f59e0b}',
    '.slist{list-style:none}',
    '.slist li{padding:4px 0 4px 18px;border-bottom:1px solid #eee;font-size:9pt;position:relative}',
    '.slist li::before{content:"☐";position:absolute;left:0;color:#6baa46;font-size:10pt;line-height:1.1}',
    '.footer{margin-top:20px;padding-top:7px;border-top:1px solid #ddd;font-family:"JetBrains Mono",monospace;font-size:6.5pt;color:#aaa;display:flex;justify-content:space-between}',
    '.pbtn{font-family:"DM Sans";background:#2d5a27;color:#fff;border:none;padding:9px 22px;border-radius:8px;font-size:10.5pt;cursor:pointer;margin-bottom:18px}',
    '@media print{.np{display:none}}',
    '</style></head><body>',
    `<button class="pbtn np" onclick="window.print()">${t('Als PDF speichern / Drucken', 'Save as PDF / Print')}</button>`,
    '<div class="hdr">',
    '<div><div style="font-family:\'JetBrains Mono\',monospace;font-size:7pt;color:#888;text-transform:uppercase;letter-spacing:.1em;margin-bottom:3px">Ernterechner · ' + t('Gartenplan', 'Garden plan') + '</div>',
    `<h1>${t('Mein Gartenplan', 'My garden plan')}</h1></div>`,
    `<div class="hdr-meta">${t('Erstellt', 'Created')}: ${today}<br>${persons} ${persons===1?t('Person','person'):t('Personen','people')} · ${items.length} ${t('Sorten', 'crops')}<br>${gardenArea ? `${t('Garten', 'Garden')}: ${Math.round(fmt.areaVal(gardenArea))} ${fmt.areaUnit}` : 'ernterechner.com'}</div>`,
    '</div>',
    '<div class="pills">',
    `<div class="pill"><div class="pl">${t('Gesamtfläche', 'Total area')}</div><div class="pv">${fmt.area(totalArea)}</div>${gardenArea?`<div class="ps">${Math.round(totalArea/gardenArea*100)}% ${t('belegt', 'used')}</div>`:''}</div>`,
    `<div class="pill"><div class="pl">${t('Jahresertrag', 'Annual yield')}</div><div class="pv">${fmt.weightVal(totalYield).toFixed(0)} ${fmt.weightUnit}</div><div class="ps">${fmt.weightVal(totalYield/52).toFixed(1)} ${fmt.weightUnit}/${t('Woche', 'week')}</div></div>`,
    `<div class="pill"><div class="pl">${t('Kalorien', 'Calories')}</div><div class="pv">${Math.round(totalKcal/1000)}k</div><div class="ps">${t('kcal gesamt', 'kcal total')}</div></div>`,
    `<div class="pill"><div class="pl">${t('Versorgung', 'Supply')}</div><div class="pv">${daysPerPerson}</div><div class="ps">${t('Tage/Person (2.200 kcal)', 'days/person (2,200 kcal)')}</div></div>`,
    '</div>',
    `<h2>${t('Pflanzenübersicht', 'Plant overview')}</h2>`,
    `<table><thead><tr><th>${t('Pflanze', 'Plant')}</th><th>${t('Fläche', 'Area')}</th><th>${t('Anzahl', 'Count')}</th><th>${t('Abstand', 'Spacing')}</th><th>${t('Ertrag', 'Yield')}</th><th>${t('Erntezeit', 'Harvest time')}</th><th>${t('Lagerung', 'Storage')}</th></tr></thead>`,
    `<tbody>${rows}</tbody></table>`,
    `<h2>${t('Beetaufteilung &amp; Aussaatkalender', 'Bed layout &amp; sowing calendar')}</h2>`,
    `<div style="margin-bottom:8px">${bedBarSVG}</div>`,
    '<div style="display:flex;gap:14px;margin-bottom:5px;font-size:7.5pt;font-family:\'DM Sans\',sans-serif">',
    `<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:2px;background:#4a90c4;display:inline-block"></span>${t('Vorkultur', 'Indoor start')}</span>`,
    `<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:2px;background:#6baa46;display:inline-block"></span>${t('Wachstum', 'Growth')}</span>`,
    `<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:2px;background:#f59e0b;display:inline-block"></span>${t('Ernte', 'Harvest')}</span>`,
    '</div>',
    timelineSVG,
    '<div class="pb"></div>',
    `<h2>${t('Aufgabenkalender', 'Task calendar')}</h2>`,
    '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:8px;font-size:8pt">',
    `<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:#4a90c4;display:inline-block"></span>${t('Vorkultur', 'Indoor start')}</span>`,
    `<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:#6baa46;display:inline-block"></span>${t('Auspflanzen/Säen', 'Plant out/sow')}</span>`,
    `<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;display:inline-block"></span>${t('Erntezeit', 'Harvest time')}</span>`,
    '</div>',
    taskHTML,
    `<h2>${t('Einkaufsliste', 'Shopping list')}</h2>`,
    `<ul class="slist">${shopHTML}</ul>`,
    '<div class="footer"><span>Ernterechner · ernterechner.com</span>',
    `<span>${t('Erträge: Heistinger "Handbuch Bio-Gemüse", fryd.app, LK NÖ · Richtwerte', 'Yields: Heistinger "Handbuch Bio-Gemüse", fryd.app, LK NÖ · reference values')}</span></div>`,
    '</body></html>',
  ].join('\n');

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank', 'width=900,height=720');
  if (win) setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

type InputMode = 'area' | 'plants' | 'yield' | 'kcal';

interface CalcState {
  entry: YieldEntry;
  mode: InputMode;
  areaM2: number;
  plants: number;
  yieldKg: number;
  kcal: number;
  useGlashaus: boolean;
}

function recalc(entry: YieldEntry, mode: InputMode, value: number, glashaus: boolean): CalcState {
  const mult = glashaus && entry.glashausYieldMultiplier ? entry.glashausYieldMultiplier : 1;
  const avgYieldPerM2 = ((entry.yieldKgPerM2Low + entry.yieldKgPerM2High) / 2) * mult;
  const kcalPerKg = entry.kcalPer100g * 10;
  let areaM2: number, plants: number, yieldKg: number, kcal: number;
  switch (mode) {
    case 'area':
      areaM2 = value; plants = Math.round(areaM2 * entry.plantsPerM2);
      yieldKg = areaM2 * avgYieldPerM2; kcal = yieldKg * kcalPerKg; break;
    case 'plants':
      plants = value; areaM2 = plants / entry.plantsPerM2;
      yieldKg = areaM2 * avgYieldPerM2; kcal = yieldKg * kcalPerKg; break;
    case 'yield':
      yieldKg = value; areaM2 = avgYieldPerM2 > 0 ? yieldKg / avgYieldPerM2 : 0;
      plants = Math.round(areaM2 * entry.plantsPerM2); kcal = yieldKg * kcalPerKg; break;
    case 'kcal':
      kcal = value; yieldKg = kcalPerKg > 0 ? kcal / kcalPerKg : 0;
      areaM2 = avgYieldPerM2 > 0 ? yieldKg / avgYieldPerM2 : 0;
      plants = Math.round(areaM2 * entry.plantsPerM2); break;
    default:
      areaM2 = 3; plants = Math.round(3 * entry.plantsPerM2);
      yieldKg = 3 * avgYieldPerM2; kcal = 3 * avgYieldPerM2 * kcalPerKg;
  }
  return { entry, mode, areaM2, plants, yieldKg, kcal, useGlashaus: glashaus };
}

function GardenConfig({ persons, setPersons, gardenArea, setGardenArea, usedArea }: {
  persons: number; setPersons: (n: number) => void;
  gardenArea: number | null; setGardenArea: (n: number | null) => void;
  usedArea: number;
}) {
  const fmt = useFormat();
  const t = useT();
  const pct = gardenArea ? Math.round((usedArea / gardenArea) * 100) : null;
  const pctColor = pct !== null ? (pct > 80 ? 'var(--c-red)' : pct > 50 ? 'var(--c-amber)' : 'var(--c-green)') : 'var(--c-green)';
  return (
    <div className="yield-config">
      <div>
        <div className="font-sans text-[13px] font-semibold text-text-muted mb-1.5">
          {t('Haushaltsgröße', 'Household size')}
        </div>
        <div className="flex items-center gap-2.5">
          <input type="range" min={1} max={10} value={persons} onChange={e => setPersons(+e.target.value)}
            className="w-[100px] accent-water" />
          <span className="font-display text-[1.375rem] font-black text-water min-w-7">{persons}</span>
          <span className="font-mono text-xs text-text-muted">
            {persons === 1 ? t('Person', 'person') : t('Personen', 'people')}
          </span>
        </div>
      </div>

      <div>
        <div className="font-sans text-[13px] font-semibold text-text-muted mb-1.5">
          {t('Verfügbare Gartenfläche (optional)', 'Available garden area (optional)')}
        </div>
        <div className="flex items-center gap-2">
          <input type="number" min={1} step={5}
            value={gardenArea == null ? '' : Math.round(fmt.areaVal(gardenArea))}
            placeholder={t('z.B. 200', 'e.g. 200')}
            onChange={e => setGardenArea(e.target.value ? fmt.areaToMetric(+e.target.value) : null)}
            className="w-20 py-1.25 px-2 rounded-[7px] bg-bg border border-[rgba(255,255,255,0.1)] text-amber font-mono text-sm outline-none" />
          <span className="font-mono text-xs text-text-muted">{fmt.areaUnit}</span>
          {pct !== null && (
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-1.5 rounded-[3px] bg-[rgba(255,255,255,0.08)] overflow-hidden">
                <div className="h-full rounded-[3px] transition-[width] duration-300"
                  style={{ width: `${Math.min(100, pct)}%`, background: pctColor }} />
              </div>
              <span className="font-mono text-xs" style={{ color: pctColor }}>{pct}% {t('belegt', 'used')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-50">
        <div className="font-sans text-[13px] font-semibold text-text-muted mb-1">{t('Faustregel Selbstversorgung', 'Self-sufficiency rule of thumb')}</div>
        <div className="font-sans text-xs text-text-muted leading-[1.5]">
          {t('Für', 'For')} <strong className="text-text">{persons} {persons === 1 ? t('Person', 'person') : t('Personen', 'people')}</strong> {t('werden ca.', 'about')} <strong className="text-amber">{Math.round(fmt.areaVal(persons * 50))}–{Math.round(fmt.areaVal(persons * 80))} {fmt.areaUnit}</strong> {t('Gemüsegarten empfohlen (Heistinger).', 'of vegetable garden is recommended (Heistinger).')}
          {' '}{t('Davon ca.', 'Of that about')} <strong className="text-primary">⅓ {t('Starkzehrer', 'heavy feeders')}</strong> ({t('Tomate, Kürbis', 'tomato, pumpkin')}), <strong className="text-water">⅓ {t('Mittelzehrer', 'moderate feeders')}</strong> ({t('Karotte, Zwiebel', 'carrot, onion')}), <strong className="text-text-muted">⅓ {t('Schwachzehrer', 'light feeders')}</strong> ({t('Kräuter, Salat', 'herbs, lettuce')}).
        </div>
      </div>
    </div>
  );
}

function PlantInfoBox({ entry }: { entry: YieldEntry }) {
  const t = useT();
  const { lang } = useLang();
  const de = WIKI_MAP.get(entry.plantId);
  const en = WIKI_MAP_EN.get(entry.plantId);
  // English active: use the English wiki fields, falling back field-by-field to German.
  const pick = (field: 'beginnerTip' | 'sowing' | 'planting' | 'partners' | 'enemies') =>
    (lang === 'en' ? (en?.[field] ?? de?.[field]) : de?.[field]);
  const wiki = {
    beginnerTip: pick('beginnerTip'),
    sowing: pick('sowing'),
    planting: pick('planting'),
    partners: pick('partners'),
    enemies: pick('enemies'),
  };
  const name = plantName(entry.plantId, entry.name, lang);
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2.5">
      <button onClick={() => setOpen(o => !o)}
        className="font-mono text-xs rounded-md px-2.5 py-1 cursor-pointer flex items-center gap-1.5 transition-all duration-150"
        style={{
          background: 'none',
          border: `1px solid ${open ? 'rgba(74,144,196,0.33)' : 'rgba(255,255,255,0.08)'}`,
          color: open ? 'var(--c-cyan)' : 'var(--c-sub)',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <text x="6" y="9.5" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace" fontWeight="bold">i</text>
        </svg>
        {open ? t('Info schließen', 'Close info') : t('Anfänger-Info & Mischkultur', 'Beginner info & companion planting')}
      </button>

      {open && (
        <div className="mt-2 bg-bg rounded-[10px] p-3.5 flex flex-col gap-2.5"
          style={{ border: `1px solid ${entry.color}33` }}
        >
          {wiki.beginnerTip && (
            <div>
              <div className="font-sans text-[12px] font-semibold text-amber mb-1">{t('Anfänger-Tipp', 'Beginner tip')}</div>
              <div className="font-sans text-[13px] text-text leading-[1.6]">{wiki.beginnerTip}</div>
            </div>
          )}
          {wiki.sowing && (
            <div>
              <div className="font-sans text-[12px] font-semibold text-text-muted mb-1">{t('Aussaat / Pflanzung', 'Sowing / planting')}</div>
              <div className="font-sans text-xs text-text-muted leading-[1.5]">{wiki.sowing}</div>
              {wiki.planting && <div className="font-sans text-xs text-text-muted leading-[1.5] mt-0.5">{wiki.planting}</div>}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            {wiki.partners && (
              <div className="rounded-lg p-[8px_10px] bg-[rgba(93,143,46,0.06)] border border-[rgba(93,143,46,0.2)]">
                <div className="font-sans text-[12px] font-semibold text-text-muted mb-1">{t('Gute Nachbarn', 'Good neighbours')}</div>
                <div className="font-sans text-xs text-text-muted leading-[1.5]">{wiki.partners}</div>
              </div>
            )}
            {wiki.enemies && (
              <div className="rounded-lg p-[8px_10px] bg-[rgba(184,67,46,0.06)] border border-[rgba(184,67,46,0.2)]">
                <div className="font-sans text-[12px] font-semibold text-red mb-1">{t('Schlechte Nachbarn', 'Bad neighbours')}</div>
                <div className="font-sans text-xs text-text-muted leading-[1.5]">{wiki.enemies}</div>
              </div>
            )}
          </div>
          {entry.successionalSowings > 1 && (
            <div className="rounded-lg p-[8px_10px] bg-[rgba(74,144,196,0.06)] border border-[rgba(74,144,196,0.2)]">
              <div className="font-sans text-[12px] font-semibold text-water mb-1">{t('Staffelaussaat empfohlen', 'Succession sowing recommended')}</div>
              <div className="font-sans text-xs text-text-muted leading-[1.5]">
                {t(`${name} profitiert von`, `${name} benefits from`)} <strong className="text-water">{entry.successionalSowings} {t('Aussaatrunden', 'sowing rounds')}</strong> {t('im Abstand von ca.', 'about')} {Math.round(entry.harvestWindowWeeks / entry.successionalSowings)} {t('Wochen. So hast du statt einer kurzen Ernteflut einen', 'weeks apart. So instead of one short glut you get a')} <strong className="text-text">{t('gleichmäßigen Ertrag über die ganze Saison', 'steady yield across the whole season')}</strong>.
                {entry.plantId === 'karotte' && t(' Karotten ab März alle 3 Wochen nachsäen bis Juli = frische Karotten von Juni bis November.', ' Sow carrots every 3 weeks from March to July = fresh carrots from June to November.')}
                {entry.plantId === 'salat' && t(' Salat alle 2 Wochen nachsäen = nie zu viel auf einmal.', ' Sow lettuce every 2 weeks = never too much at once.')}
                {entry.plantId === 'radieschen' && t(' Radieschen alle 2 Wochen = immer 4 Wochen bis zur Ernte.', ' Radishes every 2 weeks = always 4 weeks to harvest.')}
              </div>
            </div>
          )}
          {entry.successionalSowings === 1 && entry.harvestWindowWeeks < 8 && (
            <div className="rounded-lg p-[8px_10px] bg-[rgba(212,165,116,0.06)] border border-[rgba(212,165,116,0.2)]">
              <div className="font-sans text-[12px] font-semibold text-amber mb-1">{t('Achtung: Kurzes Ernte­fenster', 'Note: short harvest window')}</div>
              <div className="font-sans text-xs text-text-muted leading-[1.5]">
                {t(`${name} hat nur`, `${name} has only`)} <strong className="text-text">{entry.harvestWindowWeeks} {t('Wochen', 'weeks')}</strong> {t('Erntezeit.', 'of harvest time.')}
                {' '}{t('Wenn du viele Pflanzen gleichzeitig anziehst, bekommst du alles auf einmal, mehr als du frisch verwenden kannst.', 'If you grow many plants at once you get everything at once, more than you can use fresh.')}
                {' '}{t('Besser: einige Wochen gestaffelt anziehen, oder den Rest einkochen/einfrieren.', 'Better: stagger the sowing over a few weeks, or preserve/freeze the rest.')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RipeningDetail({ entry }: { entry: YieldEntry }) {
  const fmt = useFormat();
  const t = useT();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const { firstFruitWeeks, fullRipeWeeks } = getRipeningTimeline(entry);
  const stages = entry.colorStages ?? [];
  const fs = entry.fruitSize;

  const hasDetail = stages.length > 0 || !!fs || entry.weeksToFirstFruit !== undefined;

  return (
    <div className="mt-2.5">
      <button onClick={() => setOpen(o => !o)}
        className="font-mono text-xs rounded-md px-2.5 py-1 cursor-pointer flex items-center gap-1.5 transition-all duration-150"
        style={{
          background: 'none',
          border: `1px solid ${open ? entry.color + '55' : 'rgba(255,255,255,0.08)'}`,
          color: open ? entry.color : 'var(--c-sub)',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="6" cy="6" r="2" fill="currentColor"/>
        </svg>
        {open ? t('Reife & Größe schließen', 'Close ripeness & size') : t('Reife · Farben · Größe', 'Ripeness · colours · size')}
      </button>

      {open && (
        <div className="mt-2 bg-bg rounded-[10px] p-3.5 flex flex-col gap-3"
          style={{ border: `1px solid ${entry.color}33` }}
        >
          {/* Timeline: erste Früchte → Vollreife */}
          <div>
            <div className="font-sans text-[12px] font-semibold text-text-muted mb-1.5">
              {t('Reife-Zeitachse (Wochen ab Aussaat/Pflanzung)', 'Ripening timeline (weeks from sowing/planting)')}
            </div>
            {hasDetail ? (
              <div className="relative h-7 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${entry.color}11 0%, ${entry.color}66 100%)`,
                    width: '100%',
                  }} />
                {/* Marker erste Früchte */}
                <div className="absolute top-0 bottom-0 w-px"
                  style={{
                    left: `${(firstFruitWeeks / fullRipeWeeks) * 100}%`,
                    background: '#d4a574',
                  }} />
                <div className="absolute -top-1 text-[10px] font-mono text-amber whitespace-nowrap"
                  style={{ left: `${(firstFruitWeeks / fullRipeWeeks) * 100}%`, transform: 'translateX(-50%) translateY(-100%)' }}>
                  {t('1. Früchte', '1st fruit')} W{firstFruitWeeks}
                </div>
                {/* Vollreife rechts */}
                <div className="absolute top-0 bottom-0 right-0 w-0.5"
                  style={{ background: entry.color }} />
                <div className="absolute right-1 inset-y-0 flex items-center font-mono text-[11px] font-bold"
                  style={{ color: entry.color }}>
                  {t('Vollreif', 'Ripe')} W{fullRipeWeeks}
                </div>
              </div>
            ) : (
              <div className="font-mono text-xs text-text-muted">
                {t('Vollreif nach', 'Fully ripe after')} {fullRipeWeeks} {t('Wochen (keine Detail-Daten hinterlegt)', 'weeks (no detail data available)')}
              </div>
            )}
          </div>

          {/* Farb-/Reifephasen */}
          {stages.length > 0 && (
            <div>
              <div className="font-sans text-[12px] font-semibold text-text-muted mb-1.5">
                {t('Farbphasen während der Reife', 'Colour phases during ripening')}
              </div>
              <div className="flex flex-col gap-1.5">
                {stages.map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full shrink-0 border"
                      style={{ background: s.hex, borderColor: 'rgba(255,255,255,0.15)' }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-[12px] text-text">{dt(COLOR_STAGE_LABEL_EN, s.label, lang)}</div>
                      {s.description && (
                        <div className="font-sans text-[11px] text-text-muted leading-tight">{dt(COLOR_STAGE_DESC_EN, s.description, lang)}</div>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-text-muted shrink-0">
                      {Math.round(s.atFraction * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Endgröße der Frucht */}
          {fs && (
            <div>
              <div className="font-sans text-[12px] font-semibold text-text-muted mb-1.5">
                {t('Endgröße der Frucht', 'Final fruit size')}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {fs.lengthCm !== undefined && (
                  <span className="plant-tag">↕ {fmt.len(fs.lengthCm)} {t('lang', 'long')}</span>
                )}
                {fs.diameterCm !== undefined && (
                  <span className="plant-tag">⌀ {fmt.len(fs.diameterCm)}</span>
                )}
                {fs.weightG !== undefined && (
                  <span className="plant-tag">{fs.weightG} {t('g / Stück', 'g / piece')}</span>
                )}
              </div>
              {fs.note && (
                <div className="font-sans text-[11px] text-text-muted mt-1.5 leading-snug">{dt(FRUIT_NOTE_EN, fs.note, lang)}</div>
              )}
            </div>
          )}

          {/* Pflanzen-Endgröße */}
          <div>
            <div className="font-sans text-[12px] font-semibold text-text-muted mb-1.5">
              {t('Pflanze ausgewachsen', 'Plant when fully grown')}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="plant-tag">{t('Höhe', 'Height')} {fmt.len(entry.heightCm)}</span>
              <span className="plant-tag">{t('Breite', 'Width')} {fmt.len(entry.spreadCm)}</span>
              <span className="plant-tag">{dt(GROWTH_FORM_EN, entry.growthForm, lang)}</span>
              {entry.needsSupport && <span className="plant-tag" style={{ color: 'var(--c-amber)' }}>{t('Rankhilfe', 'Support')}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CalcField({ label, unit, value, color, active, fractional, onChange }: {
  label: string; unit: string; value: number; color: string; active: boolean;
  fractional?: boolean; onChange: (v: number) => void;
}) {
  return (
    <div className="px-3.5 py-3 rounded-xl transition-all duration-150"
      style={{
        background: active ? color + '12' : 'var(--c-bg)',
        border: `2px solid ${active ? color + '55' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <div className="font-sans text-[12px] font-semibold mb-1.5" style={{ color: active ? color : 'var(--c-sub)' }}>
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <input
          type="number" min={0}
          step={fractional ? 0.5 : 1}
          value={active ? undefined : Math.round(value * 10) / 10}
          defaultValue={active ? Math.round(value * 10) / 10 : undefined}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          onFocus={e => e.target.select()}
          className="w-full bg-transparent border-none outline-none font-display text-[1.75rem] font-black"
          style={{ color: active ? color : 'var(--c-text)' }}
        />
        <span className="font-mono text-xs text-text-muted shrink-0">{unit}</span>
      </div>
    </div>
  );
}

function PlantCalcCard({ state, onUpdate, onRemove }: {
  state: CalcState; onUpdate: (s: CalcState) => void; onRemove: () => void;
}) {
  const fmt = useFormat();
  const t = useT();
  const { lang } = useLang();
  const pname = usePlantName();
  const e = state.entry;
  const mult = state.useGlashaus && e.glashausYieldMultiplier ? e.glashausYieldMultiplier : 1;
  const yieldRange = { low: state.areaM2 * e.yieldKgPerM2Low * mult, high: state.areaM2 * e.yieldKgPerM2High * mult };
  const glassVal = state.mode === 'area' ? state.areaM2 : state.mode === 'plants' ? state.plants : state.mode === 'yield' ? state.yieldKg : state.kcal;

  return (
    <div className="bg-card rounded-2xl p-5"
      style={{ border: `1px solid ${e.color}22`, borderLeft: `3px solid ${e.color}` }}
    >
      <div className="flex justify-between items-start mb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
            <h3 className="font-sans text-[1.25rem] font-extrabold text-text m-0">{pname(e)}</h3>
            {WIKI_MAP.has(e.plantId) && (
              <a
                href={wikiPlantUrl(e.plantId)}
                target="_blank"
                rel="noopener noreferrer"
                title={t('Im Wiki öffnen', 'Open in wiki')}
                aria-label={t('Im Wiki öffnen', 'Open in wiki')}
                style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--c-sub)', textDecoration: 'none' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </a>
            )}
          </div>
          <div className="font-mono text-xs text-text-muted mt-1">
            {(() => {
              const { firstFruitWeeks, fullRipeWeeks } = getRipeningTimeline(e);
              const hasDetail = e.weeksToFirstFruit !== undefined;
              return hasDetail
                ? `${t('1. Früchte', '1st fruit')} W${firstFruitWeeks} · ${t('Vollreif', 'Ripe')} W${fullRipeWeeks}`
                : `${fullRipeWeeks} ${t('Wo. bis Ernte', 'wk to harvest')}`;
            })()} · {fmt.len(e.spacingCm)} {t('Abstand', 'spacing')} · {e.successionalSowings > 1 ? `${e.successionalSowings}x ${t('Staffelaussaat empfohlen', 'succession sowing recommended')}` : t('Einmalige Aussaat', 'Single sowing')}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {e.glashausYieldMultiplier && (
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={state.useGlashaus}
                onChange={ev => onUpdate(recalc(e, state.mode, glassVal, ev.target.checked))} />
              <span className="font-mono text-xs text-water">{t('Glashaus', 'Greenhouse')} +{Math.round((e.glashausYieldMultiplier - 1) * 100)}%</span>
            </label>
          )}
          <button onClick={onRemove} className="plant-remove-btn">×</button>
        </div>
      </div>

      <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <CalcField label={t('Fläche', 'Area')} unit={fmt.areaUnit} value={fmt.areaVal(state.areaM2)} color="var(--c-cyan)" active={state.mode === 'area'} fractional
          onChange={v => onUpdate(recalc(e, 'area', fmt.areaToMetric(v), state.useGlashaus))} />
        <CalcField label={t('Pflanzen', 'Plants')} unit={t('Stk', 'pcs')} value={state.plants} color="var(--c-green)" active={state.mode === 'plants'}
          onChange={v => onUpdate(recalc(e, 'plants', v, state.useGlashaus))} />
        <CalcField label={t('Ertrag', 'Yield')} unit={fmt.weightUnit} value={fmt.weightVal(state.yieldKg)} color="var(--c-amber)" active={state.mode === 'yield'}
          onChange={v => onUpdate(recalc(e, 'yield', fmt.weightToMetric(v), state.useGlashaus))} />
        <CalcField label={t('Kalorien', 'Calories')} unit="kcal" value={state.kcal} color="var(--c-red)" active={state.mode === 'kcal'}
          onChange={v => onUpdate(recalc(e, 'kcal', v, state.useGlashaus))} />
      </div>

      {(() => {
        const MAX_DISPLAY = 50;
        const count = Math.round(state.plants);
        if (count <= 0 || !resolveIconKey(e.plantId)) return null;
        const displayCount = Math.min(count, MAX_DISPLAY);
        const overflow = count - MAX_DISPLAY;
        const iconSize = count <= 6 ? 44 : count <= 16 ? 36 : count <= 30 ? 28 : 22;
        return (
          <div className="mt-3 rounded-xl p-3" style={{ background: e.color + '08', border: `1px solid ${e.color}22` }}>
            <div className="font-mono text-[11px] mb-2" style={{ color: e.color + 'aa' }}>
              {count} {count === 1 ? t('Pflanze', 'plant') : t('Pflanzen', 'plants')} · {fmt.area(state.areaM2)}
            </div>
            <div className="flex flex-wrap gap-0.5">
              {Array.from({ length: displayCount }).map((_, i) => (
                <PlantIcon key={i} plant={resolveIconKey(e.plantId)} stage="reif" size={iconSize} />
              ))}
              {overflow > 0 && (
                <div className="flex items-center justify-center rounded-lg font-mono text-xs"
                  style={{ width: iconSize, height: iconSize, background: e.color + '22', color: e.color }}>
                  +{overflow}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <div className="flex flex-wrap gap-2 mt-3">
        <span className="plant-tag">{t('Spanne', 'Range')}: {fmt.weightVal(yieldRange.low).toFixed(1)}–{fmt.weightVal(yieldRange.high).toFixed(1)} {fmt.weightUnit}</span>
        <span className="plant-tag">{e.kcalPer100g} kcal/100g</span>
        <span className="plant-tag" style={{ color: e.storageMonths > 0 ? 'var(--c-green)' : undefined }}>
          {e.storageMonths > 0 ? `${t('Lagert', 'Stores')} ${e.storageMonths} ${t('Mon.', 'mo.')}` : t('Nur frisch', 'Fresh only')}
        </span>
        <span className="plant-tag">{dt(STORAGE_METHOD_EN, e.storageMethod, lang)}</span>
      </div>

      <RipeningDetail entry={e} />
      <PlantInfoBox entry={e} />
    </div>
  );
}

function PlantPicker({ onAdd, exclude }: { onAdd: (e: YieldEntry) => void; exclude: Set<string> }) {
  const fmt = useFormat();
  const t = useT();
  const pname = usePlantName();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('alle');
  const filtered = YIELD_DATA.filter(e =>
    !exclude.has(e.plantId) &&
    pname(e).toLowerCase().includes(search.toLowerCase()) &&
    (cat === 'alle' || e.category === cat)
  );

  const catLabel = (c: string) =>
    c === 'alle' ? t('Alle', 'All')
    : c === 'gemuese' ? t('Gemüse', 'Vegetables')
    : c === 'salat' ? t('Salate', 'Salads')
    : c === 'obst' ? t('Obst', 'Fruit')
    : t('Kräuter', 'Herbs');

  return (
    <div className="plant-picker">
      <div className="font-sans text-[13px] font-semibold text-text-muted mb-2">
        {t('Pflanze hinzufügen', 'Add a plant')}
      </div>
      <div className="flex gap-1.5 mb-2.5 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('Suchen...', 'Search...')}
          className="flex-1 min-w-[140px] py-1.5 px-3 rounded-lg bg-bg border border-[rgba(255,255,255,0.1)] text-text font-sans text-[13px] outline-none" />
        {['alle', 'gemuese', 'salat', 'obst', 'kraeuter'].map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`font-mono text-xs py-[5px] px-2.5 rounded-md cursor-pointer border ${cat === c ? 'bg-[rgba(93,143,46,0.09)] text-primary border-[rgba(93,143,46,0.27)]' : 'bg-transparent text-text-muted border-[rgba(255,255,255,0.06)]'}`}
          >{catLabel(c)}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {filtered.map(e => (
          <button key={e.plantId} onClick={() => onAdd(e)} className="plant-picker-item" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PlantIcon plant={resolveIconKey(e.plantId)} stage="reif" size={26} />
            <span className="font-sans text-xs text-text font-semibold">{pname(e)}</span>
            <span className="font-mono text-xs text-text-muted ml-1">{fmt.densityRange(e.yieldKgPerM2Low, e.yieldKgPerM2High)}</span>
          </button>
        ))}
        {filtered.length === 0 && <span className="font-sans text-xs text-text-muted">{t('Alle Pflanzen bereits ausgewählt', 'All plants already selected')}</span>}
      </div>
    </div>
  );
}

export default function YieldCalculator() {
  const fmt = useFormat();
  const t = useT();
  const { lang } = useLang();
  const [items, setItems] = useState<CalcState[]>([]);
  const [persons, setPersons] = useState(4);
  const [gardenArea, setGardenArea] = useState<number | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [importInput, setImportInput] = useState('');

  const addPlant = (entry: YieldEntry) => {
    if (items.find(i => i.entry.plantId === entry.plantId)) return;
    setItems([...items, recalc(entry, 'area', 3, false)]);
  };
  const updateItem = (idx: number, s: CalcState) => { const next = [...items]; next[idx] = s; setItems(next); };
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const excludeIds = new Set(items.map(i => i.entry.plantId));
  const totalArea = items.reduce((s, i) => s + i.areaM2, 0);
  const totalYield = items.reduce((s, i) => s + i.yieldKg, 0);
  const totalKcal = items.reduce((s, i) => s + i.kcal, 0);
  const daysPerPerson = totalKcal / (2200 * persons);
  const kcalPerDay = persons * 2200;

  const planCode = items.length > 0 ? btoa(JSON.stringify({
    v: 1,
    p: items.map(i => ({
      id: i.entry.plantId,
      m: i.mode,
      val: i.mode === 'area' ? i.areaM2 : i.mode === 'plants' ? i.plants : i.mode === 'yield' ? i.yieldKg : i.kcal,
      g: i.useGlashaus ? 1 : 0,
    }))
  })) : '';

  const importPlan = (code: string) => {
    try {
      const data = JSON.parse(atob(code.trim())) as { v: number; p: Array<{ id: string; m: InputMode; val: number; g: 0|1 }> };
      if (data.v !== 1 || !Array.isArray(data.p)) return;
      const newItems: CalcState[] = [];
      data.p.forEach(({ id, m, val, g }) => {
        const entry = YIELD_DATA.find(e => e.plantId === id);
        if (entry) newItems.push(recalc(entry, m, val, g === 1));
      });
      if (newItems.length > 0) { setItems(newItems); setShowCode(false); setImportInput(''); }
    } catch { /* invalid code */ }
  };

  return (
    <div>
      <div className="mb-5">
        <div className="font-mono text-[11px] text-text-muted tracking-[0.04em] mb-1.5">{t('Planen', 'Plan')}</div>
        <h1 className="font-display text-text text-[2.25rem] font-bold m-0 mb-2 tracking-[-0.02em] leading-[1.1]">
          {t('Ertragsrechner', 'Yield calculator')}
        </h1>
        <p className="font-sans text-text-muted text-[13px] m-0 leading-[1.6] max-w-[680px]">
          {t('Gib ein beliebiges Feld ein (Fläche, Pflanzenanzahl, kg Ertrag oder Kalorien) und der Rest wird automatisch berechnet.', 'Enter any one field (area, number of plants, kg of yield or calories) and the rest is calculated automatically.')}
          {' '}{t('Klick auf', 'Click')} <strong className="text-water">{t('Anfänger-Info', 'Beginner info')}</strong> {t('unter jeder Pflanze für Tipps zu Mischkultur, Staffelaussaat und häufigen Fehlern.', 'under each plant for tips on companion planting, succession sowing and common mistakes.')}
        </p>
      </div>

      <GardenConfig persons={persons} setPersons={setPersons} gardenArea={gardenArea} setGardenArea={setGardenArea} usedArea={totalArea} />

      {items.length > 0 && (
        <div className="yield-totals" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', alignItems: 'center' }}>
          <div>
            <div className="font-mono text-xs text-text-muted">{t('Gesamtfläche', 'Total area')}</div>
            <div className="font-display text-[1.625rem] font-black text-text">{fmt.areaVal(totalArea).toFixed(1)} <span className="text-sm text-text-muted">{fmt.areaUnit}</span></div>
            {gardenArea && <div className="font-mono text-xs text-text-muted">{Math.round(totalArea / gardenArea * 100)}% {t('deines Gartens', 'of your garden')}</div>}
          </div>
          <div>
            <div className="font-mono text-xs text-primary">{t('Gesamtertrag', 'Total yield')}</div>
            <div className="font-display text-[1.625rem] font-black text-primary">{fmt.weightVal(totalYield).toFixed(0)} <span className="text-sm">{fmt.weightUnit}</span></div>
            <div className="font-mono text-xs text-text-muted">{fmt.weightVal(totalYield / 52).toFixed(1)} {fmt.weightUnit}/{t('Woche', 'week')}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-amber">{t('Kalorien gesamt', 'Total calories')}</div>
            <div className="font-display text-[1.625rem] font-black text-amber">{Math.round(totalKcal).toLocaleString()}</div>
            <div className="font-mono text-xs text-text-muted">kcal</div>
          </div>
          <div>
            <div className="font-mono text-xs text-water">{persons} {persons === 1 ? t('Person', 'person') : t('Personen', 'people')}</div>
            <div className="font-display text-[1.625rem] font-black text-water">{Math.round(daysPerPerson)} <span className="text-sm">{t('Tage', 'days')}</span></div>
            <div className="font-mono text-xs text-text-muted">{t('à', 'at')} {kcalPerDay.toLocaleString()} kcal/{t('Tag', 'day')}</div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => openPrintPlan(items, persons, gardenArea, fmt, t, lang)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-sans text-[13px] font-semibold cursor-pointer transition-all"
              style={{ background: 'rgba(93,143,46,0.12)', border: '1px solid rgba(93,143,46,0.3)', color: 'var(--c-green)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v9M4 7l4 4 4-4M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('PDF / Drucken', 'PDF / Print')}
            </button>
            <button
              onClick={() => setShowCode(o => !o)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-sans text-[13px] font-semibold cursor-pointer transition-all"
              style={{ background: showCode ? 'rgba(74,144,196,0.18)' : 'rgba(74,144,196,0.08)', border: `1px solid ${showCode ? 'rgba(74,144,196,0.45)' : 'rgba(74,144,196,0.2)'}`, color: 'var(--c-water)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M5 4l-3 4 3 4M11 4l3 4-3 4M9 2l-2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('Plan-Code', 'Plan code')}
            </button>
          </div>
        </div>
      )}

      {showCode && (
        <div className="mb-5 rounded-2xl p-4 flex flex-col gap-4" style={{ background: 'rgba(74,144,196,0.06)', border: '1px solid rgba(74,144,196,0.2)' }}>
          <div>
            <div className="font-sans text-[12px] font-semibold text-water mb-1.5">{t('Dein Plan als Code', 'Your plan as a code')}</div>
            <div className="font-sans text-xs text-text-muted mb-2 leading-normal">
              {t('Kopiere diesen Code um deinen Plan zu speichern oder zu teilen. Kein Login nötig — alles steckt im Code.', 'Copy this code to save or share your plan. No login needed – everything is in the code.')}
            </div>
            <div className="flex gap-2 items-stretch">
              <textarea
                readOnly
                value={planCode}
                rows={3}
                className="flex-1 rounded-lg p-2.5 font-mono text-[11px] text-water resize-none outline-none"
                style={{ background: 'rgba(10,15,26,0.6)', border: '1px solid rgba(74,144,196,0.25)' }}
                onClick={e => (e.target as HTMLTextAreaElement).select()}
              />
              <button
                onClick={() => navigator.clipboard.writeText(planCode)}
                className="px-3 rounded-lg font-sans text-xs font-semibold cursor-pointer shrink-0 transition-all"
                style={{ background: 'rgba(74,144,196,0.15)', border: '1px solid rgba(74,144,196,0.3)', color: 'var(--c-water)' }}
              >
                {t('Kopieren', 'Copy')}
              </button>
            </div>
          </div>
          <div>
            <div className="font-sans text-[12px] font-semibold text-text-muted mb-1.5">{t('Plan importieren', 'Import plan')}</div>
            <div className="flex gap-2 items-stretch">
              <textarea
                value={importInput}
                onChange={e => setImportInput(e.target.value)}
                placeholder={t('Plan-Code hier einfügen…', 'Paste the plan code here…')}
                rows={3}
                className="flex-1 rounded-lg p-2.5 font-mono text-[11px] text-text resize-none outline-none"
                style={{ background: 'rgba(10,15,26,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <button
                onClick={() => importPlan(importInput)}
                disabled={!importInput.trim()}
                className="px-3 rounded-lg font-sans text-xs font-semibold cursor-pointer shrink-0 transition-all disabled:opacity-40"
                style={{ background: 'rgba(93,143,46,0.15)', border: '1px solid rgba(93,143,46,0.3)', color: 'var(--c-green)' }}
              >
                {t('Laden', 'Load')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 mb-5">
        {items.map((state, idx) => (
          <PlantCalcCard key={state.entry.plantId} state={state} onUpdate={s => updateItem(idx, s)} onRemove={() => removeItem(idx)} />
        ))}
      </div>

      {items.length > 0 && (
        <div className="mb-6">
          <BedVisualizer plants={items.map(i => ({ entry: i.entry, areaM2: i.areaM2 }))} />
        </div>
      )}

      <PlantPicker onAdd={addPlant} exclude={excludeIds} />

      <p className="font-sans text-[11px] text-text-muted opacity-40 mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        {t(
          'Erträge: Heistinger "Handbuch Bio-Gemüse", fryd.app, LK NÖ · Kalorien: ÖNWT · Glashaus: HBLFA Schönbrunn · Tatsächliche Erträge variieren.',
          'Yields: Heistinger "Handbuch Bio-Gemüse", fryd.app, LK NÖ · Calories: ÖNWT · Greenhouse: HBLFA Schönbrunn · Actual yields vary.'
        )}
      </p>
    </div>
  );
}
