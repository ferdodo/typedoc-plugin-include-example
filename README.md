[![Npm package](https://img.shields.io/npm/v/typedoc-plugin-include-example.svg)](https://www.npmjs.com/package/typedoc-plugin-include-example)
[![npm](https://img.shields.io/npm/dw/typedoc-plugin-include-example)](https://www.npmjs.com/package/typedoc-plugin-include-example)
[![GitHub last commit (branch)](https://img.shields.io/github/last-commit/ferdodo/typedoc-plugin-include-example/master)](https://github.com/ferdodo/typedoc-plugin-include-example)
[![GitHub](https://img.shields.io/github/license/ferdodo/typedoc-plugin-include-example)](https://github.com/ferdodo/typedoc-plugin-include-example)
[![npm](https://img.shields.io/badge/documentation-blue)](https://ferdodo.github.io/typedoc-plugin-include-example/)

The `typedoc-plugin-include-example` plugin allows TypeDoc users to include code examples from external files directly into their documentation.

## Installation

```bash
npm install typedoc-plugin-include-example --save-dev
```

## Usage

1. In your TypeScript comments, add the `@includeExample` directive followed by the path of the file you wish to include:

```typescript
/**
 * This is a sample function.
 *
 * @includeExample path/to/your/example.ts
 */
function myFunction() {
  // ...
}
```

`@includeExample` can also take in line numbers to include a specific range of lines from the file:

```typescript
/**
 * This is a sample function of how to include lines 1-5 and 10 from `path/to/your/example.ts`
 *
 * @includeExample path/to/your/example.ts:1-5,10
 */
function myFunction() {
  // ...
}
```

2. When generating documentation with TypeDoc, make sure to include the plugin:

```bash
typedoc --plugin typedoc-plugin-include-example
```

## License

MIT
