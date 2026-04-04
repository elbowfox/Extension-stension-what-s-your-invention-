```markdown
# Extension-stension-what-s-your-invention- Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill covers the development patterns, coding conventions, and workflows for the `Extension-stension-what-s-your-invention-` JavaScript codebase. The repository is focused on browser extension development, with a strong emphasis on UI (options and popup), documentation, and store listing updates. The skill outlines how to structure code, manage features, respond to code reviews, and maintain consistency across the project.

## Coding Conventions

- **File Naming:**  
  Use camelCase for filenames.  
  _Example:_  
  ```
  background.js
  options/options.js
  popup/popup.js
  ```

- **Import Style:**  
  Use relative imports for modules.  
  _Example:_  
  ```js
  import { getSettings } from './settings.js';
  ```

- **Export Style:**  
  Use named exports for functions and constants.  
  _Example:_  
  ```js
  // In options.js
  export function saveOptions() { ... }
  export const DEFAULTS = { ... };
  ```

- **Commit Messages:**  
  Freeform, typically around 59 characters.  
  _Example:_  
  ```
  Add dark mode toggle to options page
  ```

## Workflows

### Feature Development with UI and Listing Update
**Trigger:** When adding a new feature or major enhancement, especially for Pro-tier or monetization, ensuring both UI and store listing are updated.  
**Command:** `/feature-ui-listing`

1. Edit or create implementation files:
    - `background.js`
    - `options/options.js`
    - `popup/popup.js`
2. Update corresponding UI files:
    - `options/options.html`
    - `options/options.css`
    - `popup/popup.css`
3. Update documentation:
    - `README.md`
4. Update store listing:
    - `store/listing.md`

_Example: Adding a new premium feature toggle to the options page_
```js
// options/options.js
export function enablePremiumFeature() {
  // logic here
}
```
```html
<!-- options/options.html -->
<label>
  <input type="checkbox" id="premiumFeature" />
  Enable Premium Feature
</label>
```
```css
/* options/options.css */
#premiumFeature {
  accent-color: gold;
}
```

### Code Review Fixes UI
**Trigger:** When receiving code review feedback on UI logic or presentation and needing to make targeted fixes.  
**Command:** `/review-fix-ui`

1. Edit `options/options.js` to fix logic or extract functions.
2. Edit `options/options.html` to adjust UI structure or elements.

_Example: Refactoring a function after review_
```js
// Before
function save() { /* ... */ }

// After
export function saveOptions() { /* ... */ }
```

## Testing Patterns

- **Framework:** Unknown (not detected)
- **File Pattern:** Test files follow the `*.test.*` naming convention.
  _Example:_  
  ```
  options.test.js
  popup.test.js
  ```
- **Location:** Test files are placed alongside the files they test.

## Commands

| Command             | Purpose                                                                 |
|---------------------|-------------------------------------------------------------------------|
| /feature-ui-listing | Start a feature or enhancement affecting UI and store listing            |
| /review-fix-ui      | Apply code review fixes specifically to UI files                        |
```
