# Ernterechner

Interaktiver **Ertragsrechner** und **Beetvisualisierung** für den Gemüsegarten.
Berechne aus einer beliebigen Eingabe – Fläche, Pflanzenanzahl, Ertrag (kg) oder
Kalorien – automatisch alle übrigen Werte, und visualisiere die Beete als
Draufsicht, Seitenansicht und Wachstums-Zeitplan über die ganze Saison.

Die Ertragsrichtwerte gelten für den mitteleuropäischen Hausgarten
(Österreich-/Pannonien-Bezug). Tatsächliche Erträge variieren je nach Standort,
Boden und Witterung.

## Features

- **Ertragsrechner** – Fläche ⇄ Pflanzen ⇄ kg ⇄ Kalorien, für beliebig viele Kulturen
- **Selbstversorgungs-Faustregel** nach Haushaltsgröße
- **Beetvisualisierung** – Pflanzenpositionen, Beetskizze, Seitenansicht (Höhenprofil), Aussaat-bis-Ernte-Zeitplan
- **Sorten-Farbvarianten** und Glashaus-Ertragsbonus
- **PDF / Druck** eines fertigen Gartenplans inkl. Aussaatkalender und Einkaufsliste
- **Plan-Code** zum Speichern/Teilen ohne Login

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Reine statische Single-Page-App – kein Backend, keine Anmeldung, keine Datenerfassung

## Entwicklung

```bash
npm install
npm run dev        # Dev-Server
npm run build      # Produktionsbuild nach dist/
npm run preview    # Build lokal ansehen
```

## Deployment

Automatisch via GitHub Actions (`.github/workflows/deploy.yml`) auf **GitHub Pages**
bei jedem Push auf `main`.

- Aktiviere in den Repository-Einstellungen unter **Settings → Pages** die Quelle
  **GitHub Actions**.
- Für die eigene Domain: `public/CNAME` enthält `ernterechner.com`. Der DNS-Eintrag
  (`CNAME`/`ALIAS` auf `mzzavaa.github.io` bzw. die Pages-A-Records) muss beim
  Domain-Anbieter gesetzt sein. Ohne eigene Domain funktioniert die Seite dank
  relativer Pfade auch unter `https://mzzavaa.github.io/ernterechner.com/`.

## Herkunft

Herausgelöst aus dem privaten `garden-hub`-Projekt als eigenständige, öffentliche
Anwendung. Enthält ausschließlich allgemeines Pflanz- und Ertragswissen – keine
personenbezogenen Daten, Adressen oder Standortdetails.
