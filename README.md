# Hérault ban tracker

Static dashboard tracking administrative, criminal and indemnity proceedings arising from
prefectural bans of demonstrations in Hérault, October–November 2026.

Same layout and toolchain as `french-protest-charts`: esbuild bundles `src/client/main.ts`
into a static file served by a zero-dependency Node server from `docs/`.

    npm install
    npm start          # → http://127.0.0.1:3000

## Structure

    docs/                  static output (index.html, styles.css, bundle.js)
    src/client/
      canvas.ts            Chart.js registration + instance registry
      chart.ts             timeline, deadline-pressure, status-mix renderers
      data.ts              the ledger: processes, deadlines, triggers, references
      dom.ts               element helpers + date maths
      episodes.ts          the five waves of the autumn 2026 sequence
      i18n.ts              EN/FR strings
      lang.ts              language resolution + persistence
      main.ts              entry point
      model.ts             types, derived status, urgency ranking
      notes.ts             caveats and unverified flags
      page.ts              DOM construction and filter state
      sources.ts           primary-source links
    server.ts              static file server
    _config.yml            Pages/Jekyll config

## Deviations from the reference repo

- `--outfile=docs/bundle.js` (the reference repo writes to `public/bundle.js` while
  `server.ts` serves `docs/`, which does not resolve without a copy step).
- Adds `docs/styles.css` and `README.md`.

## Updating

Edit `src/client/data.ts` only. `TODAY` in `model.ts` is the as-of date used for all
countdowns; bump it when you refresh the ledger.
