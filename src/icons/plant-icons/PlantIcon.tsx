import type { CSSProperties } from 'react';
import { PLANT_ICONS, PLANT_META, STAGES } from './data.js';

export type Stage = 'aussaat' | 'keimling' | 'jungpflanze' | 'reif';

export interface PlantIconProps {
  plant: string;
  stage: Stage;
  size?: number;
  color?: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

type StageEntry = { key: string; label: string };

const STAGE_KEYS: Stage[] = (STAGES as StageEntry[]).map((s) => s.key as Stage);

// Fruit-family palette tokens. Overriding them (plus their dark strokes)
// recolors the fruit in any icon while leaving foliage, soil and flowers
// untouched - used to reflect the selected variety's color.
const FRUIT_TOKENS = ['red', 'orange', 'yellow', 'purple', 'pink'] as const;

function darkenHex(hex: string, f = 0.42): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return hex;
  const ch = (shift: number) => Math.round(((n >> shift) & 255) * (1 - f));
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`;
}

// CSS vars must live INSIDE the SVG document: data-URI <img> content cannot
// see the page's custom properties.
function fruitTint(color: string): string {
  const dark = darkenHex(color);
  const vars = FRUIT_TOKENS.map(tk => `--pi-${tk}:${color};--pi-${tk}-dark:${dark};`).join('');
  return `<style>:root{${vars}}</style>`;
}

function toDataUri(inner: string, color?: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">${color ? fruitTint(color) : ''}${inner}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function PlantIcon({ plant, stage, size = 48, color, title, className, style }: PlantIconProps) {
  const icons = PLANT_ICONS as Record<string, Partial<Record<Stage, string>>>;
  const meta = PLANT_META as Record<string, { name: string }>;
  const inner = icons[plant]?.[stage];
  if (!inner) return null;
  const stageLabel = (STAGES as StageEntry[]).find((s) => s.key === stage)?.label ?? stage;
  const a11yTitle = title ?? `${meta[plant]?.name ?? plant} · ${stageLabel}`;
  return (
    <img
      src={toDataUri(inner, color)}
      width={size}
      height={size}
      alt={a11yTitle}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    />
  );
}

export function PlantGrowthRow({ plant, size = 48, gap = 12, className, style }: {
  plant: string;
  size?: number;
  gap?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className} style={{ display: 'inline-flex', gap, alignItems: 'flex-end', ...style }}>
      {STAGE_KEYS.map((stage) => (
        <PlantIcon key={stage} plant={plant} stage={stage} size={size} />
      ))}
    </div>
  );
}

export const STAGE_LABELS: Record<Stage, string> = {
  aussaat: 'Aussaat',
  keimling: 'Keimling',
  jungpflanze: 'Jungpflanze',
  reif: 'Erntereif',
};

export const PLANT_ICON_KEY: Record<string, string> = {
  bohne:             'buschbohne',
  sellerie:          'knollensellerie',
  fenchel:           'knollenfenchel',
  'mini-snack-gurke': 'minigurke',
  'pak-choi':         'pakchoi',
};

export function resolveIconKey(plantId: string): string {
  return PLANT_ICON_KEY[plantId] ?? plantId;
}

export function getPlantDataUri(plant: string, stage: Stage, color?: string): string | null {
  const icons = PLANT_ICONS as Record<string, Partial<Record<Stage, string>>>;
  const inner = icons[resolveIconKey(plant)]?.[stage];
  if (!inner) return null;
  return toDataUri(inner, color);
}

export default PlantIcon;
