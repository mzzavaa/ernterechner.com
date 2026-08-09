import { useState, useEffect, useMemo } from 'react';
import { type YieldEntry } from '../data/yieldData';
import { PLANT_VISUAL_MAP, getPlantStage, lerpColor } from '../data/plantVisuals';
import { PlantIcon, getPlantDataUri, resolveIconKey, type Stage } from '../icons/plant-icons/PlantIcon.tsx';
import { useFormat, type Format } from '../units';
import { useT, useLang } from '../i18n';
import { WIKI_PLANTS_EN } from '../data/en/plants';
import { VARIETY_NAME_EN, VARIETY_DESC_EN } from '../data/en/varieties';

const WIKI_MAP_EN = new Map(WIKI_PLANTS_EN.map(p => [p.id, p]));

// Localised plant display name: English wiki name when EN is active, German otherwise.
function usePlantName() {
  const { lang } = useLang();
  return (e: { plantId: string; name: string }) =>
    lang === 'en' ? (WIKI_MAP_EN.get(e.plantId)?.name ?? e.name) : e.name;
}

// Localised variety name + description. Proper-noun cultivar names fall through
// unchanged (they carry no VARIETY_NAME_EN entry); German descriptors translate.
function useVariety() {
  const { lang } = useLang();
  return {
    vname: (n?: string) => (lang === 'en' ? (n && VARIETY_NAME_EN[n]) || n || '' : n ?? ''),
    vdesc: (d?: string) => (lang === 'en' ? (d && VARIETY_DESC_EN[d]) || d || '' : d ?? ''),
  };
}

// "L × W" dimension label sharing one length unit (metric identical to raw cm).
const dimPair = (fmt: Format, lCm: number, wCm: number) =>
  fmt.imperial
    ? `${fmt.lenVal(lCm).toFixed(1)} × ${fmt.lenVal(wCm).toFixed(1)} in`
    : `${lCm} × ${wCm} cm`;
// SVG-style length annotation with no space (metric identical to `${x}cm`).
const svgLen = (fmt: Format, cm: number) =>
  fmt.imperial ? `${fmt.lenVal(cm).toFixed(1)}in` : `${Math.round(cm)}cm`;

const MONTHS_DE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const MONTHS_LONG_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Localised calendar labels: month names + the week prefix ("KW 33" / "Week 33").
function useCal() {
  const { lang } = useLang();
  return {
    mo: lang === 'en' ? MONTHS_EN : MONTHS_DE,
    moLong: lang === 'en' ? MONTHS_LONG_EN : MONTHS_LONG_DE,
    kw: lang === 'en' ? 'Week' : 'KW',
  };
}

interface VisPlant {
  entry: YieldEntry;
  count: number;
  areaM2: number;
  selectedVarietyIdx: number;
}

