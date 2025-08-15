# Zuno Learning Platform - Testing Documentation

This directory contains comprehensive tests for the Zuno learning platform, organized by test type and scope.

## Test Structure

```
tests/
├── e2e/                    # End-to-end tests (Playwright)
├── factories/              # Test data factories
├── mocks/                  # MSW API mocks
├── tasks/                  # Task completion tests
└── run-all-tests.ts        # Comprehensive test runner

src/
├── **/*.test.ts(x)         # Unit tests (alongside source files)
└── test/
    ├── setup.ts            # Test setup and global mocks
    └── utils.tsx           # Test utilities and helpers
```

## Test Types

### Unit Tests
- **Location**: `src/**/*.test.ts(x)` (alongside source files)
- **Purpose**: Test individual functions, utilities, and components in isolation
- **Examples**: 
  - `src/utils/accessibility.test.ts`
  - `src/components/ui/button.test.tsx`
  - `src/hooks/useAmplifyData.test.ts`

### Integration Tests
- **Location**: `src/**/*.test.tsx` (component tests with context)
- **Purpose**: Test component interactions, context integration, and API behavior
- **Examples**:
  - `src/components/CoachSelection.test.tsx`
  - `src/components/CourseCatalog.test.tsx`

### Task Completion Tests
- **Location**: `tests/tasks/`
- **Purpose**: Ensure completed development tasks remain completed across sessions
- **Critical**: These tests prevent regression of completed work

### End-to-End Tests
- **Location**: `tests/e2e/`
- **Purpose**: Test complete user workflows across the application
- **Examples**:
  - `tests/e2e/auth.spec.ts` - Authentication flows
  - `tests/e2e/course-catalog.spec.ts` - Course browsing and enrollment

## Running Tests

### Quick Commands
```bash
# Run all unit and integration tests
bun test

# Run tests with coverage
bun test:coverage

# Run tests in watch mode
bun test:watch

# Run E2E tests
bun test:e2e

# Run task completion tests
bun test:tasks

# Run comprehensive test suite
bun tests/run-all-tests.ts --coverage --e2e
```

### Test Runner Options
```bash
# Run with coverage report
bun tests/run-all-tests.ts --coverage

# Run in watch mode (unit/integration only)
bun tests/run-all-tests.ts --watch

# Include E2E tests
bun tests/run-all-tests.ts --e2e

# Verbose output
bun tests/run-all-tests.ts --verbose
```

## Test Configuration

### Vitest Configuration
- **File**: `vitest.config.ts`
- **Environment**: jsdom (for React components)
- **Setup**: `src/test/setup.ts`
- **Coverage**: v8 provider with 70% thresholds

### Playwright Configuration
- **File**: `playwright.config.ts`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome/Safari
- **Base URL**: `http://localhost:8080`
- **Features**: Screenshots on failure, video recording, trace collection

## Test Utilities

### Factories (`tests/factories/`)
- `userFactory.ts` - Create mock users and profiles
- `courseFactory.ts` - Create mock courses and lessons
- `coachFactory.ts` - Create mock coach personalities and contexts

### Mocks (`tests/mocks/`)
- `handlers.ts` - MSW request handlers for API mocking
- `server.ts` - MSW server setup for Node.js tests

### Test Utilities (`src/test/utils.tsx`)
- Custom render function with providers
- Mock helpers for DOM APIs
- Test data creation utilities
- Common testing patterns

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest'
import { myUtilFunction } from './myUtil'

describe('myUtilFunction', () => {
  it('should return expected result', () => {
    const result = myUtilFunction('input')
    expect(result).toBe('expected')
  })
})
```

### Component Test Example
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test'

test('should complete user flow', async ({ page }) => {
  await page.goto('/')
  await page.click('button[data-testid="start"]')
  await expect(page.locator('h1')).toContainText('Welcome')
})
```

## Test Coverage

### Coverage Thresholds
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Coverage Reports
- **HTML**: `coverage/index.html`
- **JSON**: `coverage/coverage-final.json`
- **Text**: Console output during test runs

## Best Practices

### Test Scope
- **Unit Tests**: Pure functions, utilities, custom hooks
- **Integration Tests**: Component interactions, context behavior, API integration
- **E2E Tests**: Critical user flows (auth, course enrollment, lesson completion)

### Test Focus
- Test user-visible behavior, not implementation details
- Focus on data contracts and component interfaces
- Ensure accessibility compliance in component tests
- Validate error handling and edge cases

### Mock Strategy
- Mock external dependencies (AWS Amplify, APIs)
- Use MSW for HTTP request mocking
- Create realistic test data with factories
- Mock browser APIs (localStorage, IntersectionObserver, etc.)

### Accessibility Testing
- Include accessibility assertions in component tests
- Test keyboard navigation and screen reader compatibility
- Validate ARIA attributes and semantic HTML
- Ensure color contrast and touch target compliance

## Continuous Integration

### GitHub Actions (if configured)
```yaml
- name: Run Tests
  run: |
    bun install
    bun tests/run-all-tests.ts --coverage --e2e
```

### Pre-commit Hooks (if configured)
- Run unit tests on changed files
- Ensure task completion tests pass
- Validate TypeScript compilation
- Run ESLint checks

## Troubleshooting

### Common Issues
1. **Tests fail after dependency updates**: Update mocks and test setup
2. **E2E tests timeout**: Increase timeout or check dev server startup
3. **Coverage drops**: Add tests for new code or update thresholds
4. **Task completion tests fail**: Check if completed tasks were modified

### Debug Tips
- Use `--verbose` flag for detailed output
- Check browser console in E2E tests
- Use `screen.debug()` in component tests
- Verify mock setup in failing tests

## Contributing

When adding new features:
1. Write unit tests for utilities and pure functions
2. Write integration tests for components with context
3. Add E2E tests for new user flows
4. Update task completion tests if needed
5. Ensure coverage thresholds are met

When fixing bugs:
1. Write a failing test that reproduces the bug
2. Fix the bug
3. Ensure the test passes
4. Add regression tests if needed