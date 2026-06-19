# 💎 Jewels Insult Counter

A dead-simple, phone-friendly web app for tallying how many insults your sister
**Jewels** lobs at you across the dinner table. One big button. Tap = +1.

Everything is stored **locally on your phone** — nothing is uploaded anywhere.

## Features

- **Giant tap button** with a satisfying pop + haptic buzz on every count.
- **Tonight / Per Hour / Record** stats at a glance.
- **Timeline** of timestamps so you can relive each zinger.
- **Undo** the last tap and **Reset Night** (your all-time record is kept).
- **Works offline** and installs to your home screen like a native app (PWA).

## Get it on your phone

You just need to open `index.html` from a web address (a `file://` path won't
allow the install/offline features). Two easy options:

### Option A — quick local test on your computer
```bash
cd insult-counter
python3 -m http.server 8000
```
Then open `http://localhost:8000` in a browser. To reach it from your phone on
the same Wi-Fi, use your computer's local IP, e.g. `http://192.168.1.50:8000`.

### Option B — free hosting (recommended for everyday use)
Drop the contents of this `insult-counter/` folder onto any static host, e.g.:
- **GitHub Pages**, **Netlify**, **Vercel**, or **Cloudflare Pages**.

Then on your phone:
- **iPhone (Safari):** open the URL → Share → **Add to Home Screen**.
- **Android (Chrome):** open the URL → menu (⋮) → **Install app / Add to Home Screen**.

Now there's a 💎 icon on your home screen. Open it at dinner and start tapping.

## Files
| File | Purpose |
|------|---------|
| `index.html` | The whole UI |
| `app.js` | Counting, timeline, storage logic |
| `sw.js` | Service worker for offline use |
| `manifest.webmanifest` | Makes it installable as an app |
| `icon-*.png` | Home-screen icons |

No build step, no dependencies, no accounts.
