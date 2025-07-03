# typedoc-plugin-include-example

[![Npm package](https://img.shields.io/npm/v/typedoc-plugin-include-example.svg)](https://www.npmjs.com/package/typedoc-plugin-include-example)
[![npm](https://img.shields.io/npm/dw/typedoc-plugin-include-example)](https://www.npmjs.com/package/typedoc-plugin-include-example)
[![GitHub](https://img.shields.io/github/license/ferdodo/typedoc-plugin-include-example)](https://github.com/ferdodo/typedoc-plugin-include-example)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/typedoc-plugin-include-example)](https://bundlephobia.com/package/typedoc-plugin-include-example)
[![npm](https://img.shields.io/badge/coverage-blue)](https://ferdodo.github.io/typedoc-plugin-include-example/reports/mutation/mutation.html)
[![npm](https://img.shields.io/badge/demo-green)](https://ferdodo.github.io/typedoc-plugin-include-example/)

Include code examples in your [typedoc](https://typedoc.org/) documentations with powerful Python-like slicing syntax.

## Installation

```bash
$ npm install --save-dev typedoc-plugin-include-example
```

## Usage

Write your example in a `*.example.ts` file.

```javascript
// greet.example.ts

import { greet } from "./greet.js";
greet(); // Prints greetings
```

Add the @includeExample tag to the actual code.

```javascript
// greet.ts

/**
 * Says hello !
 *
 * @includeExample
 */
export function greet() {
  console.log("Hello there.");
}
```

Then generate your documentation using typedoc using this plugin.

```bash
$ npx typedoc --plugin typedoc-plugin-include-example
```

## Line Selection Syntax

### Basic Usage

```typescript
/**
 * @includeExample greet.example.ts        // Include entire file
 * @includeExample greet.example.ts[5]     // Include line 5 only
 * @includeExample greet.example.ts[2:8]   // Include lines 2-8
 */
```

### Advanced Python-like Slicing

```typescript
/**
 * @includeExample greet.example.ts[5:]     // From line 5 to end
 * @includeExample greet.example.ts[:10]    // From start to line 10
 * @includeExample greet.example.ts[-5:]    // Last 5 lines
 * @includeExample greet.example.ts[:-3]    // All except last 3 lines
 * @includeExample greet.example.ts[-5:-2]  // Lines -5 to -2 (negative indexing)
 */
```

### Multiple Selections & Exclusions

```typescript
/**
 * @includeExample greet.example.ts[2:5,10,15:20]     // Lines 2-5, 10, and 15-20
 * @includeExample greet.example.ts[1:20,!8:12]       // Lines 1-20 except 8-12
 * @includeExample greet.example.ts[:10,!3,!7]        // Lines 1-10 except 3 and 7
 */
```

## 🚨 Breaking Changes in v3.0.0

The old colon syntax is no longer supported. Please migrate:

```diff
- @includeExample path/to/file:15
+ @includeExample path/to/file[15]

- @includeExample path/to/file:2-4
+ @includeExample path/to/file[2:4]

- @includeExample path/to/file:2-4,15
+ @includeExample path/to/file[2:4,15]
```

## Features

See the [Documentation](./docs.md) for full usage.

## Links

- [Typedoc](https://typedoc.org/)'s website.
- [Package](https://www.npmjs.com/package/typedoc-plugin-include-example) on Npm.
- [Demonsration](https://ferdodo.github.io/typedoc-plugin-include-example/) of what examples looks like.
- [Documentation](./docs.md) detailling specific features.
- [Coverage testing](https://ferdodo.github.io/typedoc-plugin-include-example/reports/mutation/mutation.html) report to visualise unit testing efficiency.
