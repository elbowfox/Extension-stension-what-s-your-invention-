---
name: feature-development-across-extension-files
description: Workflow command scaffold for feature-development-across-extension-files in Extension-stension-what-s-your-invention-.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-development-across-extension-files

Use this workflow when working on **feature-development-across-extension-files** in `Extension-stension-what-s-your-invention-`.

## Goal

Implements or updates major features by modifying multiple core extension files (background, content, popup, options, manifest, README, store listing, etc.) in a single commit.

## Common Files

- `background.js`
- `content.js`
- `popup/popup.js`
- `popup/popup.html`
- `popup/popup.css`
- `options/options.js`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or add implementation files (background.js, content.js, popup/popup.js, options/options.js, etc.)
- Update UI files as needed (popup/popup.html, options/options.html, corresponding .css)
- Update manifest.json to reflect new permissions or features
- Update documentation (README.md, store/listing.md, privacy-policy.html)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.