// ── Dot-grid scatter view ─────────────────────────────────────────────────
function DotGridView({ plants, bedWidthCm, bedLengthCm, cursorWeek }: {
  plants: VisPlant[];
  bedWidthCm: number;
  bedLengthCm: number;
  cursorWeek: number;
}) {
  const fmt = useFormat();
  const t = useT();
  const pname = usePlantName();
  const cal = useCal();
  const PAD_L = 30;
  const PAD_B = 18;
  const SVG_W = 580;
  const plotW = SVG_W - PAD_L;
  const scale = plotW / bedLengthCm;
  const plotH = Math.min(bedWidthCm * scale, 250);
  const svgH = plotH + PAD_B;
  const totalArea = plants.reduce((s, p) => s + p.areaM2, 0);

  const cursorMonthFrac = cursorWeek / 4.33;

  const { dots, dividerXs } = useMemo(() => {
    const result: { cx: number; cy: number; color: string; plantId: string; iconStage: Stage; iconSize: number; plantFraction: number; phase: string }[] = [];
    const divs: number[] = [];
    let curZoneX = 0;

    for (let i = 0; i < plants.length; i++) {
      const plant = plants[i];
      const e = plant.entry;
      const vis = PLANT_VISUAL_MAP.get(e.plantId);
      const stage = getPlantStage(e.sowIndoorMonth, e.sowOutdoorMonth, e.harvestStartMonth, e.harvestEndMonth, cursorMonthFrac);
      const zoneW = totalArea > 0 ? (plant.areaM2 / totalArea) * plotW : plotW / plants.length;

      const fruitRipe = vis?.varieties[plant.selectedVarietyIdx]?.fruitColor ?? vis?.fruitColor ?? e.color;
      const leafColor = vis?.leafColor ?? '#5D8F2E';
      const dotColor = stage.phase === 'dormant'
        ? 'rgba(255,255,255,0.15)'
        : stage.phase === 'harvest' ? fruitRipe : leafColor;

      const iconStage: Stage = stage.phase === 'dormant' ? 'aussaat'
        : stage.phase === 'indoor' ? 'keimling'
        : stage.phase === 'growing' ? 'jungpflanze'
        : 'reif'; // harvest + past both show reif (past fades via opacity)

      const spacingPx = Math.max(6, e.spacingCm * scale);
      const rowSpacingPx = Math.max(6, e.rowSpacingCm * scale);

      // Try natural spacing first
      const naturalDots: typeof result = [];
      let py = rowSpacingPx / 2;
      while (py <= plotH && naturalDots.length < 800) {
        let px = spacingPx / 2;
        while (px <= zoneW - spacingPx * 0.25 && naturalDots.length < 800) {
          const sz = Math.max(8, Math.min(36, spacingPx * 0.85, rowSpacingPx * 0.85));
          naturalDots.push({ cx: PAD_L + curZoneX + px, cy: py, color: dotColor, plantId: e.plantId, iconStage, iconSize: sz, plantFraction: stage.plantFraction, phase: stage.phase });
          px += spacingPx;
        }
        py += rowSpacingPx;
      }

      if (naturalDots.length >= plant.count) {
        result.push(...naturalDots.slice(0, plant.count));
      } else {
        // Fallback: even grid to always show the configured count
        const cols = Math.max(1, Math.round(Math.sqrt(plant.count * (zoneW / Math.max(1, plotH)))));
        const rows = Math.ceil(plant.count / cols);
        const cellW = zoneW / cols;
        const cellH = plotH / rows;
        const sz = Math.max(8, Math.min(36, cellW * 0.75, cellH * 0.75));
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (r * cols + c >= plant.count) break;
            result.push({
              cx: PAD_L + curZoneX + cellW * c + cellW / 2,
              cy: cellH * r + cellH / 2,
              color: dotColor, plantId: e.plantId, iconStage, iconSize: sz, plantFraction: stage.plantFraction, phase: stage.phase,
            });
          }
        }
      }

      curZoneX += zoneW;
      if (i < plants.length - 1) divs.push(PAD_L + curZoneX);
    }

    return { dots: result, dividerXs: divs };
  }, [plants, cursorWeek, totalArea, plotW, scale, plotH]); // eslint-disable-line react-hooks/exhaustive-deps

  const gridStepCm = bedLengthCm > 400 ? 100 : 50;
  const gridStepCmY = bedWidthCm > 150 ? 50 : 25;

  let curLabelX = 0;
  const zoneLabels = plants.map(p => {
    const zoneW = totalArea > 0 ? (p.areaM2 / totalArea) * plotW : plotW / plants.length;
    const labelX = PAD_L + curLabelX + zoneW / 2;
    curLabelX += zoneW;
    return { x: labelX, name: pname(p.entry), color: PLANT_VISUAL_MAP.get(p.entry.plantId)?.fruitColor ?? p.entry.color };
  });

  return (
    <div>
      <div className="font-sans text-[13px] font-semibold text-amber mb-1.5">
        {t('Pflanzenpositionen', 'Plant positions')} · {cal.kw} {cursorWeek + 1} · {cal.moLong[Math.min(11, Math.floor(cursorMonthFrac))]} ({dimPair(fmt, bedLengthCm, bedWidthCm)})
      </div>
      <svg viewBox={`0 0 ${SVG_W} ${svgH}`} className="w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-bg" style={{ maxHeight: 320 }}>
        {Array.from({ length: Math.floor(bedLengthCm / gridStepCm) + 1 }).map((_, i) => (
          <line key={`gx${i}`} x1={PAD_L + i * gridStepCm * scale} y1={0} x2={PAD_L + i * gridStepCm * scale} y2={plotH}
            stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(bedWidthCm / gridStepCmY) + 1 }).map((_, i) => (
          <line key={`gy${i}`} x1={PAD_L} y1={i * gridStepCmY * scale} x2={PAD_L + plotW} y2={i * gridStepCmY * scale}
            stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
        ))}
        {dividerXs.map((x, i) => (
          <line key={i} x1={x} y1={0} x2={x} y2={plotH}
            stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="4,3" />
        ))}
        <rect x={PAD_L} y={0} width={plotW} height={plotH} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
        {dots.map((d, i) => {
          const uri = getPlantDataUri(d.plantId, d.iconStage);
          // dormant: show tiny seed at 12% size; growing: scale by plantFraction
          const scaledSize = Math.max(d.phase === 'dormant' ? 5 : 4, d.iconSize * Math.max(0.12, d.plantFraction));
          const half = scaledSize / 2;
          // bottom-anchor: soil level = cy + iconSize/2 (fixed); plant grows upward
          const soilY = d.cy + d.iconSize / 2;
          const opacity = d.phase === 'past' ? Math.max(0.15, d.plantFraction * 0.8)
            : d.phase === 'dormant' ? 0.4
            : d.plantFraction < 0.15 ? 0.35 : 0.92;
          return uri ? (
            <image key={i} href={uri} x={d.cx - half} y={soilY - scaledSize} width={scaledSize} height={scaledSize} opacity={opacity} />
          ) : (
            <circle key={i} cx={d.cx} cy={d.cy} r={Math.max(1.5, half * 0.6)} fill={d.color} opacity={opacity} />
          );
        })}
        {Array.from({ length: Math.floor(bedLengthCm / gridStepCm) + 1 }).map((_, i) => (
          <text key={i} x={PAD_L + i * gridStepCm * scale} y={plotH + 13}
            fontSize={7} fill="rgba(255,255,255,0.3)" textAnchor="middle" fontFamily="monospace">{i * gridStepCm}</text>
        ))}
        <text x={PAD_L + plotW} y={plotH + 13} fontSize={6} fill="rgba(255,255,255,0.18)" textAnchor="end" fontFamily="monospace">cm</text>
        {Array.from({ length: Math.floor(bedWidthCm / gridStepCmY) + 1 }).map((_, i) => (
          <text key={i} x={PAD_L - 4} y={i * gridStepCmY * scale + 3}
            fontSize={7} fill="rgba(255,255,255,0.3)" textAnchor="end" fontFamily="monospace">{i * gridStepCmY}</text>
        ))}
        {zoneLabels.map((z, i) => (
          <text key={i} x={z.x} y={plotH - 5}
            fontSize={8} fill={z.color} textAnchor="middle" fontFamily="monospace" opacity={0.65} fontWeight="bold">{z.name}</text>
        ))}
      </svg>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {plants.map(p => {
          const stage = getPlantStage(p.entry.sowIndoorMonth, p.entry.sowOutdoorMonth, p.entry.harvestStartMonth, p.entry.harvestEndMonth, cursorMonthFrac);
          const phaseLabel = stage.phase === 'dormant' ? t('ruhend', 'dormant') : stage.phase === 'harvest' ? t('erntereif', 'ready to harvest') : stage.phase === 'indoor' ? t('Vorkultur', 'indoor start') : stage.phase === 'past' ? t('verblüht', 'spent') : t('wächst', 'growing');
          return (
            <div key={p.entry.plantId} className="flex items-center gap-1.5">
              <PlantIcon plant={resolveIconKey(p.entry.plantId)} stage={stage.phase === 'dormant' ? 'aussaat' : stage.phase === 'indoor' ? 'keimling' : stage.phase === 'growing' ? 'jungpflanze' : 'reif'} size={20} />
              <span className="font-mono text-[11px] text-text">{pname(p.entry)}</span>
              <span className="font-mono text-[11px] text-text-muted">{p.count}x · {phaseLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Top-down bed view: proportional zones, stage-aware rendering ──────────
function BedTopView({ plants, bedWidthCm, bedLengthCm, cursorWeek, onVarietyChange }: {
  plants: VisPlant[];
  bedWidthCm: number;
  bedLengthCm: number;
  cursorWeek: number;
  onVarietyChange: (plantIdx: number, varIdx: number) => void;
}) {
  const fmt = useFormat();
  const t = useT();
  const pname = usePlantName();
  const cal = useCal();
  const { vname, vdesc } = useVariety();
  const svgW = 560;
  const scale = svgW / bedLengthCm;
  const svgH = Math.max(100, bedWidthCm * scale);
  const totalArea = plants.reduce((s, p) => s + p.areaM2, 0);

  const zones = useMemo(() => {
    let curX = 0;
    return plants.map(p => {
      const zoneW = totalArea > 0 ? (p.areaM2 / totalArea) * svgW : svgW / plants.length;
      const z = { x: curX, w: zoneW, plant: p };
      curX += zoneW;
      return z;
    });
  }, [plants, totalArea]);

  return (
    <div>
      <div className="font-sans text-[13px] font-semibold text-amber mb-1.5">
        {t('Draufsicht', 'Top view')} · {cal.kw} {cursorWeek + 1} · {cal.moLong[Math.min(11, Math.floor(cursorWeek / 4.33))]} ({dimPair(fmt, bedLengthCm, bedWidthCm)})
      </div>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-bg" style={{ maxHeight: 280 }}>
        {Array.from({ length: Math.floor(bedLengthCm / 50) + 1 }).map((_, i) => (
          <line key={`gx${i}`} x1={i * 50 * scale} y1={0} x2={i * 50 * scale} y2={svgH} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(bedWidthCm / 50) + 1 }).map((_, i) => (
          <line key={`gy${i}`} x1={0} y1={i * 50 * scale} x2={svgW} y2={i * 50 * scale} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
        ))}

        {zones.map(({ x, w, plant }) => {
          const e = plant.entry;
          const vis = PLANT_VISUAL_MAP.get(e.plantId);
          const stage = getPlantStage(e.sowIndoorMonth, e.sowOutdoorMonth, e.harvestStartMonth, e.harvestEndMonth, cursorWeek / 4.33);

          if (stage.phase === 'dormant') {
            return (
              <g key={e.plantId}>
                <rect x={x} y={0} width={w} height={svgH} fill={e.color} opacity={0.02} />
                <line x1={x} y1={0} x2={x} y2={svgH} stroke={e.color} strokeWidth={0.5} opacity={0.15} />
                <text x={x + w / 2} y={svgH / 2} fontSize={9} fill={e.color} textAnchor="middle" fontFamily="monospace" opacity={0.4}>
                  {pname(e)}
                </text>
                <text x={x + w / 2} y={svgH / 2 + 12} fontSize={7} fill="var(--c-sub)" textAnchor="middle" fontFamily="monospace" opacity={0.4}>
                  {t('noch nicht ausgesät', 'not sown yet')}
                </text>
              </g>
            );
          }

          const leafColor = vis?.leafColor ?? '#3a7a2a';
          const leafColorDark = vis?.leafColorDark ?? '#1a5a1a';
          const fruitRipe = vis?.varieties[plant.selectedVarietyIdx]?.fruitColor ?? vis?.fruitColor ?? e.color;
          const fruitUnripe = vis?.fruitUnripeColor ?? '#3a7a2a';
          const currentFruitColor = lerpColor(fruitUnripe, fruitRipe, stage.ripenessFraction);

          const plantSpacing = e.spacingCm * scale;
          const rowSpacing = e.rowSpacingCm * scale;
          const baseRadius = Math.max(4, Math.min((e.spreadCm / 2) * scale * 0.9, plantSpacing * 0.48, rowSpacing * 0.48));
          const radius = baseRadius * stage.plantFraction;

          const fruitSizePx = vis ? Math.max(2, (vis.fruitSizeCm / e.spreadCm) * baseRadius * 2) : 4;
          const fruitR = Math.max(1.5, fruitSizePx * 0.5 * stage.plantFraction);

          const positions: { px: number; py: number }[] = [];
          let py = rowSpacing / 2;
          while (py + radius <= svgH && positions.length < 200) {
            let px = x + plantSpacing / 2;
            while (px + radius <= x + w && positions.length < 200) {
              positions.push({ px, py });
              px += plantSpacing;
            }
            py += rowSpacing;
          }

          const showFruits = stage.fruitFraction > 0 && !vis?.isLeafCrop && !vis?.fruitBelowGround;
          const showRootTip = stage.fruitFraction > 0 && vis?.fruitBelowGround;

          const displayLeafColor = (vis?.isLeafCrop && stage.phase === 'harvest')
            ? lerpColor(leafColor, vis?.fruitColor ?? leafColor, stage.ripenessFraction * 0.4)
            : leafColor;

          return (
            <g key={e.plantId}>
              <rect x={x} y={0} width={w} height={svgH} fill={displayLeafColor} opacity={0.03} />
              <line x1={x} y1={0} x2={x} y2={svgH} stroke={displayLeafColor} strokeWidth={0.5} opacity={0.2} />

              {positions.map((pos, i) => {
                if (radius < 1) return null;
                const fruitSeeds: { fx: number; fy: number }[] = [];
                if (showFruits && stage.fruitFraction > 0) {
                  const fruitCount = Math.max(1, Math.round((vis?.fruitCount ?? 4) * stage.fruitFraction));
                  const fr = radius * 0.55;
                  for (let fi = 0; fi < fruitCount && fi < 12; fi++) {
                    const angle = (fi / fruitCount) * Math.PI * 2;
                    fruitSeeds.push({ fx: pos.px + Math.cos(angle) * fr, fy: pos.py + Math.sin(angle) * fr });
                  }
                }

                return (
                  <g key={i}>
                    <circle cx={pos.px + 1} cy={pos.py + 1} r={radius} fill={leafColorDark} opacity={0.3} />
                    <circle cx={pos.px} cy={pos.py} r={radius} fill={displayLeafColor} opacity={0.75} />
                    <circle cx={pos.px - radius * 0.2} cy={pos.py - radius * 0.2} r={radius * 0.35} fill={displayLeafColor} opacity={0.5} />
                    <circle cx={pos.px} cy={pos.py} r={Math.max(1.5, radius * 0.12)} fill={leafColorDark} opacity={0.8} />
                    {fruitSeeds.map((f, fi) => (
                      <g key={fi}>
                        <circle cx={f.fx + 0.5} cy={f.fy + 0.5} r={fruitR} fill={currentFruitColor} opacity={0.3} />
                        <circle cx={f.fx} cy={f.fy} r={fruitR} fill={currentFruitColor} opacity={0.9} stroke={lerpColor(currentFruitColor, '#000000', 0.3)} strokeWidth={0.5} />
                      </g>
                    ))}
                    {showRootTip && (
                      <ellipse cx={pos.px} cy={pos.py + radius * 0.6} rx={fruitR} ry={fruitR * 2} fill={currentFruitColor} opacity={0.7} />
                    )}
                  </g>
                );
              })}

              <rect x={x + 2} y={svgH - 18} width={w - 4} height={16} fill="var(--c-bg)" opacity={0.7} rx={3} />
              <text x={x + w / 2} y={svgH - 7} fontSize={9} fill={vis?.fruitColor ?? e.color} textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                {pname(e)} {stage.phase === 'indoor' ? t('(Vorkultur)', '(indoor start)') : ''}
              </text>
            </g>
          );
        })}

        <rect x={svgW - 6 - 50 * scale} y={10} width={50 * scale} height={2} fill="var(--c-text)" opacity={0.35} />
        <text x={svgW - 6 - 25 * scale} y={9} fontSize={8} fill="var(--c-sub)" textAnchor="middle" fontFamily="monospace">{svgLen(fmt, 50)}</text>
      </svg>

      <div className="flex flex-wrap gap-1.5 mt-2">
        {plants.map((p, zoneIdx) => {
          const vis = PLANT_VISUAL_MAP.get(p.entry.plantId);
          if (!vis || vis.varieties.length <= 1) return (
            <div key={p.entry.plantId} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-[rgba(255,255,255,0.2)]" style={{ background: vis?.fruitColor ?? p.entry.color }} />
              <span className="font-mono text-[11px] text-text">{pname(p.entry)} ({p.count}x)</span>
            </div>
          );
          return (
            <div key={p.entry.plantId} className="flex items-center gap-1 flex-wrap">
              <span className="font-mono text-[11px] text-text-muted">{pname(p.entry)}:</span>
              {vis.varieties.map((v, vi) => (
                <button key={vi} onClick={() => onVarietyChange(zoneIdx, vi)} title={vdesc(v.description)}
                  className="w-3.5 h-3.5 rounded-full cursor-pointer p-0 shrink-0"
                  style={{
                    background: v.fruitColor,
                    border: `2px solid ${vi === p.selectedVarietyIdx ? 'var(--c-text)' : 'transparent'}`,
                    outline: vi === p.selectedVarietyIdx ? '1px solid rgba(255,255,255,0.3)' : 'none',
                    outlineOffset: 1,
                  }}
                />
              ))}
              <span className="font-mono text-[11px] text-text">{vname(vis.varieties[p.selectedVarietyIdx]?.name)}</span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-1.5 flex-wrap">
        {[
          { color: '#3a7a2a', label: t('Laub (immer grün)', 'Foliage (always green)') },
          { color: 'var(--c-cyan)', label: t('Frucht unreif', 'Fruit unripe') },
          { color: 'var(--c-amber)', label: t('Frucht reifend', 'Fruit ripening') },
          { color: 'var(--c-red)', label: t('Frucht erntereif', 'Fruit ready to harvest') },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="font-mono text-[11px] text-text-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Side view ─────────────────────────────────────────────────────────────
function SideView({ plants, cursorWeek }: { plants: VisPlant[]; cursorWeek: number }) {
  const fmt = useFormat();
  const t = useT();
  const pname = usePlantName();
  const cal = useCal();
  const maxH = Math.max(...plants.map(p => p.entry.heightCm), 50);
  const svgW = 400;
  const svgH = 200;
  const barGap = 8;
  const barW = Math.min(60, (svgW - barGap * (plants.length + 1)) / plants.length);
  const hScale = (svgH - 40) / maxH;

  return (
    <div>
      <div className="font-sans text-[13px] font-semibold text-amber mb-1.5">
        {t('Seitenansicht', 'Side view')} · {cal.kw} {cursorWeek + 1} · {cal.mo[Math.min(11, Math.floor(cursorWeek / 4.33))]}
      </div>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-bg" style={{ maxHeight: 200 }}>
        <line x1={0} y1={svgH - 20} x2={svgW} y2={svgH - 20} stroke="#4a3728" strokeWidth={3} />
        <rect x={0} y={svgH - 20} width={svgW} height={20} fill="#3d2b1f" opacity={0.5} />
        {[50, 100, 150, 200].filter(h => h <= maxH).map(h => (
          <g key={h}>
            <line x1={0} y1={svgH - 20 - h * hScale} x2={svgW} y2={svgH - 20 - h * hScale} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} strokeDasharray="4,4" />
            <text x={4} y={svgH - 22 - h * hScale} fontSize={7} fill="var(--c-sub)" fontFamily="monospace">{svgLen(fmt, h)}</text>
          </g>
        ))}
        {plants.map((p, i) => {
          const e = p.entry;
          const vis = PLANT_VISUAL_MAP.get(e.plantId);
          const stage = getPlantStage(e.sowIndoorMonth, e.sowOutdoorMonth, e.harvestStartMonth, e.harvestEndMonth, cursorWeek / 4.33);
          const leafColor = vis?.leafColor ?? '#3a7a2a';
          const x = barGap + i * (barW + barGap) + barW / 2;
          const fullH = e.heightCm * hScale;
          const h = fullH * stage.plantFraction;
          const baseY = svgH - 20;

          const iconStage: Stage = stage.phase === 'dormant' ? 'aussaat'
            : stage.phase === 'indoor' ? 'keimling'
            : stage.phase === 'growing' ? 'jungpflanze'
            : 'reif';
          const uri = getPlantDataUri(e.plantId, iconStage);

          // Dormant: seed icon centered at soil line, visible
          if (stage.phase === 'dormant') {
            const seedUri = getPlantDataUri(e.plantId, 'aussaat');
            const seedSz = Math.min(barW * 0.8, 22);
            return (
              <g key={e.plantId}>
                {seedUri && <image href={seedUri} x={x - seedSz / 2} y={baseY - seedSz * 0.75} width={seedSz} height={seedSz} opacity={0.7} />}
                <text x={x} y={baseY + 14} fontSize={7} fill="var(--c-sub)" textAnchor="middle" fontFamily="monospace" opacity={0.6}>{pname(e)}</text>
              </g>
            );
          }

          if (h < 2) return (
            <g key={e.plantId}>
              <text x={x} y={baseY + 14} fontSize={7} fill="var(--c-sub)" textAnchor="middle" fontFamily="monospace" opacity={0.4}>{pname(e)}</text>
            </g>
          );

          const isPast = stage.phase === 'past';
          const imgOpacity = isPast ? Math.max(0.15, stage.plantFraction * 0.8) : 0.92;
          // The icon canvas is 64px with its soil line at y=54. Render a SQUARE
          // image (matching the square viewBox, so no preserveAspectRatio
          // alignment is involved - WebKit and Blink resolve it differently for
          // intrinsic-size-less SVGs) sized so the above-soil part of the icon
          // equals the plant's scaled height, and anchor its soil line on baseY.
          const iconSide = Math.max(16, Math.min(h * (64 / 54), barW * 1.5));
          const iconY = baseY - iconSide * (54 / 64);

          return (
            <g key={e.plantId}>
              {uri ? (
                <image
                  href={uri}
                  x={x - iconSide / 2}
                  y={iconY}
                  width={iconSide}
                  height={iconSide}
                  opacity={imgOpacity}
                  style={isPast ? { filter: 'sepia(0.6) saturate(0.4)' } : undefined}
                />
              ) : (
                <ellipse cx={x} cy={baseY - h / 2} rx={Math.min(barW * 0.4, h * 0.3)} ry={h / 2} fill={leafColor} opacity={isPast ? 0.25 : 0.45} stroke={leafColor} strokeWidth={1} />
              )}
              <text x={x} y={baseY + 14} fontSize={7} fill={isPast ? 'var(--c-sub)' : 'var(--c-text)'} textAnchor="middle" fontFamily="monospace" opacity={isPast ? 0.5 : 1}>{pname(e)}</text>
              {!isPast && <text x={x} y={Math.min(iconY, baseY - h) - 3} fontSize={7} fill={leafColor} textAnchor="middle" fontFamily="monospace">{svgLen(fmt, e.heightCm * stage.plantFraction)}</text>}
              {isPast && stage.plantFraction > 0.1 && <text x={x} y={Math.min(iconY, baseY - h) - 3} fontSize={6} fill="var(--c-sub)" textAnchor="middle" fontFamily="monospace" opacity={0.5}>{t('verblüht', 'spent')}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Timeline ──────────────────────────────────────────────────────────────
function GrowthTimeline({ plants, cursorWeek, setCursorWeek }: {
  plants: VisPlant[];
  cursorWeek: number;
  setCursorWeek: (w: number) => void;
}) {
  const fmt = useFormat();
  const t = useT();
  const pname = usePlantName();
  const cal = useCal();
  const mFrac = cursorWeek / 4.33;
  const m = mFrac + 1;
  const cursorMonthIdx = Math.min(11, Math.floor(mFrac));

  const harvestableNow = plants.filter(p => m >= p.entry.harvestStartMonth && m <= p.entry.harvestEndMonth);
  const indoorNow = plants.filter(p => p.entry.sowIndoorMonth && m >= p.entry.sowIndoorMonth && m < p.entry.sowOutdoorMonth);
  const growingNow = plants.filter(p => m >= p.entry.sowOutdoorMonth && m < p.entry.harvestStartMonth);

  return (
    <div className="bg-card rounded-xl px-4 pt-4 pb-3 border border-[rgba(255,255,255,0.07)]">
      <div className="font-sans text-[13px] font-semibold text-amber mb-3">
        {t('Aussaat bis Ernte', 'Sowing to harvest')}
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[11px] text-text-muted uppercase whitespace-nowrap">{t('Woche', 'Week')}:</span>
          <input type="range" min={0} max={51} value={cursorWeek}
            onChange={e => setCursorWeek(+e.target.value)}
            className="flex-1 accent-amber" />
          <span className="font-display text-[1.125rem] font-bold text-amber" style={{ minWidth: 130 }}>
            {cal.kw} {cursorWeek + 1} · {cal.moLong[cursorMonthIdx]}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg p-[8px_10px] bg-[rgba(93,143,46,0.07)] border border-[rgba(93,143,46,0.2)]">
            <div className="font-mono text-[11px] text-text-muted uppercase mb-1">{t('Erntereif', 'Ready to harvest')} · {cal.mo[cursorMonthIdx]}</div>
            {harvestableNow.length === 0
              ? <div className="font-sans text-[11px] text-text-muted">{t('Nichts erntereif', 'Nothing ready')}</div>
              : harvestableNow.map(p => {
                const kgPerWeek = ((p.entry.yieldKgPerM2Low + p.entry.yieldKgPerM2High) / 2 / p.entry.harvestWindowWeeks * p.areaM2);
                return (
                  <div key={p.entry.plantId} className="flex items-center gap-1 mb-0.5">
                    <PlantIcon plant={resolveIconKey(p.entry.plantId)} stage="reif" size={16} />
                    <span className="font-sans text-[11px] text-text">{pname(p.entry)}</span>
                    <span className="font-mono text-[11px] text-text-muted ml-auto">~{fmt.weightVal(kgPerWeek).toFixed(1)} {fmt.weightUnit}/{t('Wo', 'wk')}</span>
                  </div>
                );
              })
            }
          </div>
          <div className="rounded-lg p-[8px_10px] bg-[rgba(74,144,196,0.06)] border border-[rgba(74,144,196,0.13)]">
            <div className="font-mono text-[11px] text-water uppercase mb-1">{t('Vorkultur drinnen', 'Indoor start')}</div>
            {indoorNow.length === 0
              ? <div className="font-sans text-[11px] text-text-muted">{t('Nichts', 'Nothing')}</div>
              : indoorNow.map(p => (
                <div key={p.entry.plantId} className="font-sans text-[11px] text-text mb-0.5">
                  {pname(p.entry)} · {t('ab', 'plant out from')} {cal.mo[p.entry.sowOutdoorMonth - 1]} {t('auspflanzen', '')}
                </div>
              ))
            }
          </div>
          <div className="rounded-lg p-[8px_10px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
            <div className="font-mono text-[11px] text-text-muted uppercase mb-1">{t('Wächst draußen', 'Growing outdoors')}</div>
            {growingNow.length === 0
              ? <div className="font-sans text-[11px] text-text-muted">{t('Nichts', 'Nothing')}</div>
              : growingNow.map(p => {
                const e = p.entry;
                const stage = getPlantStage(e.sowIndoorMonth, e.sowOutdoorMonth, e.harvestStartMonth, e.harvestEndMonth, mFrac);
                const weeksLeft = Math.round((e.harvestStartMonth - m) * 4.3);
                return (
                  <div key={e.plantId} className="font-sans text-[11px] text-text mb-0.5">
                    {pname(e)} <span className="font-mono text-[11px] text-text-muted">({Math.round(stage.plantFraction * 100)}% · ~{Math.max(0, weeksLeft)} {t('Wo. bis Ernte', 'wk to harvest')})</span>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>

      <div className="grid mb-1" style={{ gridTemplateColumns: '110px 1fr' }}>
        <div />
        <div className="grid grid-cols-12">
          {cal.mo.map((mo, i) => (
            <div key={i} onClick={() => setCursorWeek(Math.round(i * 4.33))}
              className={`font-mono text-[8px] tracking-tight sm:text-[11px] sm:tracking-normal text-center pb-0.75 cursor-pointer overflow-hidden border-b-2 ${i === cursorMonthIdx ? 'text-amber font-bold border-amber' : 'text-text-muted font-normal border-transparent'}`}
            >{mo}</div>
          ))}
        </div>
      </div>

      {plants.map(p => {
        const e = p.entry;
        const vis = PLANT_VISUAL_MAP.get(e.plantId);
        const rows = [{ offset: 0, label: e.successionalSowings > 1 ? t('1. Saat', '1st sowing') : '' }];
        if (e.successionalSowings > 1) {
          const intervalMonths = Math.round(e.harvestWindowWeeks / e.successionalSowings / 4.3);
          for (let s = 1; s < Math.min(e.successionalSowings, 3); s++) {
            rows.push({ offset: s * intervalMonths, label: `${s + 1}. ${t('Saat', 'sowing')}` });
          }
        }

        return (
          <div key={e.plantId} className={e.successionalSowings > 1 ? 'mb-0.5' : 'mb-1.5'}>
            {rows.map((row, rowIdx) => {
              const off = row.offset;
              return (
                <div key={rowIdx} className="grid mb-0.5 items-center" style={{ gridTemplateColumns: '110px 1fr' }}>
                  <div className="pr-2">
                    {rowIdx === 0 && (
                      <div className="font-sans text-xs font-bold text-text whitespace-nowrap overflow-hidden text-ellipsis">
                        {pname(e)}
                      </div>
                    )}
                    {row.label && <div className="font-mono text-[11px] text-text-muted">{row.label}</div>}
                  </div>
                  <div className="grid grid-cols-12 gap-0.5">
                    {Array.from({ length: 12 }).map((_, month) => {
                      const mm = month + 1;
                      const isIndoor = e.sowIndoorMonth && mm >= (e.sowIndoorMonth + off) && mm < (e.sowOutdoorMonth + off);
                      const isGrowth = mm >= (e.sowOutdoorMonth + off) && mm < (e.harvestStartMonth + off);
                      const harvestShift = Math.min(off, 2);
                      const isHarvest = mm >= (e.harvestStartMonth + off + harvestShift) && mm <= Math.min(12, e.harvestEndMonth + off);
                      const isCursor = month === cursorMonthIdx;
                      const fruitColor = vis?.varieties[p.selectedVarietyIdx]?.fruitColor ?? vis?.fruitColor ?? e.color;

                      let bg = 'transparent', borderColor = 'transparent', label = '';
                      if (isIndoor) { bg = '#4A90C430'; borderColor = '#4A90C455'; }
                      else if (isGrowth) { bg = (vis?.leafColor ?? '#3a7a2a') + '40'; borderColor = (vis?.leafColor ?? '#3a7a2a') + '66'; }
                      else if (isHarvest) { bg = fruitColor + '70'; borderColor = fruitColor; label = t('E', 'H'); }

                      const hasContent = isIndoor || isGrowth || isHarvest;
                      return (
                        <div key={month} onClick={() => setCursorWeek(Math.round(month * 4.33))}
                          className="h-5 cursor-pointer rounded-[3px] flex items-center justify-center"
                          style={{
                            background: hasContent ? bg : isCursor ? 'rgba(255,255,255,0.03)' : 'transparent',
                            border: `1px solid ${isCursor ? '#D4A57466' : hasContent ? borderColor : 'transparent'}`,
                            outline: isCursor ? '1px solid #D4A57455' : 'none',
                            outlineOffset: -1,
                          }}
                        >
                          {label && <span className="font-mono text-[7px] text-text font-bold">{label}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      <div className="flex gap-3.5 mt-2.5 pt-2.5 border-t border-[rgba(255,255,255,0.06)] flex-wrap">
        {[
          { bg: '#4A90C430', border: '#4A90C455', label: t('Vorkultur', 'Indoor start') },
          { bg: '#3a7a2a40', border: '#3a7a2a66', label: t('Wächst (grün)', 'Growing (green)') },
          { bg: '#D4A57470', border: '#D4A574', label: t('Erntezeit (E)', 'Harvest time (H)') },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-4 h-2.5 rounded-[3px]" style={{ background: item.bg, border: `1px solid ${item.border}` }} />
            <span className="font-mono text-[11px] text-text-muted">{item.label}</span>
          </div>
        ))}
        <span className="font-mono text-[11px] text-text-muted opacity-60">{t('Gestaffelte Reihen = Staffelaussaat', 'Staggered rows = succession sowing')}</span>
      </div>
    </div>
  );
}

// ── Plant info panel ──────────────────────────────────────────────────────
function PlantInfoPanel({ entry, selectedVarietyIdx }: { entry: YieldEntry; selectedVarietyIdx: number }) {
  const fmt = useFormat();
  const t = useT();
  const pname = usePlantName();
  const { vname, vdesc } = useVariety();
  const vis = PLANT_VISUAL_MAP.get(entry.plantId);
  const variety = vis?.varieties[selectedVarietyIdx];
  return (
    <div className="bg-card rounded-xl p-4" style={{ border: `2px solid ${(vis?.fruitColor ?? entry.color)}33` }}>
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: (vis?.leafColor ?? '#3a7a2a') + '22' }}>
          <PlantIcon plant={resolveIconKey(entry.plantId)} stage="reif" size={44} />
        </div>
        <div>
          <h4 className="font-sans text-[1.125rem] font-extrabold text-text m-0">{pname(entry)}</h4>
          {variety && <div className="font-mono text-[11px]" style={{ color: vis?.fruitColor ?? entry.color }}>{vname(variety.name)} · {vdesc(variety.description)}</div>}
        </div>
      </div>
      {vis && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {vis.varieties.map((v, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-bg px-2 py-1 rounded-md">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-[rgba(255,255,255,0.15)]" style={{ background: v.fruitColor }} />
              <span className="font-sans text-[11px] text-text">{vname(v.name)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { l: t('Höhe', 'Height'), v: fmt.len(entry.heightCm), c: 'var(--c-text)' },
          { l: t('Abstand', 'Spacing'), v: fmt.len(entry.spacingCm), c: 'var(--c-cyan)' },
          { l: t('Pfl/m²', 'plants/m²'), v: `${entry.plantsPerM2}`, c: 'var(--c-green)' },
          { l: t('Ertrag', 'Yield'), v: fmt.densityRange(entry.yieldKgPerM2Low, entry.yieldKgPerM2High), c: 'var(--c-amber)' },
          { l: t('Ernte', 'Harvest'), v: `${entry.weeksToHarvest} ${t('Wo.', 'wk')}`, c: 'var(--c-red)' },
          { l: t('Lagerung', 'Storage'), v: entry.storageMonths > 0 ? `${entry.storageMonths} ${t('Mon.', 'mo.')}` : t('Nur frisch', 'Fresh only'), c: entry.storageMonths > 0 ? 'var(--c-green)' : 'var(--c-sub)' },
        ].map((d, i) => (
          <div key={i} className="bg-bg rounded-lg p-[6px_8px]">
            <div className="font-mono text-[11px] text-text-muted">{d.l}</div>
            <div className="font-sans text-[13px] font-bold" style={{ color: d.c }}>{d.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function BedVisualizer({ plants }: { plants: { entry: YieldEntry; areaM2: number }[] }) {
  const fmt = useFormat();
  const t = useT();
  const pname = usePlantName();
  const cal = useCal();
  const { vname } = useVariety();
  // Bed dimensions stay internally in cm (SVG geometry); only the input display converts.
  const bedVal = (cm: number) => fmt.imperial ? Math.round(fmt.lenVal(cm) * 10) / 10 : cm;
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [bedWidth, setBedWidth] = useState(120);
  const [bedLength, setBedLength] = useState(300);
  const now = new Date();
  const [cursorWeek, setCursorWeek] = useState(() => Math.min(51, Math.floor((now.getMonth() * 4.33) + now.getDate() / 7)));
  const [viewTab, setViewTab] = useState<'dots' | 'zones'>('dots');
  const [visPlants, setVisPlants] = useState<VisPlant[]>(() =>
    plants.map(p => ({ entry: p.entry, count: Math.max(1, Math.round(p.areaM2 * p.entry.plantsPerM2)), areaM2: p.areaM2, selectedVarietyIdx: 0 }))
  );

  const plantsKey = plants.map(p => p.entry.plantId + p.areaM2).join(',');
  useEffect(() => {
    setVisPlants(prev => plants.map(p => {
      const existing = prev.find(vp => vp.entry.plantId === p.entry.plantId);
      return {
        entry: p.entry,
        count: Math.max(1, Math.round(p.areaM2 * p.entry.plantsPerM2)),
        areaM2: p.areaM2,
        selectedVarietyIdx: existing?.selectedVarietyIdx ?? 0,
      };
    }));
  }, [plantsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVarietyChange = (plantIdx: number, varIdx: number) => {
    setVisPlants(prev => prev.map((p, i) => i === plantIdx ? { ...p, selectedVarietyIdx: varIdx } : p));
  };

  if (visPlants.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 text-center">
        <p className="font-sans text-sm text-text-muted">{t('Füge oben Pflanzen hinzu um die Visualisierung zu sehen.', 'Add plants above to see the visualisation.')}</p>
      </div>
    );
  }

  const selectedPlant = visPlants.find(p => p.entry.plantId === selectedPlantId);

  return (
    <div className="harvest-card">
      <div className="font-display text-[1.25rem] font-bold text-text mb-3.5 tracking-[-0.01em]">
        {t('Beetvisualisierung', 'Bed visualisation')}
      </div>

      <div className="flex gap-4 mb-4 items-center flex-wrap">
        <div className="flex gap-2 items-center">
          <div className="font-mono text-xs text-amber uppercase">{t('Beet', 'Bed')}:</div>
          <label className="flex items-center gap-1">
            <span className="font-mono text-xs text-text-muted">{t('B', 'W')}</span>
            <input type="number" value={bedVal(bedWidth)} min={60} max={200} step={10} onChange={e => setBedWidth(Math.round(fmt.lenToMetric(parseFloat(e.target.value))) || 120)}
              className="w-12.5 py-0.75 px-1.25 rounded-[5px] bg-bg border border-[rgba(255,255,255,0.1)] font-mono text-xs text-amber outline-none" />
            <span className="font-mono text-xs text-text-muted">{fmt.lenUnit} ×</span>
          </label>
          <label className="flex items-center gap-1">
            <span className="font-mono text-xs text-text-muted">L</span>
            <input type="number" value={bedVal(bedLength)} min={100} max={600} step={50} onChange={e => setBedLength(Math.round(fmt.lenToMetric(parseFloat(e.target.value))) || 300)}
              className="w-12.5 py-0.75 px-1.25 rounded-[5px] bg-bg border border-[rgba(255,255,255,0.1)] font-mono text-xs text-amber outline-none" />
            <span className="font-mono text-xs text-text-muted">{fmt.lenUnit}</span>
          </label>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-50">
          <span className="font-mono text-[11px] text-text-muted whitespace-nowrap">{cal.kw}:</span>
          <input type="range" min={0} max={51} value={cursorWeek} onChange={e => setCursorWeek(+e.target.value)}
            className="flex-1 accent-amber" />
          <span className="font-display text-base font-bold text-amber" style={{ minWidth: 130 }}>
            {cal.kw} {cursorWeek + 1} · {cal.moLong[Math.min(11, Math.floor(cursorWeek / 4.33))]}
          </span>
        </div>
      </div>

      <div className="flex gap-1 mb-3">
        {([['dots', t('Pflanzen', 'Plants')], ['zones', t('Beetskizze', 'Bed sketch')]] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setViewTab(tab)}
            className={`bed-view-tab${viewTab === tab ? ' bed-view-tab--active' : ''}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        {viewTab === 'dots'
          ? <DotGridView plants={visPlants} bedWidthCm={bedWidth} bedLengthCm={bedLength} cursorWeek={cursorWeek} />
          : <BedTopView plants={visPlants} bedWidthCm={bedWidth} bedLengthCm={bedLength} cursorWeek={cursorWeek} onVarietyChange={handleVarietyChange} />
        }
      </div>

      <div className="mb-4">
        <SideView plants={visPlants} cursorWeek={cursorWeek} />
      </div>

      <div className="mb-4">
        <GrowthTimeline plants={visPlants} cursorWeek={cursorWeek} setCursorWeek={setCursorWeek} />
      </div>

      <div className={`flex flex-wrap gap-2 ${selectedPlant ? 'mb-3' : 'mb-0'}`}>
        {visPlants.map((p, zoneIdx) => {
          const vis = PLANT_VISUAL_MAP.get(p.entry.plantId);
          const fruitColor = vis?.varieties[p.selectedVarietyIdx]?.fruitColor ?? vis?.fruitColor ?? p.entry.color;
          const isSelected = selectedPlantId === p.entry.plantId;
          const hasVarieties = vis && vis.varieties.length > 1;
          return (
            <div key={p.entry.plantId} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
              style={{ background: isSelected ? fruitColor + '18' : 'var(--c-bg)', border: `1px solid ${isSelected ? fruitColor + '66' : 'rgba(255,255,255,0.06)'}` }}>
              <button onClick={() => setSelectedPlantId(isSelected ? null : p.entry.plantId)}
                className="flex items-center gap-1.5 cursor-pointer" style={{ background: 'none', border: 'none', padding: 0 }}>
                <PlantIcon plant={resolveIconKey(p.entry.plantId)} stage="reif" size={20} />
                <span className="font-sans text-xs text-text">{pname(p.entry)}</span>
                <span className="font-mono text-[11px] text-text-muted">{p.count}x</span>
              </button>
              {hasVarieties && (
                <div className="flex gap-1 ml-1 pl-1.5 border-l border-[rgba(255,255,255,0.1)]">
                  {vis.varieties.map((v, vi) => (
                    <button key={vi} onClick={() => handleVarietyChange(zoneIdx, vi)} title={vname(v.name)}
                      className="w-3.5 h-3.5 rounded-full cursor-pointer p-0 shrink-0"
                      style={{
                        background: v.fruitColor,
                        border: `2px solid ${vi === p.selectedVarietyIdx ? 'var(--c-text)' : 'transparent'}`,
                        outline: vi === p.selectedVarietyIdx ? '1px solid rgba(255,255,255,0.3)' : 'none',
                        outlineOffset: 1,
                      }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedPlant && (
        <PlantInfoPanel entry={selectedPlant.entry} selectedVarietyIdx={selectedPlant.selectedVarietyIdx} />
      )}
    </div>
  );
}
