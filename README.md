[![Npm package](https://img.shields.io/npm/v/typedoc-plugin-include-example.svg)](https://www.npmjs.com/package/typedoc-plugin-include-example)
[![npm](https://img.shields.io/npm/dw/typedoc-plugin-include-example)](https://www.npmjs.com/package/typedoc-plugin-include-example)
[![GitHub](https://img.shields.io/github/license/ferdodo/typedoc-plugin-include-example)](https://github.com/ferdodo/typedoc-plugin-include-example)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/typedoc-plugin-include-example)](https://bundlephobia.com/package/typedoc-plugin-include-example)
[![npm](https://img.shields.io/badge/coverage-blue)](https://ferdodo.github.io/typedoc-plugin-include-example/reports/mutation/mutation.html)
[![npm](https://img.shields.io/badge/demo-green)](https://ferdodo.github.io/typedoc-plugin-include-example/)

Include code examples in your [typedoc](https://typedoc.org/) documentations.

### Installation

```bash
$ npm install --save-dev typedoc-plugin-include-example
```

### Usage

Write your example in a file.

```javascript
import { greet } from "./greet.js"
greet();
```

Add the @includeExample tag with the example path.

```javascript
/**
 * @includeExample src/greet.example.js
 */
export function greet() {
    console.log("Hello there.")
}
```

Then generate your documentation using typedoc.

```bash
$ npx typedoc --plugin typedoc-plugin-include-example
```

### Why including examples ?

Demonstrating how to use with examples has always been an essential part of making documentations accessible for newcomers. This plugin provides a conventionnal way of defining examples within your whole documentation.

Files as example never get out of date. If you're using type checking or other tools for code validation, example will need to be updated to follow the project evolutions.

### Best practice

I recommend to include a whole file for each example, not specific lines, because line numbers can quickly get out of date. In the future I'll make the file path optionnal, making the convention `./<sourceFile>.example.<extention>` the default for example file paths.

### Features

- Selecting specific lines.
- Selecting line ranges.
- Using multiple selections.

See the [Documentation](./docs.md) for full usage.

### Links

- [Typedoc](https://typedoc.org/)'s website.
- [Package](https://www.npmjs.com/package/typedoc-plugin-include-example) on Npm.
- [Demonsration](https://ferdodo.github.io/typedoc-plugin-include-example/) of what examples looks like.
- [Documentation](./docs.md) detailling specific features.
- [Coverage testing](https://ferdodo.github.io/typedoc-plugin-include-example/reports/mutation/mutation.html) report to visualise unit testing efficiency.
