# Testing Framework

## Overview
This project uses Playwright for end-to-end testing and smoke tests.

## Running Tests

### Smoke Tests
\`\`\`bash
# Run smoke tests (build + lint + basic E2E)
pnpm test:smoke

# Run full E2E test suite
pnpm test:e2e
\`\`\`

### Local Development
\`\`\`bash
# Install Playwright browsers
npx playwright install

# Run tests in headed mode
npx playwright test --headed

# Run tests with UI mode
npx playwright test --ui
\`\`\`

## Test Structure

### Smoke Tests (`tests/smoke.spec.js`)
- Homepage loading
- Basic navigation
- Modal functionality
- Export accessibility

### E2E Tests (Future)
- Form submission workflows
- Data persistence
- Export functionality
- User management

## CI Integration
Tests run automatically on:
- Pull requests
- Pushes to main/develop branches
- Manual workflow dispatch

## Debugging
- Test results: `playwright-report/index.html`
- Screenshots: `test-results/`
- Traces: Available in test results for failed tests
