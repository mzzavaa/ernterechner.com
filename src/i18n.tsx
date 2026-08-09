import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Lang = 'de' | 'en';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const Ctx = createContext<LangCtx>({ lang: 'de', setLang: () => {}, toggle: () => {} });

function initialLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q === 'en' || q === 'de') return q;
    const stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'de') return stored;
    if (navigator.language && navigator.language.toLowerCase().startsWith('en')) return 'en';
  } catch { /* ignore */ }
  return 'de';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('lang', l); } catch { /* ignore */ }
    // Reflect the language in the URL query WITHOUT touching the hash route,
    // so switching never changes your page and a shared link keeps its language.
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', l);
      window.history.replaceState(null, '', url.toString());
    } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(() => setLang(lang === 'de' ? 'en' : 'de'), [lang, setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <Ctx.Provider value={{ lang, setLang, toggle }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

/**
 * Pick the string for the active language.
 * `L('Gemüse', 'Vegetables')` → German by default, English when the toggle is on.
 * If no English is supplied yet, it falls back to the German text (so the site is
 * never blank while content is still being translated).
 */
export function useT() {
  const { lang } = useLang();
  return (de: string, en?: string) => (lang === 'en' ? (en ?? de) : de);
}

/** Language toggle button. */
export function LangToggle({ style }: { style?: React.CSSProperties }) {
  const { lang, setLang } = useLang();
  const btn = (l: Lang, label: string) => (
    <button
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      style={{
        border: 'none',
        background: lang === l ? 'var(--c-green)' : 'transparent',
        color: lang === l ? '#0d1117' : 'var(--c-sub)',
        fontFamily: 'var(--f-mono)',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        padding: '3px 8px',
        borderRadius: 6,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
  return (
    <div
      style={{ display: 'inline-flex', gap: 2, padding: 2, borderRadius: 8, background: 'rgba(255,255,255,0.06)', ...style }}
      role="group"
      aria-label="Language"
    >
      {btn('de', 'DE')}
      {btn('en', 'EN')}
    </div>
  );
}
