## <!-- Based on: https://github.com/github/awesome-copilot/blob/main/prompts/javascript-typescript-jest.prompt.md -->

agent: 'agent'
model: Claude Sonnet 4
tools: ['codebase', 'edit/editFiles', 'runTests']
description: 'Generate comprehensive tests for React components and utilities'

---

# Test Generator for AntiGravity Agent

Generate comprehensive tests following React Testing Library and Jest best practices for the AntiGravity Agent desktop application.

## Testing Strategy

### React Component Testing

- Use React Testing Library for all component tests
- Test user behavior and component accessibility
- Query elements by accessibility roles, labels, or text content
- Use `userEvent` over `fireEvent` for realistic interactions
- Mock Tauri commands and external dependencies

### Test Structure Guidelines

```typescript
import { render, screen, userEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ComponentName } from "./ComponentName";

// Mock Tauri commands
vi.mock("@tauri-apps/api/tauri", () => ({
  invoke: vi.fn(),
}));

describe("ComponentName", () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render with required props", () => {
      // Test basic rendering
    });
  });

  describe("user interactions", () => {
    it("should handle click events", async () => {
      // Test user interactions
    });
  });

  describe("Tauri integration", () => {
    it("should call backend commands properly", async () => {
      // Test Tauri command integration
    });
  });
});
```

### Test Categories to Generate

1. **Rendering Tests**

   - Component renders without crashing
   - Props are displayed correctly
   - Conditional rendering works as expected
   - Default props are applied correctly

2. **User Interaction Tests**

   - Button clicks trigger correct callbacks
   - Form inputs update state appropriately
   - Keyboard navigation works correctly
   - Context menu interactions (for desktop app)

3. **Tauri Integration Tests**

   - Backend commands are invoked with correct parameters
   - Loading states are displayed during async operations
   - Error states are handled appropriately
   - Success responses update UI correctly

4. **Accessibility Tests**

   - Screen reader compatibility
   - Keyboard navigation
   - ARIA attributes are present
   - Focus management

5. **Edge Case Tests**
   - Empty or null props
   - Error scenarios
   - Network failures (for Tauri commands)
   - Large datasets or stress conditions

### Mocking Strategies

#### Tauri Commands

```typescript
const mockInvoke = vi.mocked(invoke);
mockInvoke.mockResolvedValue({ success: true, data: mockData });
```

#### Custom Hooks

```typescript
vi.mock("../hooks/useCustomHook", () => ({
  useCustomHook: () => ({
    data: mockData,
    loading: false,
    error: null,
  }),
}));
```

#### External Dependencies

```typescript
vi.mock("external-library", () => ({
  someFunction: vi.fn().mockReturnValue("mocked result"),
}));
```

### Test Data Patterns

- Use factory functions for creating test data
- Provide realistic data that matches actual usage
- Test with both valid and invalid data
- Consider edge cases in data structure

### Desktop Application Testing

- Test window state management
- Test system tray interactions
- Test desktop notifications
- Test file system operations (mocked)
- Test process management features

### Performance Testing Considerations

- Test with large datasets where applicable
- Verify memo and callback optimizations
- Test component re-rendering patterns
- Monitor memory usage in critical paths

## Usage Instructions

1. **Specify the component or function to test**
2. **Describe the expected behavior and edge cases**
3. **Indicate any Tauri backend dependencies**
4. **Mention specific user workflows to test**
5. **Note any performance or accessibility requirements**

The generator will create:

- Complete test file with proper imports
- Comprehensive test cases covering all scenarios
- Appropriate mocking for Tauri and external dependencies
- Accessibility and user interaction tests
- Performance and edge case coverage
