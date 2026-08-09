import { useState } from 'react';
import { YIELD_DATA, type YieldEntry, getRipeningTimeline } from '../data/yieldData';
import { WIKI_PLANTS } from '../data/wiki';
import BedVisualizer from './BedVisualizer';
import { PlantIcon, resolveIconKey } from '../icons/plant-icons/PlantIcon.tsx';

const WIKI_MAP = new Map(WIKI_PLANTS.map(p => [p.id, p]));

const MO = ['Jän','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
const MOLONG = ['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const moRange = (s: number, e: number) => Array.from({length: e - s + 1}, (_,i) => MO[s+i-1]).join('–');

function openPrintPlan(items: CalcState[], persons: number, gardenArea: number | null) {
  const totalArea = items.reduce((s, i) => s + i.areaM2, 0);
  const totalYield = items.reduce((s, i) => s + i.yieldKg, 0);
  const totalKcal = items.reduce((s, i) => s + i.kcal, 0);
  const daysPerPerson = Math.round(totalKcal / (2200 * persons));
  const today = new Date().toLocaleDateString('de-AT', { day: '2-digit', month: 'long', year: 'numeric' });

  const rows = items.map(({ entry: e, areaM2, plants, yieldKg }) =>
    `<tr><td><b>${e.name}</b></td><td>${areaM2.toFixed(1)} m²</td><td>${Math.ceil(plants)} Stk</td>`+
    `<td>${e.spacingCm}×${e.rowSpacingCm} cm</td><td>${yieldKg.toFixed(1)} kg</td>`+
    `<td>${moRange(e.harvestStartMonth, e.harvestEndMonth)}</td>`+
    `<td>${e.storageMonths > 0 ? e.storageMonths + ' Mon.' : 'nur frisch'}</td></tr>`
  ).join('');

  // Task calendar grouped by month
  const taskList: { month: number; cls: string; text: string }[] = [];
  items.forEach(({ entry: e, plants }) => {
    const n = Math.ceil(plants);
    if (e.sowIndoorMonth) {
      taskList.push({ month: e.sowIndoorMonth, cls: 'indoor', text: `<b>${e.name}</b> vorziehen — ${n} Pflanzen, Anzuchterde` });
      taskList.push({ month: e.sowOutdoorMonth, cls: 'outdoor', text: `<b>${e.name}</b> auspflanzen — ${e.spacingCm}×${e.rowSpacingCm} cm${e.needsSupport ? ', Stütze einsetzen' : ''}` });
    } else {
      taskList.push({ month: e.sowOutdoorMonth, cls: 'outdoor', text: `<b>${e.name}</b> säen/setzen — ${n} Stk, ${e.spacingCm} cm Abstand` });
    }
    taskList.push({ month: e.harvestStartMonth, cls: 'harvest', text: `<b>${e.name}</b> Ernte beginnt — ${moRange(e.harvestStartMonth, e.harvestEndMonth)}, ~${e.yieldKgPerM2Low}–${e.yieldKgPerM2High} kg/m²` });
  });
  taskList.sort((a, b) => a.month - b.month);
  const grouped: Record<number, typeof taskList> = {};
  taskList.forEach(t => { (grouped[t.month] ??= []).push(t); });
  const taskHTML = Object.entries(grouped).map(([mo, ts]) =>
    `<div class="tmonth"><div class="tmo-label">${MOLONG[+mo-1]}</div>${ts.map(t =>
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
      + `<text x="${LABEL_W - 6}" y="${y + CELL_H/2 + 4}" text-anchor="end" font-size="9" fill="#1a2e1a" font-family="DM Sans,sans-serif" font-weight="600">${e.name}</text>`
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
      + (w > 40 ? `<text x="${barX + w/2}" y="${BAR_H/2 + 4}" text-anchor="middle" font-size="9" fill="${e.color}" font-family="DM Sans,sans-serif" font-weight="700">${e.name} · ${areaM2.toFixed(1)}m²</text>` : '');
    barX += w;
    return seg;
  }).join('');
  const bedBarSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${BAR_W}" height="${BAR_H}" style="border-radius:6px">`
    + barSegments + '</svg>';

  // Shopping list
  const shopItems = items.flatMap(({ entry: e, plants }) => {
    const n = Math.ceil(plants);
    const base = e.sowIndoorMonth
      ? `${n}× <b>${e.name}</b> — Saatgut (Vorkultur ab ${MOLONG[e.sowIndoorMonth-1]})`
      : `${n}× <b>${e.name}</b> — Samen (Direktsaat ${MOLONG[e.sowOutdoorMonth-1]})`;
    return e.needsSupport ? [base, `&nbsp;&nbsp;↳ ${n} Rankhilfen / Stäbe für ${e.name}`] : [base];
  });
  shopItems.push('Anzuchterde + Töpfe, Etiketten, Schnur / Raffiabast');
  const shopHTML = shopItems.map(s => `<li>${s}</li>`).join('');

  const html = [
    '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8">',
    '<title>Gartenplan</title>',
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
    '<button class="pbtn np" onclick="window.print()">Als PDF speichern / Drucken</button>',
    '<div class="hdr">',
    '<div><div style="font-family:\'JetBrains Mono\',monospace;font-size:7pt;color:#888;text-transform:uppercase;letter-spacing:.1em;margin-bottom:3px">Ernterechner · Gartenplan</div>',
    `<h1>Mein Gartenplan</h1></div>`,
    `<div class="hdr-meta">Erstellt: ${today}<br>${persons} ${persons===1?'Person':'Personen'} · ${items.length} Sorten<br>${gardenArea ? `Garten: ${gardenArea} m²` : 'ernterechner.com'}</div>`,
    '</div>',
    '<div class="pills">',
    `<div class="pill"><div class="pl">Gesamtfläche</div><div class="pv">${totalArea.toFixed(1)} m²</div>${gardenArea?`<div class="ps">${Math.round(totalArea/gardenArea*100)}% belegt</div>`:''}</div>`,
    `<div class="pill"><div class="pl">Jahresertrag</div><div class="pv">${totalYield.toFixed(0)} kg</div><div class="ps">${(totalYield/52).toFixed(1)} kg/Woche</div></div>`,
    `<div class="pill"><div class="pl">Kalorien</div><div class="pv">${Math.round(totalKcal/1000)}k</div><div class="ps">kcal gesamt</div></div>`,
    `<div class="pill"><div class="pl">Versorgung</div><div class="pv">${daysPerPerson}</div><div class="ps">Tage/Person (2.200 kcal)</div></div>`,
    '</div>',
    '<h2>Pflanzenübersicht</h2>',
    '<table><thead><tr><th>Pflanze</th><th>Fläche</th><th>Anzahl</th><th>Abstand</th><th>Ertrag</th><th>Erntezeit</th><th>Lagerung</th></tr></thead>',
    `<tbody>${rows}</tbody></table>`,
    '<h2>Beetaufteilung &amp; Aussaatkalender</h2>',
    `<div style="margin-bottom:8px">${bedBarSVG}</div>`,
    '<div style="display:flex;gap:14px;margin-bottom:5px;font-size:7.5pt;font-family:\'DM Sans\',sans-serif">',
    '<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:2px;background:#4a90c4;display:inline-block"></span>Vorkultur</span>',
    '<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:2px;background:#6baa46;display:inline-block"></span>Wachstum</span>',
    '<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:2px;background:#f59e0b;display:inline-block"></span>Ernte</span>',
    '</div>',
    timelineSVG,
    '<div class="pb"></div>',
    '<h2>Aufgabenkalender</h2>',
    '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:8px;font-size:8pt">',
    '<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:#4a90c4;display:inline-block"></span>Vorkultur</span>',
    '<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:#6baa46;display:inline-block"></span>Auspflanzen/Säen</span>',
    '<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;display:inline-block"></span>Erntezeit</span>',
    '</div>',
    taskHTML,
    '<h2>Einkaufsliste</h2>',
    `<ul class="slist">${shopHTML}</ul>`,
    '<div class="footer"><span>Ernterechner · ernterechner.com</span>',
    '<span>Erträge: Heistinger "Handbuch Bio-Gemüse", fryd.app, LK NÖ · Richtwerte</span></div>',
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
  const pct = gardenArea ? Math.round((usedArea / gardenArea) * 100) : null;
  const pctColor = pct !== null ? (pct > 80 ? 'var(--c-red)' : pct > 50 ? 'var(--c-amber)' : 'var(--c-green)') : 'var(--c-green)';
  return (
    <div className="yield-config">
      <div>
        <div className="font-sans text-[13px] font-semibold text-text-muted mb-1.5">
          Haushaltsgröße
        </div>
        <div className="flex items-center gap-2.5">
          <input type="range" min={1} max={10} value={persons} onChange={e => setPersons(+e.target.value)}
            className="w-[100px] accent-water" />
          <span className="font-display text-[1.375rem] font-black text-water min-w-7">{persons}</span>
          <span className="font-mono text-xs text-text-muted">
            {persons === 1 ? 'Person' : 'Personen'}
          </span>
        </div>
      </div>

      <div>
        <div className="font-sans text-[13px] font-semibold text-text-muted mb-1.5">
          Verfügbare Gartenfläche (optional)
        </div>
        <div className="flex items-center gap-2">
          <input type="number" min={1} step={5}
            value={gardenArea ?? ''}
            placeholder="z.B. 200"
            onChange={e => setGardenArea(e.target.value ? +e.target.value : null)}
            className="w-20 py-1.25 px-2 rounded-[7px] bg-bg border border-[rgba(255,255,255,0.1)] text-amber font-mono text-sm outline-none" />
          <span className="font-mono text-xs text-text-muted">m²</span>
          {pct !== null && (
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-1.5 rounded-[3px] bg-[rgba(255,255,255,0.08)] overflow-hidden">
                <div className="h-full rounded-[3px] transition-[width] duration-300"
                  style={{ width: `${Math.min(100, pct)}%`, background: pctColor }} />
              </div>
              <span className="font-mono text-xs" style={{ color: pctColor }}>{pct}% belegt</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-50">
        <div className="font-sans text-[13px] font-semibold text-text-muted mb-1">Faustregel Selbstversorgung</div>
        <div className="font-sans text-xs text-text-muted leading-[1.5]">
          Für <strong className="text-text">{persons} {persons === 1 ? 'Person' : 'Personen'}</strong> werden ca. <strong className="text-amber">{persons * 50}–{persons * 80} m²</strong> Gemüsegarten empfohlen (Heistinger).
          Davon ca. <strong className="text-primary">⅓ Starkzehrer</strong> (Tomate, Kürbis), <strong className="text-water">⅓ Mittelzehrer</strong> (Karotte, Zwiebel), <strong className="text-text-muted">⅓ Schwachzehrer</strong> (Kräuter, Salat).
        </div>
      </div>
    </div>
  );
}

function PlantInfoBox({ entry }: { entry: YieldEntry }) {
  const wiki = WIKI_MAP.get(entry.plantId);
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
        {open ? 'Info schließen' : 'Anfänger-Info & Mischkultur'}
      </button>

      {open && (
        <div className="mt-2 bg-bg rounded-[10px] p-3.5 flex flex-col gap-2.5"
          style={{ border: `1px solid ${entry.color}33` }}
        >
          {wiki?.beginnerTip && (
            <div>
              <div className="font-sans text-[12px] font-semibold text-amber mb-1">Anfänger-Tipp</div>
              <div className="font-sans text-[13px] text-text leading-[1.6]">{wiki.beginnerTip}</div>
            </div>
          )}
          {wiki?.sowing && (
            <div>
              <div className="font-sans text-[12px] font-semibold text-text-muted mb-1">Aussaat / Pflanzung</div>
              <div className="font-sans text-xs text-text-muted leading-[1.5]">{wiki.sowing}</div>
              {wiki.planting && <div className="font-sans text-xs text-text-muted leading-[1.5] mt-0.5">{wiki.planting}</div>}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            {wiki?.partners && (
              <div className="rounded-lg p-[8px_10px] bg-[rgba(93,143,46,0.06)] border border-[rgba(93,143,46,0.2)]">
                <div className="font-sans text-[12px] font-semibold text-text-muted mb-1">Gute Nachbarn</div>
                <div className="font-sans text-xs text-text-muted leading-[1.5]">{wiki.partners}</div>
              </div>
            )}
            {wiki?.enemies && (
              <div className="rounded-lg p-[8px_10px] bg-[rgba(184,67,46,0.06)] border border-[rgba(184,67,46,0.2)]">
                <div className="font-sans text-[12px] font-semibold text-red mb-1">Schlechte Nachbarn</div>
                <div className="font-sans text-xs text-text-muted leading-[1.5]">{wiki.enemies}</div>
              </div>
            )}
          </div>
          {entry.successionalSowings > 1 && (
            <div className="rounded-lg p-[8px_10px] bg-[rgba(74,144,196,0.06)] border border-[rgba(74,144,196,0.2)]">
              <div className="font-sans text-[12px] font-semibold text-water mb-1">Staffelaussaat empfohlen</div>
              <div className="font-sans text-xs text-text-muted leading-[1.5]">
                {entry.name} profitiert von <strong className="text-water">{entry.successionalSowings} Aussaatrunden</strong> im Abstand von
                ca. {Math.round(entry.harvestWindowWeeks / entry.successionalSowings)} Wochen. So hast du statt einer kurzen Ernteflut
                einen <strong className="text-text">gleichmäßigen Ertrag über die ganze Saison</strong>.
                {entry.plantId === 'karotte' && ' Karotten ab März alle 3 Wochen nachsäen bis Juli = frische Karotten von Juni bis November.'}
                {entry.plantId === 'salat' && ' Salat alle 2 Wochen nachsäen = nie zu viel auf einmal.'}
                {entry.plantId === 'radieschen' && ' Radieschen alle 2 Wochen = immer 4 Wochen bis zur Ernte.'}
              </div>
            </div>
          )}
          {entry.successionalSowings === 1 && entry.harvestWindowWeeks < 8 && (
            <div className="rounded-lg p-[8px_10px] bg-[rgba(212,165,116,0.06)] border border-[rgba(212,165,116,0.2)]">
              <div className="font-sans text-[12px] font-semibold text-amber mb-1">Achtung: Kurzes Ernte­fenster</div>
              <div className="font-sans text-xs text-text-muted leading-[1.5]">
                {entry.name} hat nur <strong className="text-text">{entry.harvestWindowWeeks} Wochen</strong> Erntezeit.
                Wenn du viele Pflanzen gleichzeitig anziehst, bekommst du alles auf einmal, mehr als du frisch verwenden kannst.
                Besser: einige Wochen gestaffelt anziehen, oder den Rest einkochen/einfrieren.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RipeningDetail({ entry }: { entry: YieldEntry }) {
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
        {open ? 'Reife & Größe schließen' : 'Reife · Farben · Größe'}
      </button>

      {open && (
        <div className="mt-2 bg-bg rounded-[10px] p-3.5 flex flex-col gap-3"
          style={{ border: `1px solid ${entry.color}33` }}
        >
          {/* Timeline: erste Früchte → Vollreife */}
          <div>
            <div className="font-sans text-[12px] font-semibold text-text-muted mb-1.5">
              Reife-Zeitachse (Wochen ab Aussaat/Pflanzung)
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
                  1. Früchte W{firstFruitWeeks}
                </div>
                {/* Vollreife rechts */}
                <div className="absolute top-0 bottom-0 right-0 w-0.5"
                  style={{ background: entry.color }} />
                <div className="absolute right-1 inset-y-0 flex items-center font-mono text-[11px] font-bold"
                  style={{ color: entry.color }}>
                  Vollreif W{fullRipeWeeks}
                </div>
              </div>
            ) : (
              <div className="font-mono text-xs text-text-muted">
                Vollreif nach {fullRipeWeeks} Wochen (keine Detail-Daten hinterlegt)
              </div>
            )}
          </div>

          {/* Farb-/Reifephasen */}
          {stages.length > 0 && (
            <div>
              <div className="font-sans text-[12px] font-semibold text-text-muted mb-1.5">
                Farbphasen während der Reife
              </div>
              <div className="flex flex-col gap-1.5">
                {stages.map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full shrink-0 border"
                      style={{ background: s.hex, borderColor: 'rgba(255,255,255,0.15)' }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-[12px] text-text">{s.label}</div>
                      {s.description && (
                        <div className="font-sans text-[11px] text-text-muted leading-tight">{s.description}</div>
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
                Endgröße der Frucht
              </div>
              <div className="flex flex-wrap gap-1.5">
                {fs.lengthCm !== undefined && (
                  <span className="plant-tag">↕ {fs.lengthCm} cm lang</span>
                )}
                {fs.diameterCm !== undefined && (
                  <span className="plant-tag">⌀ {fs.diameterCm} cm</span>
                )}
                {fs.weightG !== undefined && (
                  <span className="plant-tag">{fs.weightG} g / Stück</span>
                )}
              </div>
              {fs.note && (
                <div className="font-sans text-[11px] text-text-muted mt-1.5 leading-snug">{fs.note}</div>
              )}
            </div>
          )}

          {/* Pflanzen-Endgröße */}
          <div>
            <div className="font-sans text-[12px] font-semibold text-text-muted mb-1.5">
              Pflanze ausgewachsen
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="plant-tag">Höhe {entry.heightCm} cm</span>
              <span className="plant-tag">Breite {entry.spreadCm} cm</span>
              <span className="plant-tag">{entry.growthForm}</span>
              {entry.needsSupport && <span className="plant-tag" style={{ color: 'var(--c-amber)' }}>Rankhilfe</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CalcField({ label, unit, value, color, active, onChange }: {
  label: string; unit: string; value: number; color: string; active: boolean;
  onChange: (v: number) => void;
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
          step={label.includes('Fläche') ? 0.5 : 1}
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
            <h3 className="font-sans text-[1.25rem] font-extrabold text-text m-0">{e.name}</h3>
          </div>
          <div className="font-mono text-xs text-text-muted mt-1">
            {(() => {
              const { firstFruitWeeks, fullRipeWeeks } = getRipeningTimeline(e);
              const hasDetail = e.weeksToFirstFruit !== undefined;
              return hasDetail
                ? `1. Früchte W${firstFruitWeeks} · Vollreif W${fullRipeWeeks}`
                : `${fullRipeWeeks} Wo. bis Ernte`;
            })()} · {e.spacingCm}cm Abstand · {e.successionalSowings > 1 ? `${e.successionalSowings}x Staffelaussaat empfohlen` : 'Einmalige Aussaat'}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {e.glashausYieldMultiplier && (
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={state.useGlashaus}
                onChange={ev => onUpdate(recalc(e, state.mode, glassVal, ev.target.checked))} />
              <span className="font-mono text-xs text-water">Glashaus +{Math.round((e.glashausYieldMultiplier - 1) * 100)}%</span>
            </label>
          )}
          <button onClick={onRemove} className="plant-remove-btn">×</button>
        </div>
      </div>

      <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <CalcField label="Fläche" unit="m²" value={state.areaM2} color="var(--c-cyan)" active={state.mode === 'area'}
          onChange={v => onUpdate(recalc(e, 'area', v, state.useGlashaus))} />
        <CalcField label="Pflanzen" unit="Stk" value={state.plants} color="var(--c-green)" active={state.mode === 'plants'}
          onChange={v => onUpdate(recalc(e, 'plants', v, state.useGlashaus))} />
        <CalcField label="Ertrag" unit="kg" value={state.yieldKg} color="var(--c-amber)" active={state.mode === 'yield'}
          onChange={v => onUpdate(recalc(e, 'yield', v, state.useGlashaus))} />
        <CalcField label="Kalorien" unit="kcal" value={state.kcal} color="var(--c-red)" active={state.mode === 'kcal'}
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
              {count} {count === 1 ? 'Pflanze' : 'Pflanzen'} · {state.areaM2.toFixed(1)} m²
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
        <span className="plant-tag">Spanne: {yieldRange.low.toFixed(1)}–{yieldRange.high.toFixed(1)} kg</span>
        <span className="plant-tag">{e.kcalPer100g} kcal/100g</span>
        <span className="plant-tag" style={{ color: e.storageMonths > 0 ? 'var(--c-green)' : undefined }}>
          {e.storageMonths > 0 ? `Lagert ${e.storageMonths} Mon.` : 'Nur frisch'}
        </span>
        <span className="plant-tag">{e.storageMethod}</span>
      </div>

      <RipeningDetail entry={e} />
      <PlantInfoBox entry={e} />
    </div>
  );
}

function PlantPicker({ onAdd, exclude }: { onAdd: (e: YieldEntry) => void; exclude: Set<string> }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('alle');
  const filtered = YIELD_DATA.filter(e =>
    !exclude.has(e.plantId) &&
    e.name.toLowerCase().includes(search.toLowerCase()) &&
    (cat === 'alle' || e.category === cat)
  );

  return (
    <div className="plant-picker">
      <div className="font-sans text-[13px] font-semibold text-text-muted mb-2">
        Pflanze hinzufügen
      </div>
      <div className="flex gap-1.5 mb-2.5 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Suchen..."
          className="flex-1 min-w-[140px] py-1.5 px-3 rounded-lg bg-bg border border-[rgba(255,255,255,0.1)] text-text font-sans text-[13px] outline-none" />
        {['alle', 'gemuese', 'salat', 'obst', 'kraeuter'].map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`font-mono text-xs py-[5px] px-2.5 rounded-md cursor-pointer border ${cat === c ? 'bg-[rgba(93,143,46,0.09)] text-primary border-[rgba(93,143,46,0.27)]' : 'bg-transparent text-text-muted border-[rgba(255,255,255,0.06)]'}`}
          >{c === 'alle' ? 'Alle' : c === 'gemuese' ? 'Gemüse' : c === 'salat' ? 'Salate' : c === 'obst' ? 'Obst' : 'Kräuter'}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {filtered.map(e => (
          <button key={e.plantId} onClick={() => onAdd(e)} className="plant-picker-item" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PlantIcon plant={resolveIconKey(e.plantId)} stage="reif" size={26} />
            <span className="font-sans text-xs text-text font-semibold">{e.name}</span>
            <span className="font-mono text-xs text-text-muted ml-1">{e.yieldKgPerM2Low}–{e.yieldKgPerM2High} kg/m²</span>
          </button>
        ))}
        {filtered.length === 0 && <span className="font-sans text-xs text-text-muted">Alle Pflanzen bereits ausgewählt</span>}
      </div>
    </div>
  );
}

export default function YieldCalculator() {
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
        <div className="font-mono text-[11px] text-text-muted tracking-[0.04em] mb-1.5">Planen</div>
        <h1 className="font-display text-text text-[2.25rem] font-bold m-0 mb-2 tracking-[-0.02em] leading-[1.1]">
          Ertragsrechner
        </h1>
        <p className="font-sans text-text-muted text-[13px] m-0 leading-[1.6] max-w-[680px]">
          Gib ein beliebiges Feld ein (Fläche, Pflanzenanzahl, kg Ertrag oder Kalorien) und der Rest wird automatisch berechnet.
          Klick auf <strong className="text-water">Anfänger-Info</strong> unter jeder Pflanze für Tipps zu Mischkultur, Staffelaussaat und häufigen Fehlern.
        </p>
      </div>

      <GardenConfig persons={persons} setPersons={setPersons} gardenArea={gardenArea} setGardenArea={setGardenArea} usedArea={totalArea} />

      {items.length > 0 && (
        <div className="yield-totals" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', alignItems: 'center' }}>
          <div>
            <div className="font-mono text-xs text-text-muted">Gesamtfläche</div>
            <div className="font-display text-[1.625rem] font-black text-text">{totalArea.toFixed(1)} <span className="text-sm text-text-muted">m²</span></div>
            {gardenArea && <div className="font-mono text-xs text-text-muted">{Math.round(totalArea / gardenArea * 100)}% deines Gartens</div>}
          </div>
          <div>
            <div className="font-mono text-xs text-primary">Gesamtertrag</div>
            <div className="font-display text-[1.625rem] font-black text-primary">{totalYield.toFixed(0)} <span className="text-sm">kg</span></div>
            <div className="font-mono text-xs text-text-muted">{(totalYield / 52).toFixed(1)} kg/Woche</div>
          </div>
          <div>
            <div className="font-mono text-xs text-amber">Kalorien gesamt</div>
            <div className="font-display text-[1.625rem] font-black text-amber">{Math.round(totalKcal).toLocaleString()}</div>
            <div className="font-mono text-xs text-text-muted">kcal</div>
          </div>
          <div>
            <div className="font-mono text-xs text-water">{persons} {persons === 1 ? 'Person' : 'Personen'}</div>
            <div className="font-display text-[1.625rem] font-black text-water">{Math.round(daysPerPerson)} <span className="text-sm">Tage</span></div>
            <div className="font-mono text-xs text-text-muted">à {kcalPerDay.toLocaleString()} kcal/Tag</div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => openPrintPlan(items, persons, gardenArea)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-sans text-[13px] font-semibold cursor-pointer transition-all"
              style={{ background: 'rgba(93,143,46,0.12)', border: '1px solid rgba(93,143,46,0.3)', color: 'var(--c-green)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v9M4 7l4 4 4-4M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              PDF / Drucken
            </button>
            <button
              onClick={() => setShowCode(o => !o)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-sans text-[13px] font-semibold cursor-pointer transition-all"
              style={{ background: showCode ? 'rgba(74,144,196,0.18)' : 'rgba(74,144,196,0.08)', border: `1px solid ${showCode ? 'rgba(74,144,196,0.45)' : 'rgba(74,144,196,0.2)'}`, color: 'var(--c-water)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M5 4l-3 4 3 4M11 4l3 4-3 4M9 2l-2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Plan-Code
            </button>
          </div>
        </div>
      )}

      {showCode && (
        <div className="mb-5 rounded-2xl p-4 flex flex-col gap-4" style={{ background: 'rgba(74,144,196,0.06)', border: '1px solid rgba(74,144,196,0.2)' }}>
          <div>
            <div className="font-sans text-[12px] font-semibold text-water mb-1.5">Dein Plan als Code</div>
            <div className="font-sans text-xs text-text-muted mb-2 leading-normal">
              Kopiere diesen Code um deinen Plan zu speichern oder zu teilen. Kein Login nötig — alles steckt im Code.
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
                Kopieren
              </button>
            </div>
          </div>
          <div>
            <div className="font-sans text-[12px] font-semibold text-text-muted mb-1.5">Plan importieren</div>
            <div className="flex gap-2 items-stretch">
              <textarea
                value={importInput}
                onChange={e => setImportInput(e.target.value)}
                placeholder="Plan-Code hier einfügen…"
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
                Laden
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
        Erträge: Heistinger "Handbuch Bio-Gemüse", fryd.app, LK NÖ · Kalorien: ÖNWT · Glashaus: HBLFA Schönbrunn · Tatsächliche Erträge variieren.
      </p>
    </div>
  );
}
