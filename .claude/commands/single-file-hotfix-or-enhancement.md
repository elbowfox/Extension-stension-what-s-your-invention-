---
name: single-file-hotfix-or-enhancement
description: Workflow command scaffold for single-file-hotfix-or-enhancement in Extension-stension-what-s-your-invention-.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /single-file-hotfix-or-enhancement

Use this workflow when working on **single-file-hotfix-or-enhancement** in `Extension-stension-what-s-your-invention-`.

## Goal

Makes a targeted fix or enhancement to a single file, often for bug fixes, small improvements, or incremental feature work.

## Common Files

- `content.js`
- `popup/popup.js`
- `background.js`
- `manifest.json`
- `options/options.html`
- `README.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit the relevant single file (e.g., content.js, popup/popup.js, background.js, manifest.json, options/options.html, README.md)
- Commit with a message describing the change

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.