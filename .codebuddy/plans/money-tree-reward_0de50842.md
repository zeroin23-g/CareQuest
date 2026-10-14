---
name: money-tree-reward
overview: "Add a money-tree reward image just above the History section in index.html that changes based on the number of days with log entries: money01 for 1 day, money02 for 2 days, ..., money07 for 7+ days. Also cache the new images in sw.js."
todos:
  - id: add-reward-card
    content: Add reward card section with img and caption before History in index.html
    status: completed
  - id: wire-render-logic
    content: Update render() to set reward image and caption from dates.length
    status: completed
    dependencies:
      - add-reward-card
  - id: cache-images-sw
    content: Add 7 money PNG paths to sw.js ASSETS and bump cache version
    status: completed
---

## Product Overview

Add a gamified "money tree" reward image to the CareQuest glucose tracker that grows as the user logs more days of readings.

## Core Features

- Display one of 7 money-tree images (money01.png through money07.png) in a new card positioned just above the History section.
- Image selection is based on the number of unique days with at least one log entry: money01 for day 1, money02 for day 2, ..., money07 for day 7 and beyond (capped at 7).
- At 0 entries, show money01.png as the seed/start state with an encouraging caption to log the first reading.
- At 1+ entries, show the corresponding image with a caption indicating the current day count (e.g., "Day 3 — keep it up!").
- Cache all 7 money-tree images in the service worker for offline use.

## Tech Stack

- Existing project: static HTML/CSS/JavaScript PWA (no build step, no framework).
- Persistence: `localStorage` (already used for readings and unit preference).
- Offline: Service Worker (`sw.js`) with cache-then-network strategy.

## Implementation Approach

Add a new reward card (`<section class="card" id="rewardCard">`) in `index.html` immediately before the existing History card (before line 315). The card contains an `<img id="rewardImg">` and a `<p class="caption" id="rewardCaption">`. Reuse the existing `.reference-img` and `.caption` CSS classes for consistent styling — no new CSS needed.

In the existing `render()` function (around line 440), after `dates` is computed (line 442, where `dates.length` = number of unique logged days), compute the reward image:

- `const dayCount = dates.length;`
- `const level = Math.min(dayCount, 7);` (1-based; at 0 entries level = 1 as seed)
- `rewardImg.src = 'img/money0' + level + '.png';`
- Update caption based on dayCount.

This is a pure additive change: one new HTML section, a few lines in `render()`, and additions to the `sw.js` ASSETS array. No existing logic is altered, minimizing blast radius.

## Implementation Notes

- **Reuse existing patterns**: The `.reference-img` / `.caption` classes and the `render()` function's `dates.length` value already exist — reuse them rather than introducing new CSS or a separate data source.
- **Performance**: `render()` already runs on every save/clear/unit-change; adding two DOM property assignments (img src + caption text) is negligible. No new traversals or listeners.
- **Blast radius control**: Insert the new card before the History section only; do not reorder or modify the History, Summary, or Reference Chart sections. The service worker ASSETS additions are purely additive (new entries appended).
- **Offline reliability**: Add all 7 money PNG paths to `sw.js` ASSETS so the reward image always loads offline. Bump `CACHE_NAME` to `carequest-v2` to force cache refresh of the updated `index.html` and new images.
- **Edge case**: When `dayCount === 0`, use `money01.png` (seed) with a prompt caption so the card is never empty.

## Directory Structure

```
project-root/
├── index.html   # [MODIFY] Add reward card before History section; update render() to set reward image + caption based on dates.length
├── sw.js        # [MODIFY] Add 7 money PNG paths to ASSETS array; bump CACHE_NAME to carequest-v2
└── img/
    ├── money01.png  # [EXISTING] day 1 / seed state
    ├── money02.png  # [EXISTING] day 2
    ├── money03.png  # [EXISTING] day 3
    ├── money04.png  # [EXISTING] day 4
    ├── money05.png  # [EXISTING] day 5
    ├── money06.png  # [EXISTING] day 6
    └── money07.png  # [EXISTING] day 7+
```

**index.html** — Insert a new `<section class="card" id="rewardCard">` between the 7-Day Summary section (ends ~line 313) and the History section (starts ~line 315). The card contains `<img id="rewardImg" class="reference-img" alt="Money tree reward" />` and `<p class="caption" id="rewardCaption"></p>`. In `render()`, after line 442 (`const dates = ...`), add logic: compute `level = Math.min(dates.length, 7)` (use 1 when 0 entries), set `rewardImg.src` to `'img/money0' + level + '.png'`, and set caption text — seed prompt at 0 entries, "Day N — keep it up!" at 1+ entries.

**sw.js** — Append `./img/money01.png` through `./img/money07.png` to the ASSETS array. Update `CACHE_NAME` from `carequest-v1` to `carequest-v2` so the service worker re-caches the updated files on next install.