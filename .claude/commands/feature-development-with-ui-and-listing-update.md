---
name: feature-development-with-ui-and-listing-update
description: Workflow command scaffold for feature-development-with-ui-and-listing-update in Extension-stension-what-s-your-invention-.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-development-with-ui-and-listing-update

Use this workflow when working on **feature-development-with-ui-and-listing-update** in `Extension-stension-what-s-your-invention-`.

## Goal

Implements or updates a feature that affects both the extension's UI (options and popup) and updates the store listing and documentation.

## Common Files

- `background.js`
- `options/options.js`
- `options/options.html`
- `options/options.css`
- `popup/popup.js`
- `popup/popup.css`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or create implementation files (background.js, options/options.js, popup/popup.js)
- Update corresponding UI files (options/options.html, options/options.css, popup/popup.css)
- Update documentation (README.md)
- Update store listing (store/listing.md)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.