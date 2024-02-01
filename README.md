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

@includeExample can also take in line numbers to include a specific range of lines from the file:
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
