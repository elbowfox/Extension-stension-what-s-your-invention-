# TabFlow — Deployment & Monetization Guide

## 1. Package the Extension

```bash
# From the repo root — excludes dev/meta files not needed in the extension ZIP
zip -r tabflow-v1.0.0.zip . \
  --exclude=".git/*" \
  --exclude=".gitignore" \
  --exclude="store/*" \
  --exclude="DEPLOYMENT.md" \
  --exclude="*.md" \
  --exclude="*.zip"
```

> **Tip:** Increment the version in `manifest.json` for each submission (e.g. `1.0.1`, `1.1.0`).

---

## 2. Publish to Chrome Web Store

1. Sign in to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
2. Pay the one-time **$5** registration fee (if not already done)
3. Click **"New Item"** → upload `tabflow-v1.0.0.zip`
4. Fill in the store listing (copy from `store/listing.md`):
   - **Name:** TabFlow — Smart Tab & Session Manager
   - **Short description** (≤132 chars): Save, restore, and search your browser tab sessions in one click. Never lose your work again.
   - **Detailed description:** see `store/listing.md`
   - **Category:** Productivity
   - **Screenshots:** at least 1 screenshot (1280×800 or 640×400)
   - **Promotional tile:** 440×280 PNG
5. Set the **Privacy Policy URL** (host `privacy-policy.html` on GitHub Pages, Netlify, etc.):
   - Example: `https://<your-github-username>.github.io/tabflow/privacy-policy.html`
6. Submit for review — typically **1–3 business days**

---

## 3. Publish to Firefox Add-ons (AMO)

1. Go to [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
2. Sign in and click **"Submit a New Add-on"**
3. Upload the same ZIP (Manifest V3 is supported in Firefox ≥ 109)
4. Fill in the listing details (reuse the Chrome listing copy)
5. Submit for review — typically **1–7 business days**

---

## 4. Monetization Setup

### Stripe / Payment Processor

Set up a checkout at `https://tabflow.pro/upgrade` (or your own domain):

| Plan | Price | Stripe Price ID |
|------|-------|-----------------|
| Monthly | $2.99/mo | `price_xxx_monthly` |
| Annual | $14.99/yr | `price_xxx_yearly` |

After successful payment, deliver a license key starting with `TFP-` (e.g. `TFP-XXXX-YYYY-ZZZZ`). The extension validates the prefix client-side and unlocks Pro features.

> **For production:** Replace the client-side `LICENSE_PREFIX` check in `options/options.js` with a server-side license validation endpoint that returns `{ valid: true }` for genuine keys.

### Revenue Streams

| Stream | Details |
|--------|---------|
| **Pro Monthly** | $2.99/mo — unlimited sessions, sync, bulk ops, custom themes |
| **Pro Annual** | $14.99/yr (58% savings) — best for conversion |
| **Freemium Hook** | 3 sessions free → upgrade banner shown automatically |
| **Shopping Nudge** | Content script shows save reminder on checkout pages |
| **Review Funnel** | In-app "Leave a Review" button boosts store ranking & organic installs |

---

## 5. Hosting the Privacy Policy

The Chrome Web Store requires a hosted privacy policy URL. Quickest options:

### Option A — GitHub Pages

```bash
# In the repo, enable GitHub Pages (Settings → Pages → branch: main, folder: /)
# Privacy policy will be at:
# https://<username>.github.io/<repo-name>/privacy-policy.html
```

### Option B — Netlify (free)

1. Connect repo to Netlify
2. Set publish directory to `/`
3. Privacy policy at `https://<your-site>.netlify.app/privacy-policy.html`

---

## 6. Post-Launch Checklist

- [ ] Extension submitted to Chrome Web Store
- [ ] Extension submitted to Firefox AMO
- [ ] Privacy policy hosted and URL entered in store listings
- [ ] Payment processor configured at `tabflow.pro/upgrade`
- [ ] License key delivery email set up
- [ ] Analytics (optional, privacy-respecting) configured
- [ ] Support email `support@tabflow.pro` set up
