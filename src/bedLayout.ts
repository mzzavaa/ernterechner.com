import { type YieldEntry } from './data/yieldData';

// ── Shared bed-layout engine ─────────────────────────────────────────────────
// Single source of truth for how the calculated plants are arranged in the
// bed: every visualisation renders THESE positions, so plant counts, spacing
// and zone sizes always match the calculator.
//
// Model: the bed is planted crop by crop along its length. Each crop forms
// rows across the bed width at its row spacing (as many rows as fit), and
// plants along the length at its in-row spacing. The zone length is whatever
// the crop's plant count actually needs at true spacing - the plan never
// squeezes plants closer than their data says.

export interface PlantPosition {
  xCm: number; // along the bed length, zone offset included
  yCm: number; // across the bed width
}

export interface ZonePlan {
  entry: YieldEntry;
  count: number;
  startCm: number;
  lengthCm: number;
  rows: number;
  cols: number;
  positions: PlantPosition[]; // exactly `count` entries
}

export interface BedPlan {
  zones: ZonePlan[];
  bedWidthCm: number;
  bedLengthCm: number;
  requiredLengthCm: number; // bed length the plan actually needs
  fits: boolean;
  overflowCm: number; // how much length is missing (0 when it fits)
  spareCm: number;    // unplanted length at the end (0 when overflowing)
}

export function computeBedPlan(
  plants: { entry: YieldEntry; count: number }[],
  bedWidthCm: number,
  bedLengthCm: number,
): BedPlan {
  let cursor = 0;
  const zones: ZonePlan[] = plants.map(({ entry, count }) => {
    // round(), not floor(): a 120 cm bed takes 2 tomato rows at 80 cm spacing
    // (rows sit in from the edge), matching real planting practice.
    const rows = Math.max(1, Math.round(bedWidthCm / entry.rowSpacingCm));
    const cols = Math.max(1, Math.ceil(count / rows));
    const lengthCm = cols * entry.spacingCm;
    const rowPitch = bedWidthCm / rows;

    // Column-major fill: the last (partial) column sits at the zone's end.
    const positions: PlantPosition[] = [];
    for (let c = 0; c < cols && positions.length < count; c++) {
      for (let r = 0; r < rows && positions.length < count; r++) {
        positions.push({
          xCm: cursor + (c + 0.5) * entry.spacingCm,
          yCm: (r + 0.5) * rowPitch,
        });
      }
    }

    const zone: ZonePlan = { entry, count, startCm: cursor, lengthCm, rows, cols, positions };
    cursor += lengthCm;
    return zone;
  });

  const requiredLengthCm = Math.round(cursor);
  return {
    zones,
    bedWidthCm,
    bedLengthCm,
    requiredLengthCm,
    fits: requiredLengthCm <= bedLengthCm,
    overflowCm: Math.max(0, requiredLengthCm - bedLengthCm),
    spareCm: Math.max(0, bedLengthCm - requiredLengthCm),
  };
}
