# gateway-tenant-factory

Cloudflare Pages (Vite + React) app with Pages Functions scraper endpoint.

## Routes
- `/factory` UI for collecting inputs, scraping, editing fields, and ZIP export.
- `/api/scrape` Pages Function endpoint used by the UI.

## Notes
- Export is JSON-only: `{slug}.json` and `extractionReport.json` in one zip.
- No AI services are used; extraction uses deterministic slot matching.
