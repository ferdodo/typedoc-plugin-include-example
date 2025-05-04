
# Documentation

## Basic usage

Include the whole file as an example.

```javascript
/**
 * @includeExample
 */
function greet() {
}
```

## Specify file path

Include a specific file as an example.

```javascript
/**
 * @includeExample src/special-file.example.ts
 */
function greet() {
}
```

## Selecting specific lines

Include only the line 25 from the example.

```javascript
/**
 * @includeExample src/greet.example.ts:25
 */
function greet() {
}
```

## Selecting a line range

Include line 5 to 20 from the example.

```javascript
/**
 * @includeExample src/greet.example.ts:5-20
 */
function greet() {
}
```

## Multiple line selection

Include line 5 to 20 then line 22 then line 40 from the example.

```javascript
/**
 * @includeExample src/greet.example.ts:5-20,22,40
 */
function greet() {
}
```