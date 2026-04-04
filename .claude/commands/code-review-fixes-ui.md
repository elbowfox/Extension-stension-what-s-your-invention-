---
name: code-review-fixes-ui
description: Workflow command scaffold for code-review-fixes-ui in Extension-stension-what-s-your-invention-.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /code-review-fixes-ui

Use this workflow when working on **code-review-fixes-ui** in `Extension-stension-what-s-your-invention-`.

## Goal

Addresses code review feedback specifically for UI-related files, often after a feature or enhancement.

## Common Files

- `options/options.js`
- `options/options.html`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit options/options.js to fix logic or extract functions
- Edit options/options.html to adjust UI structure or elements

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.