# TabFlow — Smart Tab & Session Manager

> A browser extension that saves, restores, and organizes your tab sessions with one click. Boost productivity and never lose your work again.

---

## 🚀 Features

- **Save Sessions** — Save all open tabs as a named session instantly
- **Restore Sessions** — Open any saved session in one click (all tabs re-open)
- **Search Tabs** — Find any open tab by title or URL
- **Shopping Nudge** — Reminds you to save your session on checkout pages
- **Keyboard Shortcuts** — `Ctrl+Shift+S` to save, `Ctrl+Shift+T` to open popup
- **TabFlow Pro** — Unlock higher session limits and other advanced features (no device sync/themes yet)

---

## 📦 Project Structure

```
├── manifest.json         # Chrome Manifest V3
├── background.js         # Service worker (keyboard shortcuts, install event)
├── content.js            # Content script (shopping site nudge)
├── popup/
│   ├── popup.html        # Popup UI
│   ├── popup.css         # Popup styles
│   └── popup.js          # Popup logic
├── options/
│   ├── options.html      # Settings page
│   ├── options.css       # Settings styles
│   └── options.js        # Settings logic
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── privacy-policy.html   # Required for store submission
└── store/
    └── listing.md        # Store listing copy & submission checklist
```

---

## 🛒 Publishing to Chrome Web Store

### 1. Create the ZIP package

```bash
zip -r tabflow-v1.0.0.zip . \
  --exclude=".git/*" \
  --exclude="store/*" \
  --exclude="*.md" \
  --exclude="*.sh"
```

### 2. Submit

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
2. Pay one-time **$5** registration fee (if not done already)
3. Click **"New Item"** and upload the ZIP
4. Fill in name, description, screenshots (see `store/listing.md`)
5. Set privacy policy URL (`https://tabflow.pro/privacy` or host `privacy-policy.html`)
6. Submit for review — typically **1–3 business days**

### 3. Firefox (AMO)

Submit the same ZIP at [Firefox Add-ons](https://addons.mozilla.org/developers/). Manifest V3 is supported.

---

## 💰 Monetization

| Stream | Details |
|--------|---------|
| **Pro Subscription** | $2.99/month or $14.99/year (58% saving) |
| **Freemium Limit** | 3 sessions free → prompts upgrade |
| **Shopping Nudge** | Affiliate hook on checkout pages |
| **Review Funnel** | In-app review prompt to boost store ranking |

---

## 🔧 Development

Load unpacked extension in Chrome:

1. Go to `chrome://extensions`
2. Enable **Developer Mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select this folder

---

## 📄 License

MIT © Josh Herbertson 2026
