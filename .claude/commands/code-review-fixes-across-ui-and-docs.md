---
name: code-review-fixes-across-ui-and-docs
description: Workflow command scaffold for code-review-fixes-across-ui-and-docs in Extension-stension-what-s-your-invention-.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /code-review-fixes-across-ui-and-docs

Use this workflow when working on **code-review-fixes-across-ui-and-docs** in `Extension-stension-what-s-your-invention-`.

## Goal

Addresses code review feedback by updating multiple UI and documentation files in a single commit.

## Common Files

- `options/options.js`
- `popup/popup.js`
- `privacy-policy.html`
- `store/listing.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit UI logic files (options/options.js, popup/popup.js)
- Update documentation or store listing files (privacy-policy.html, store/listing.md)
- Commit with a message referencing review issues

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.