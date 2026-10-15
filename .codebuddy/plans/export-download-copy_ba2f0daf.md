---
name: export-download-copy
overview: "Replace the single \"Share / Export Data\" button with two reliable buttons: a \"Download CSV\" button (direct blob download) and a \"Copy CSV\" button (clipboard copy). Remove the navigator.share path that was failing on desktop Chrome."
todos:
  - id: replace-buttons-markup
    content: Replace single export button with Download CSV and Copy CSV buttons in index.html markup
    status: completed
  - id: implement-csv-helpers
    content: Add buildCsv, downloadCsv, copyCsv helpers and wire to new buttons; remove navigator.share path
    status: completed
    dependencies:
      - replace-buttons-markup
---

## Product Overview

Fix the broken export feature on desktop Chrome. The current single "Share / Export Data" button relies on the Web Share API which is unsupported on desktop Chrome, so nothing happens when clicked.

## Core Features

- Replace the single export button with two reliable buttons: "Download CSV" and "Copy CSV"
- Download CSV triggers a direct file download via Blob + anchor element (works on desktop Chrome)
- Copy CSV copies the CSV text to the clipboard using the modern Clipboard API with a textarea/execCommand fallback
- Shared CSV-building logic refactored into a reusable helper to avoid duplication
- Toast feedback for both actions ("CSV downloaded" / "CSV copied")

## Tech Stack

- Existing project: static HTML/CSS/JavaScript PWA (no build step, no framework)
- Persistence: localStorage
- No new dependencies; pure vanilla JS

## Implementation Approach

Replace the single `exportBtn` (line 294 markup, line 349 reference, lines 536-574 handler) with two buttons: `downloadBtn` and `copyBtn`. Remove the `navigator.share` branch entirely since it fails silently on desktop Chrome. Refactor the CSV string-building logic into a `buildCsv()` helper. Implement `downloadCsv()` using Blob + temporary anchor, and `copyCsv()` using `navigator.clipboard.writeText()` with a textarea + `document.execCommand('copy')` fallback for non-secure contexts. Both handlers guard the empty-data case with the existing toast.

## Implementation Notes

- **Reuse existing patterns**: Keep the existing Blob download code (lines 564-572) and `showToast()` helper; only restructure around them.
- **Clipboard reliability**: `navigator.clipboard` requires a secure context (HTTPS or localhost). Add a textarea fallback so copy works even when served over plain HTTP.
- **Blast radius**: Single file (`index.html`), additive replacement of one button and its handler. No changes to save/clear/render logic or `sw.js`.

## Directory Structure

```
project-root/
└── index.html   # [MODIFY] Replace export button markup (line 294), element reference (line 349), and handler (lines 536-574) with two buttons + buildCsv/downloadCsv/copyCsv helpers
```

**index.html** — Replace the single `<button id="exportBtn">` with `<button id="downloadBtn" class="secondary">Download CSV</button>` and `<button id="copyBtn" class="secondary">Copy CSV</button>`. Replace the `exportBtn` element reference and its click handler with references to `downloadBtn`/`copyBtn` and a `buildCsv()` helper plus `downloadCsv()` and `copyCsv()` functions wired to the two buttons.