# Contributing to typedoc-plugin-include-example

Thank you for your interest in contributing to our project. This guide will help you set up your environment and understand our contribution process.

## Setting Up Your Environment

We offer two methods to set up your development environment:

### Option 1: Using Docker (Recommended)

1. Ensure you have Docker and Docker Compose installed on your system.
2. Run the following command in the project root:

```
docker compose up -d --build 
```
 
Run this command everytime you need to verify your modifications.
 
### Option 2: Manual Setup
 
If you prefer not to use Docker, follow these steps:
 
1. Install project dependencies:

```
npm install 
```

2. Set up Playwright:

```
npx playwright install deps
npx playwright install
```

3. Build the project:

```
npm run build 
```

## Code Coverage and Testing

We use Stryker for code coverage verification. If you add new code, you'll likely need to add corresponding tests with Vitest. Pull requests with insufficient code coverage will not pass the build process.

## Feature Demonstrations and Integration Testing

- Each new feature must include a demonstration.
- Every demonstration should be accompanied by an integration test using Playwright.
- These tests ensure the stability and functionality of new features with future versions of typedoc.

By following these guidelines, you'll help maintain the quality and reliability of our project. Thank you for your contributions!
