import YieldCalculator from './components/YieldCalculator';
import { UnitToggle } from './units';
import { LangToggle, useT } from './i18n';
import { WIKI_URL } from './links';
import './index.css';

export default function App() {
  const t = useT();
  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: 'var(--c-bg)' }}>
      <header className="app-header">
        <div className="app-header__inner">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--c-green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2c3 4 6 5 6 9a6 6 0 0 1-12 0c0-4 3-5 6-9z" />
            <path d="M12 11v9" />
          </svg>
          <span style={{ fontFamily: 'var(--f-title)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--c-text)' }}>
            Ernterechner
          </span>
          <span className="app-header__subtitle font-mono">
            {t('Gemüsegarten · Ertrag & Beetplanung', 'Vegetable garden · Yield & bed planning')}
          </span>
          <div className="app-header__tools">
            <UnitToggle />
            <LangToggle />
          </div>
        </div>
      </header>

      <main style={{ flex: 1, width: '100%', maxWidth: 1400, margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
        <YieldCalculator />
      </main>

      <footer style={{ borderTop: '1px solid var(--c-border)', background: 'var(--c-bg-soft)' }}>
        <div
          style={{ maxWidth: 1400, margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' }}
          className="font-sans"
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--c-sub)' }}>
            {t(
              'Ernterechner · Richtwerte für den Hausgarten · Erträge variieren je nach Standort, Boden und Witterung.',
              'Ernterechner · Reference values for the home garden · Yields vary by location, soil and weather.'
            )}
          </span>
          <a
            href={WIKI_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.72rem', color: 'var(--c-green-mid)', textDecoration: 'none' }}
          >
            {t('Pflanzenwissen im Garten-Wiki', 'Plant knowledge in the Garden Wiki')} →
          </a>
        </div>
      </footer>
    </div>
  );
}
