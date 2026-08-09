import { createContext, useContext, useState, useCallback, type ReactNode, type CSSProperties } from 'react';

// ── Unit system ────────────────────────────────────────────────────────────
export type UnitSystem = 'metric' | 'imperial';

// Exact conversion factors (internal math always stays METRIC)
const M2_TO_FT2 = 10.7639;   // 1 m²  = 10.7639 ft²
const CM_TO_IN = 0.393701;   // 1 cm  = 0.393701 in
const KG_TO_LB = 2.20462;    // 1 kg  = 2.20462 lb
const DENSITY = 0.204816;    // kg/m² → lb/ft²  (value × 0.204816)

const num = (v: number) => (Number.isFinite(v) ? v : 0);

// ── Persistence + URL sync ─────────────────────────────────────────────────
function readInitial(): UnitSystem {
  if (typeof window === 'undefined') return 'metric';
  try {
    const q = new URLSearchParams(window.location.search).get('units');
    if (q === 'metric' || q === 'imperial') return q;
    const ls = window.localStorage.getItem('units');
    if (ls === 'metric' || ls === 'imperial') return ls;
  } catch { /* ignore */ }
  return 'metric';
}

function persist(u: UnitSystem) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('units', u);
    // Reflect in ?units= without touching other query params or the hash.
    const url = new URL(window.location.href);
    url.searchParams.set('units', u);
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  } catch { /* ignore */ }
}

interface UnitCtx {
  units: UnitSystem;
  setUnits: (u: UnitSystem) => void;
  toggle: () => void;
}

const Ctx = createContext<UnitCtx | null>(null);

export function UnitProvider({ children }: { children: ReactNode }) {
  const [units, setUnitsState] = useState<UnitSystem>(readInitial);

  const setUnits = useCallback((u: UnitSystem) => {
    setUnitsState(u);
    persist(u);
  }, []);

  const toggle = useCallback(() => {
    setUnitsState(prev => {
      const next: UnitSystem = prev === 'metric' ? 'imperial' : 'metric';
      persist(next);
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ units, setUnits, toggle }}>{children}</Ctx.Provider>;
}

export function useUnits(): UnitCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useUnits must be used within a UnitProvider');
  return ctx;
}

// ── Formatter ──────────────────────────────────────────────────────────────
export interface Format {
  imperial: boolean;
  area: (m2: number) => string;
  areaVal: (m2: number) => number;
  areaToMetric: (v: number) => number;
  len: (cm: number) => string;
  lenVal: (cm: number) => number;
  lenToMetric: (v: number) => number;
  weight: (kg: number) => string;
  weightVal: (kg: number) => number;
  weightToMetric: (v: number) => number;
  density: (kgPerM2: number) => string;
  densityVal: (kgPerM2: number) => number;
  densityRange: (low: number, high: number) => string;
  areaUnit: string;
  lenUnit: string;
  weightUnit: string;
}

export function useFormat(): Format {
  const { units } = useUnits();
  const imperial = units === 'imperial';

  return {
    imperial,

    area: (m2) => imperial ? `${(num(m2) * M2_TO_FT2).toFixed(1)} ft²` : `${num(m2).toFixed(1)} m²`,
    areaVal: (m2) => imperial ? num(m2) * M2_TO_FT2 : num(m2),
    areaToMetric: (v) => imperial ? num(v) / M2_TO_FT2 : num(v),

    len: (cm) => imperial ? `${(num(cm) * CM_TO_IN).toFixed(1)} in` : `${Math.round(num(cm))} cm`,
    lenVal: (cm) => imperial ? num(cm) * CM_TO_IN : num(cm),
    lenToMetric: (v) => imperial ? num(v) / CM_TO_IN : num(v),

    weight: (kg) => imperial ? `${(num(kg) * KG_TO_LB).toFixed(1)} lb` : `${num(kg).toFixed(1)} kg`,
    weightVal: (kg) => imperial ? num(kg) * KG_TO_LB : num(kg),
    weightToMetric: (v) => imperial ? num(v) / KG_TO_LB : num(v),

    density: (kgPerM2) => imperial ? `${(num(kgPerM2) * DENSITY).toFixed(2)} lb/ft²` : `${kgPerM2} kg/m²`,
    densityVal: (kgPerM2) => imperial ? num(kgPerM2) * DENSITY : num(kgPerM2),
    densityRange: (low, high) => imperial
      ? `${(num(low) * DENSITY).toFixed(2)}–${(num(high) * DENSITY).toFixed(2)} lb/ft²`
      : `${low}–${high} kg/m²`,

    areaUnit: imperial ? 'ft²' : 'm²',
    lenUnit: imperial ? 'in' : 'cm',
    weightUnit: imperial ? 'lb' : 'kg',
  };
}

// ── Toggle control (segmented) ─────────────────────────────────────────────
export function UnitToggle() {
  const { units, setUnits } = useUnits();
  const btn = (active: boolean): CSSProperties => ({
    fontFamily: 'var(--f-mono)',
    fontSize: '0.7rem',
    lineHeight: 1,
    padding: '5px 10px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    background: active ? 'var(--c-green)' : 'transparent',
    color: active ? 'var(--c-bg)' : 'var(--c-sub)',
    fontWeight: active ? 700 : 500,
    transition: 'background 0.12s, color 0.12s',
  });
  return (
    <div
      style={{
        display: 'inline-flex',
        gap: 2,
        padding: 2,
        borderRadius: 8,
        border: '1px solid var(--c-border)',
        background: 'var(--c-bg)',
      }}
    >
      <button
        type="button"
        onClick={() => setUnits('metric')}
        title="Metrisch (cm, m², kg)"
        style={btn(units === 'metric')}
      >
        cm
      </button>
      <button
        type="button"
        onClick={() => setUnits('imperial')}
        title="Imperial (in, ft², lb)"
        style={btn(units === 'imperial')}
      >
        in
      </button>
    </div>
  );
}
