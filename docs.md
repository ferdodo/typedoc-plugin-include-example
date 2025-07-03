# Documentation

## Quick Start

The simplest way to include an example is to place the `@includeExample` tag in your JSDoc comment. The plugin will automatically look for a corresponding `.example.ts` file with the same name.

```typescript
/**
 * Says hello to the world
 *
 * @includeExample
 */
export function greet() {
  console.log("Hello, world!");
}
```

This will include the entire content of `greet.example.ts` in your documentation.

## File Path Specification

### Automatic File Discovery

When no file path is specified, the plugin looks for a file with the same name as the current file, but with `.example.ts` extension:

```typescript
// In Author.ts
/**
 * @includeExample  // Looks for Author.example.ts
 */
class Author {}
```

### Explicit File Paths

You can specify a custom file path:

```typescript
/**
 * @includeExample src/examples/custom-example.ts
 * @includeExample ../shared/common.example.ts
 * @includeExample ./utils/helper.example.ts
 */
```

## Line Selection Syntax

### Single Line Selection

Include only a specific line using positive or negative indexing:

```typescript
/**
 * @includeExample greet.example.ts[5]      // Include line 5
 * @includeExample greet.example.ts[1]      // Include line 1 (first line)
 * @includeExample greet.example.ts[-1]     // Include last line
 * @includeExample greet.example.ts[-2]     // Include second-to-last line
 */
```

### Range Selection

Include a range of lines:

```typescript
/**
 * @includeExample greet.example.ts[2:8]    // Include lines 2 through 8
 * @includeExample greet.example.ts[1:5]    // Include lines 1 through 5
 * @includeExample greet.example.ts[-5:-2]  // Include 5th-from-last to 2nd-from-last
 */
```

### Open-Ended Ranges

Include from a line to the end, or from the beginning to a line:

```typescript
/**
 * @includeExample greet.example.ts[5:]     // From line 5 to end of file
 * @includeExample greet.example.ts[:10]    // From beginning to line 10
 * @includeExample greet.example.ts[-5:]    // Last 5 lines
 * @includeExample greet.example.ts[:-3]    // All lines except last 3
 */
```

### Multiple Selections

Combine multiple line selections with commas:

```typescript
/**
 * @includeExample greet.example.ts[2:5,10,15:20]     // Lines 2-5, line 10, and lines 15-20
 * @includeExample greet.example.ts[1,3,5:8,12]       // Lines 1, 3, 5-8, and 12
 * @includeExample greet.example.ts[10:15,20:25,-1]   // Lines 10-15, 20-25, and last line
 */
```

### Exclusion Syntax

Use the `!` prefix to exclude specific lines or ranges:

```typescript
/**
 * @includeExample greet.example.ts[1:20,!8:12]       // Lines 1-20 except lines 8-12
 * @includeExample greet.example.ts[:10,!3,!7]        // Lines 1-10 except lines 3 and 7
 * @includeExample greet.example.ts[5:15,!10]         // Lines 5-15 except line 10
 * @includeExample greet.example.ts[!1:3,!-2:]        // Entire file except lines 1-3 and last 2 lines
 */
```

## Example

```typescript
// math.example.ts
import { Calculator } from "./calculator";

const calc = new Calculator();

// Basic operations
calc.add(5, 3); // Line 6
calc.subtract(10, 4); // Line 7
calc.multiply(3, 7); // Line 8

// Advanced operations
calc.power(2, 8); // Line 11
calc.sqrt(16); // Line 12

// Error handling
try {
  calc.divide(10, 0); // Line 16
} catch (error) {
  console.error(error); // Line 18
}
```

```typescript
/**
 * Calculator class with various mathematical operations
 *
 * @includeExample math.example.ts[6:8]           // Show basic operations only
 * @includeExample math.example.ts[11:12]         // Show advanced operations only
 * @includeExample math.example.ts[15:19]         // Show error handling only
 * @includeExample math.example.ts[6:8,11:12]     // Show basic and advanced operations
 * @includeExample math.example.ts[1:19,!9:10]    // Show everything except empty lines
 */
class Calculator {
  // ... implementation
}
```

## Troubleshooting

### Common Issues

1. **File not found**: Ensure the example file exists and the path is correct
2. **Line numbers out of range**: Check that specified lines exist in the file
3. **Empty selection**: Verify that exclusions don't eliminate all lines
4. **Syntax errors**: Ensure bracket syntax is properly formatted

### Debugging Tips

1. **Start simple**: Begin with `@includeExample` (no brackets) to verify the file is found
2. **Check line numbers**: Use `[:]` to see all lines with their numbers
3. **Test incrementally**: Add line selections one at a time
4. **Verify exclusions**: Ensure `!` exclusions make sense with included ranges

### Error Messages

The plugin provides helpful error messages:

- `Example file not found: path/to/file.example.ts`
- `Line 25 is out of range (file has 20 lines)`
- `Invalid bracket syntax: [5:3]` (end before start)
- `Empty selection after applying exclusions`

## Migration from v2.x

The old colon syntax is no longer supported. Here's how to migrate:

```diff
- @includeExample path/to/file:15
+ @includeExample path/to/file[15]

- @includeExample path/to/file:2-4
+ @includeExample path/to/file[2:4]

- @includeExample path/to/file:2-4,15
+ @includeExample path/to/file[2:4,15]

- @includeExample path/to/file:5-
+ @includeExample path/to/file[5:]

- @includeExample path/to/file:-10
+ @includeExample path/to/file[:10]
```

The new bracket syntax is more powerful and supports negative indexing and exclusions that weren't possible with the old syntax.
