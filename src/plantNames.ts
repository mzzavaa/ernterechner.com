import { WIKI_PLANTS_EN } from './data/en/plants';
import { useLang, type Lang } from './i18n';

const WIKI_MAP_EN = new Map(WIKI_PLANTS_EN.map(p => [p.id, p]));

// English names for the few calculator-only crops the wiki doesn't cover.
const EXTRA_NAME_EN: Record<string, string> = {
  'kresse': 'Garden cress',
  'mini-snack-gurke': 'Mini snack cucumber',
  'pak-choi': 'Pak choi',
  'mairuebchen': 'May turnip',
  'fruehlingszwiebel': 'Spring onion',
};

// Localised display name for a plant: English wiki name when EN is active,
// German (the yieldData name) otherwise. German output stays identical.
export const plantName = (plantId: string, deName: string, lang: Lang) =>
  lang === 'en' ? (WIKI_MAP_EN.get(plantId)?.name ?? EXTRA_NAME_EN[plantId] ?? deName) : deName;

// Hook variant for components.
export function usePlantName() {
  const { lang } = useLang();
  return (e: { plantId: string; name: string }) => plantName(e.plantId, e.name, lang);
}
