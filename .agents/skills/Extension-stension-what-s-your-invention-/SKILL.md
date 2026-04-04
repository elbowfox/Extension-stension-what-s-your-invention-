```markdown
# Extension-stension-what-s-your-invention- Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns, coding conventions, and workflows used in the `Extension-stension-what-s-your-invention-` JavaScript browser extension repository. You'll learn how to structure your code, follow commit and file organization standards, and efficiently contribute new features, fixes, and documentation updates. The guide also covers how to run and write tests, and provides handy commands for common development tasks.

## Coding Conventions

- **File Naming:**  
  Use `camelCase` for JavaScript files and folders.  
  *Example:*  
  ```
  background.js
  content.js
  popup/popup.js
  options/options.js
  ```

- **Import Style:**  
  Use relative imports for modules.  
  *Example:*  
  ```js
  import { myFunction } from './utils/helper.js';
  ```

- **Export Style:**  
  Use named exports.  
  *Example:*  
  ```js
  // In utils/helper.js
  export function myFunction() { ... }
  ```

- **Commit Messages:**  
  - Freeform, no strict prefixes.
  - Average length: ~51 characters.
  - Example:  
    ```
    Fix popup not updating after option change
    ```

## Workflows

### Feature Development Across Extension Files
**Trigger:** When adding a new major feature or performing a significant update across the extension.  
**Command:** `/feature`

1. Edit or add implementation files (e.g., `background.js`, `content.js`, `popup/popup.js`, `options/options.js`).
2. Update UI files as needed (`popup/popup.html`, `options/options.html`, and corresponding `.css`).
3. Update `manifest.json` to reflect new permissions or features.
4. Update documentation (`README.md`, `store/listing.md`, `privacy-policy.html`).
5. Commit all related changes together.

*Example commit message:*  
```
Add dark mode support to popup and options pages
```

---

### Single-File Hotfix or Enhancement
**Trigger:** When you need to quickly fix a bug or tweak a specific feature in one file.  
**Command:** `/hotfix`

1. Edit the relevant single file (e.g., `content.js`, `popup/popup.js`, `background.js`, `manifest.json`, `options/options.html`, `README.md`).
2. Commit with a message describing the change.

*Example commit message:*  
```
Fix typo in options/options.html
```

---

### Code Review Fixes Across UI and Docs
**Trigger:** When addressing code review feedback or polishing the extension for release/store submission.  
**Command:** `/review-fix`

1. Edit UI logic files as needed (`options/options.js`, `popup/popup.js`).
2. Update documentation or store listing files (`privacy-policy.html`, `store/listing.md`).
3. Commit with a message referencing review issues.

*Example commit message:*  
```
Update privacy policy and fix popup button alignment per review
```

---

### Initialization or Merge of Complete Extension
**Trigger:** When initializing the project or merging a major branch with the full extension codebase.  
**Command:** `/init-extension`

1. Add or merge all core extension files (`background.js`, `content.js`, `popup`, `options`, `manifest.json`, `icons`, docs, etc.).
2. Commit with a message indicating initialization or merge.

*Example commit message:*  
```
Initial commit: add all extension files and docs
```

## Testing Patterns

- **Test Framework:** Unknown (not detected).
- **Test File Pattern:** Files matching `*.test.*` (e.g., `popup.test.js`, `options.test.js`).
- **General Approach:**  
  - Place test files alongside or near the files they test.
  - Use descriptive test names.
  - Example test file:
    ```js
    // popup/popup.test.js
    import { someFunction } from './popup.js';

    test('someFunction returns expected value', () => {
      expect(someFunction()).toBe('expected');
    });
    ```

## Commands

| Command           | Purpose                                                        |
|-------------------|----------------------------------------------------------------|
| /feature          | Start a major feature or update across multiple extension files |
| /hotfix           | Apply a quick fix or enhancement to a single file              |
| /review-fix       | Address code review feedback across UI and docs                |
| /init-extension   | Initialize or merge the complete extension codebase             |
```
