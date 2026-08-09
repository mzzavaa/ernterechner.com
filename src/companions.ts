import { WIKI_PLANTS } from './data/wiki';

// ── Companion-planting checks (Mischkultur) ──────────────────────────────────
// The wiki lists partners and enemies per plant as free-text German strings
// ("Basilikum, Petersilie, Tagetes", "Kartoffel, Fenchel, ..."). To judge a
// pair we tokenise those strings and match tokens against the other plant's
// German names in both directions ("Bohne" must match "Buschbohne").

interface CompanionInfo {
  names: string[];       // German display names to match against
  partnersRaw: string;
  enemiesRaw: string;
  partnerTokens: string[];
  enemyTokens: string[];
}

const norm = (s: string) => s.toLowerCase().replace(/[äÄ]/g, 'ä').trim();

// Split a partners/enemies string into plant-name tokens, dropping notes.
// "Zwiebel (Möhrenfliege!), Lauch + Tomate" -> ['zwiebel', 'lauch', 'tomate']
function tokens(raw: string): string[] {
  return raw
    .replace(/\([^)]*\)/g, ' ')
    .split(/[,+/·]| und | oder /)
    .map(t => norm(t).replace(/[^a-zäöüß\- ]/g, ' ').trim())
    .flatMap(t => (t.includes(' ') ? [t, ...t.split(' ')] : [t]))
    .filter(t => t.length >= 4);
}

const INFO = new Map<string, CompanionInfo>(
  WIKI_PLANTS.map(p => {
    const names = [p.name, ...(p.nameAlt ? p.nameAlt.split('/') : [])]
      .map(n => norm(n.replace(/\([^)]*\)/g, '')))
      .filter(Boolean);
    return [p.id, {
      names,
      partnersRaw: p.partners ?? '',
      enemiesRaw: p.enemies ?? '',
      partnerTokens: tokens(p.partners ?? ''),
      enemyTokens: tokens(p.enemies ?? ''),
    }];
  }),
);

// Token <-> name match in either containment direction ("bohne" ⊂ "buschbohne").
const tokenMatchesName = (token: string, name: string) =>
  token.length >= 4 && name.length >= 4 && (name.includes(token) || token.includes(name));

function listed(listTokens: string[], other: CompanionInfo): boolean {
  return listTokens.some(tok => other.names.some(n => tokenMatchesName(tok, n)));
}

export type CompanionStatus = 'good' | 'bad' | 'neutral' | 'unknown';

export interface CompanionVerdict {
  status: CompanionStatus;
  /** The wiki's own wording backing the verdict (German source text). */
  note?: string;
}

/** Judge a plant pair from the wiki's partner/enemy lists (checked both ways). */
export function companionVerdict(aId: string, bId: string): CompanionVerdict {
  const a = INFO.get(aId);
  const b = INFO.get(bId);
  if (!a || !b) return { status: 'unknown' };
  // Enemies win over partners - a single warning is worth surfacing.
  if (listed(a.enemyTokens, b)) return { status: 'bad', note: a.enemiesRaw };
  if (listed(b.enemyTokens, a)) return { status: 'bad', note: b.enemiesRaw };
  if (listed(a.partnerTokens, b) || listed(b.partnerTokens, a)) return { status: 'good' };
  return { status: 'neutral' };
}
