# typedoc-plugin-include-example

[![Npm package](https://img.shields.io/npm/v/typedoc-plugin-include-example.svg)](https://www.npmjs.com/package/typedoc-plugin-include-example)
[![npm](https://img.shields.io/npm/dw/typedoc-plugin-include-example)](https://www.npmjs.com/package/typedoc-plugin-include-example)
[![GitHub](https://img.shields.io/github/license/ferdodo/typedoc-plugin-include-example)](https://github.com/ferdodo/typedoc-plugin-include-example)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/typedoc-plugin-include-example)](https://bundlephobia.com/package/typedoc-plugin-include-example)
[![npm](https://img.shields.io/badge/coverage-blue)](https://ferdodo.github.io/typedoc-plugin-include-example/reports/mutation/mutation.html)
[![npm](https://img.shields.io/badge/demo-green)](https://ferdodo.github.io/typedoc-plugin-include-example/)

Include code examples in your [typedoc](https://typedoc.org/) documentations.

## Installation

```bash
$ npm install --save-dev typedoc-plugin-include-example
```

## Usage

Write your example in a `*.example.ts` file.

```javascript
// greet.example.ts

import { greet } from "./greet.js"
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
    console.log("Hello there.")
}
```

Then generate your documentation using typedoc using this plugin.

```bash
$ npx typedoc --plugin typedoc-plugin-include-example
```

## Features

See the [Documentation](./docs.md) for full usage.

## Links

- [Typedoc](https://typedoc.org/)'s website.
- [Package](https://www.npmjs.com/package/typedoc-plugin-include-example) on Npm.
- [Demonsration](https://ferdodo.github.io/typedoc-plugin-include-example/) of what examples looks like.
- [Documentation](./docs.md) detailling specific features.
- [Coverage testing](https://ferdodo.github.io/typedoc-plugin-include-example/reports/mutation/mutation.html) report to visualise unit testing efficiency.
