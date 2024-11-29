[![Npm package](https://img.shields.io/npm/v/typedoc-plugin-include-example.svg)](https://www.npmjs.com/package/typedoc-plugin-include-example)
[![npm](https://img.shields.io/npm/dw/typedoc-plugin-include-example)](https://www.npmjs.com/package/typedoc-plugin-include-example)
[![GitHub](https://img.shields.io/github/license/ferdodo/typedoc-plugin-include-example)](https://github.com/ferdodo/typedoc-plugin-include-example)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/typedoc-plugin-include-example)](https://bundlephobia.com/package/typedoc-plugin-include-example)
[![npm](https://img.shields.io/badge/coverage-blue)](https://ferdodo.github.io/typedoc-plugin-include-example/reports/mutation/mutation.html)
[![npm](https://img.shields.io/badge/demo-green)](https://ferdodo.github.io/typedoc-plugin-include-example/)

Include examples in your documentations.

```bash
$ npm install --save-dev typedoc-plugin-include-example
$ npx typedoc --plugin typedoc-plugin-include-example
```

```typescript
/**
 * @includeExample path/to/your/example.ts:1-5,10
 */
function myFunction() {
    // ...
}
```

### 📦 Plugin

[Plugin](./plugin/README.md)

### 🚀 Demo

[Demo](./demo/README.md)