---
applyTo: "**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx"
description: "Testing standards and best practices for AntiGravity Agent"
---

# Testing Guidelines

Comprehensive testing strategy for the AntiGravity Agent desktop application covering React components, custom hooks, Tauri commands, and integration scenarios.

## Testing Philosophy

- Write tests that verify behavior, not implementation details
- Focus on user workflows and critical application paths
- Test error scenarios and edge cases thoroughly
- Maintain high test coverage for business-critical functionality
- Use appropriate testing tools for different layers of the application

## Frontend Testing (React + TypeScript)

- Use React Testing Library for component testing
- Test components from the user's perspective
- Query elements by accessibility roles, labels, or text content
- Use userEvent over fireEvent for realistic user interactions
- Mock Tauri commands and external dependencies appropriately
- Test custom hooks in isolation with proper test utilities

## Test Structure and Organization

- Place test files next to the code they test or in dedicated **tests** directories
- Use descriptive test names that explain expected behavior
- Organize tests with nested describe blocks for related functionality
- Follow the pattern: describe('Component/Function', () => { it('should do something', () => {}) })
- Use beforeEach and afterEach for proper test setup and cleanup

## Mocking Strategies

- Mock Tauri invoke calls for frontend component testing
- Use jest.mock() for module-level mocks
- Use jest.spyOn() for specific function mocks
- Mock external dependencies (file system, network, etc.) appropriately
- Reset mocks between tests to ensure test isolation
- Provide realistic mock data that matches actual usage patterns

## Testing Async Operations

- Use async/await syntax in tests for async operations
- Test loading states, success states, and error states
- Use resolves/rejects matchers for promise-based testing
- Set appropriate timeouts for slow operations
- Test race conditions and cancellation scenarios

## Tauri Command Testing

- Test Rust backend logic with unit tests
- Mock file system operations and external processes
- Test error handling and validation logic
- Use integration tests for complex command workflows
- Test security validation and input sanitization

## System Integration Testing

- Test critical workflows end-to-end
- Test system tray integration and window management
- Test configuration backup and restore functionality
- Test process management and monitoring capabilities
- Verify error handling across system boundaries

## Desktop Application Testing

- Test window state management (minimize, restore, close)
- Test system tray functionality and context menus
- Test desktop notifications and user feedback
- Test keyboard shortcuts and accessibility features
- Consider platform-specific behavior in tests

## Performance Testing

- Test component rendering performance with large data sets
- Test memory usage patterns for long-running operations
- Test application startup and shutdown performance
- Monitor resource usage in tests where appropriate

## Security Testing

- Test input validation and sanitization
- Test configuration encryption and decryption
- Test file path validation and access controls
- Verify that sensitive information is not exposed
- Test authentication and authorization workflows

## Accessibility Testing

- Test keyboard navigation throughout the application
- Verify proper ARIA attributes and semantic markup
- Test screen reader compatibility
- Test color contrast and visual accessibility
- Use automated accessibility testing tools where possible

## Test Data Management

- Use factories or builders for creating test data
- Provide realistic test data that covers edge cases
- Use snapshot testing sparingly for stable UI components
- Clean up test data and temporary files after tests
- Use deterministic test data to ensure reproducible tests

## Continuous Integration

- Run tests automatically on all pull requests
- Ensure tests pass on all target platforms
- Generate test coverage reports and maintain coverage standards
- Run security and performance tests in CI pipeline
- Integrate accessibility testing into automated workflows
