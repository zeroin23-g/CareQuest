# CareQuest Glucose Log

A simple Android-ready web app for tracking daily glucose readings twice a day.

## Files

- `index.html` — main app (input form, history, summary, export)
- `manifest.json` — installable app metadata
- `sw.js` — offline service worker
- `img/IMG-20261014-WA0009.jpg` — cover image

## Features

- Log **fasting/morning** and **post-meal/evening** glucose readings for any date.
- Switch between **mmol/L** and **mg/dL** with automatic conversion.
- Values are stored internally as **mmol/L**; displayed in your chosen unit.
- Data is stored **locally** in the browser with `localStorage`.
- View a **7-day average** and full history.
- View an on-screen **blood sugar reference chart**.
- **Export** readings as a CSV file or share via the Android share sheet.
- Works **offline** once installed as a PWA.

## How to run on Android

### Option A: Install as a PWA (Progressive Web App) — easiest

1. Copy this folder to a web server or host it (e.g. GitHub Pages, Netlify, or a local server).
2. Open the hosted URL in Chrome on your Android phone.
3. Tap the menu (⋮) and choose **“Add to Home screen”** / **“Install app”**.
4. Launch it from the home screen like a native app.

### Option B: Run locally on your computer

Open the folder in a terminal and start a local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

### Option C: Wrap in an Android WebView APK

For a true `.apk`, create a minimal Android Studio project with a `WebView` pointing to `index.html` (or bundle the files in `assets/`). The PWA approach above is usually sufficient and avoids the Play Store.

## Notes

- Values are saved in **mmol/L**.
- Clearing browser data will erase saved readings.
- Use the **Export** button to back up your data regularly.
