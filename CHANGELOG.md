# Changelog

## [3.0.0] - 2024-12-19

### 🚀 Features

- **Python-like slicing syntax**: New bracket syntax for line selection with advanced features
  - Single line: `path/to/file[10]`
  - Open-ended ranges: `path/to/file[2:]` or `path/to/file[:5]`
  - Closed range: `path/to/file[1:5]`
  - Multiple selections: `path/to/file[2:5,10]`
  - Exclusions: `path/to/file[1:10,!5:7]` or `path/to/file[:10,!3,!7]`
  - Negative indexing: `path/to/file[-5]`, `path/to/file[-5:]`, `path/to/file[:-5]`, `path/to/file[-5:-2]`

### 💥 BREAKING CHANGES

- **Colon syntax deprecated**: The old colon-based syntax (`path/to/file:2-4`) is no longer supported
- **Migration required**: All existing colon syntax must be migrated to bracket syntax
- **Version requirement**: Requires TypeDoc 0.26.x, 0.27.x, or 0.28.x

### 🔄 Migration Guide

#### Old Syntax → New Syntax

```diff
- @includeExample path/to/file:15
+ @includeExample path/to/file[15]

- @includeExample path/to/file:2-4
+ @includeExample path/to/file[2:4]

- @includeExample path/to/file:2-4,15
+ @includeExample path/to/file[2:4,15]
```

#### New Advanced Features

```typescript
// Negative indexing (last 5 lines)
@includeExample path/to/file[-5:]

// Exclusions (lines 1-10 except 5-7)
@includeExample path/to/file[1:10,!5:7]

// Open-ended ranges (from line 5 to end)
@includeExample path/to/file[5:]
```

### 🛠️ Technical Changes

- Complete rewrite of line selector parsing system
- New `ParsedLineSelector` interface for complex syntax support
- Enhanced error handling with descriptive migration messages
- Full backwards compatibility detection
- Comprehensive test coverage (52 tests)

### 📦 Dependencies

- No new dependencies added
- Maintains compatibility with existing TypeDoc versions
