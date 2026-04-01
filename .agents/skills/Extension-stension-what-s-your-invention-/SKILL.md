```markdown
# Extension-stension-what-s-your-invention- Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill introduces the development patterns and conventions used in the `Extension-stension-what-s-your-invention-` JavaScript codebase. It covers file organization, code style, import/export patterns, and testing practices. While no specific frameworks or automated workflows are detected, this guide provides a comprehensive overview to help contributors maintain consistency and quality.

## Coding Conventions

### File Naming
- **Convention:** camelCase
- **Example:**  
  ```plaintext
  myUtilityFile.js
  extensionManager.js
  ```

### Import Style
- **Convention:** Relative imports
- **Example:**
  ```javascript
  import { myFunction } from './utils';
  import { anotherThing } from '../helpers/anotherHelper';
  ```

### Export Style
- **Convention:** Named exports
- **Example:**
  ```javascript
  // In utils.js
  export function myFunction() { ... }
  export const CONSTANT = 42;

  // In another file
  import { myFunction, CONSTANT } from './utils';
  ```

### Commit Patterns
- **Type:** Freeform (no enforced prefixes)
- **Average Length:** 17 characters
- **Example:**
  ```
  Fix bug in extension
  Add new feature
  Update readme
  ```

## Workflows

_No automated workflows detected in this repository. Below are suggested manual workflows for common development tasks._

### Adding a New Feature
**Trigger:** When implementing a new functionality  
**Command:** `/add-feature`

1. Create a new camelCase-named JavaScript file if needed.
2. Write your feature using relative imports and named exports.
3. Add or update corresponding test files (`*.test.*`).
4. Commit with a concise, descriptive message.
5. Push your changes and open a pull request.

### Fixing a Bug
**Trigger:** When addressing a reported issue  
**Command:** `/fix-bug`

1. Locate the relevant code using camelCase file naming.
2. Apply the fix, maintaining import/export conventions.
3. Update or add tests to cover the bug fix.
4. Commit with a clear message describing the fix.
5. Push and submit your changes for review.

### Writing Tests
**Trigger:** When adding or updating code  
**Command:** `/write-test`

1. Create or update a test file matching the `*.test.*` pattern.
2. Write tests for all new or changed functionality.
3. Run tests to ensure correctness.
4. Commit test changes with a descriptive message.

## Testing Patterns

- **Framework:** Unknown (no specific framework detected)
- **File Pattern:** `*.test.*`
- **Example:**
  ```javascript
  // myFunction.test.js
  import { myFunction } from './myFunction';

  test('should return correct value', () => {
    expect(myFunction(2)).toBe(4);
  });
  ```
- **Tip:** Place tests alongside implementation files or in a dedicated `tests` directory, following the `*.test.*` naming convention.

## Commands
| Command      | Purpose                                 |
|--------------|-----------------------------------------|
| /add-feature | Start the process of adding a new feature|
| /fix-bug     | Begin fixing a reported bug             |
| /write-test  | Write or update tests for your code      |
```
