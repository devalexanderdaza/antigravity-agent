---
applyTo: "**/*"
description: "Code review standards and GitHub review guidelines for AntiGravity Agent"
---

# Code Review Guidelines

Comprehensive code review standards for AntiGravity Agent, ensuring high quality, security, and maintainability across the Tauri + React + TypeScript codebase.

## Review Philosophy

- **Constructive Feedback**: Provide specific, actionable suggestions for improvement
- **Learning Focus**: Use reviews as opportunities to share knowledge and best practices
- **Quality Gates**: Ensure code meets project standards before merging
- **Security First**: Prioritize security considerations in all reviews
- **User Experience**: Consider the impact on end users and system stability

## Review Checklist

### General Code Quality

- [ ] **Functionality**: Code accomplishes its intended purpose correctly
- [ ] **Readability**: Code is clear, well-organized, and self-documenting
- [ ] **Performance**: No obvious performance issues or inefficiencies
- [ ] **Error Handling**: Comprehensive error handling with user-friendly messages
- [ ] **Security**: Input validation, sanitization, and secure practices
- [ ] **Testing**: Adequate test coverage for new and modified code

### React/TypeScript Specific

- [ ] **Type Safety**: Proper TypeScript usage with strict typing
- [ ] **Component Design**: Well-structured, reusable components
- [ ] **Hook Usage**: Correct use of React hooks with proper dependencies
- [ ] **State Management**: Appropriate state management patterns
- [ ] **Performance**: Optimized rendering and memory usage
- [ ] **Accessibility**: WCAG compliance and keyboard navigation

### Tauri/Rust Specific

- [ ] **Command Structure**: Well-defined Tauri commands with proper signatures
- [ ] **Input Validation**: All parameters validated and sanitized
- [ ] **Error Types**: Structured error handling with appropriate error types
- [ ] **Security**: Safe file operations and system integration
- [ ] **Documentation**: Clear parameter and return type documentation
- [ ] **Testing**: Unit tests for Rust backend logic

### Desktop Application

- [ ] **System Integration**: Proper system tray, window, and notification handling
- [ ] **Cross-Platform**: Compatibility across supported operating systems
- [ ] **Resource Management**: Efficient resource usage and cleanup
- [ ] **Configuration**: Secure configuration management and persistence
- [ ] **Process Management**: Safe process operations and monitoring

## Review Process

### 1. Pre-Review Setup

```bash
# Reviewer preparation steps
git checkout main
git pull origin main
git checkout -b review/pr-<number>
git pull origin <branch-name>

# Run basic checks
npm install
npm run type-check
npm run lint
npm test -- --run
```

### 2. Review Stages

#### First Pass: High-Level Review

- **Architecture**: Does the change fit with existing system design?
- **Scope**: Is the change focused and appropriately sized?
- **Requirements**: Does it meet the stated requirements?
- **Breaking Changes**: Are there any compatibility issues?

#### Second Pass: Detailed Code Review

- **Implementation**: Review specific code quality and patterns
- **Edge Cases**: Consider error scenarios and boundary conditions
- **Performance**: Analyze performance implications
- **Security**: Review for security vulnerabilities

#### Third Pass: Testing and Documentation

- **Test Coverage**: Verify adequate test coverage
- **Test Quality**: Review test implementation and scenarios
- **Documentation**: Check for updated documentation
- **Examples**: Verify code examples and usage patterns

### 3. Common Review Comments

#### Positive Reinforcement

```markdown
✅ **Great use of TypeScript generics here!** This makes the function reusable across different data types while maintaining type safety.

✅ **Excellent error handling** - the user will get clear feedback about what went wrong and how to resolve it.

✅ **Good performance optimization** with useMemo - this prevents unnecessary recalculations on re-renders.
```

#### Constructive Feedback

````markdown
💡 **Consider extracting this logic into a custom hook** - it could be reusable in other components and would improve testability.

```typescript
// Suggested refactor
const useDataFetching = (url: string) => {
  // Extract the logic here
};
```
````

🔒 **Security consideration**: This file path should be validated to prevent directory traversal attacks.

```rust
// Add path validation
if path.contains("..") {
    return Err(ConfigError::InvalidPath);
}
```

⚡ **Performance note**: This operation runs on every render - consider memoizing it.

```typescript
const expensiveValue = useMemo(() => computeExpensiveValue(data), [data]);
```

````

#### Critical Issues
```markdown
🚨 **Critical Security Issue**: User input is not being sanitized before database insertion, which could lead to injection attacks.

🚨 **Breaking Change**: This modifies the public API and will break existing integrations.

🚨 **Memory Leak**: Event listener is not cleaned up in useEffect cleanup function.
````

### 4. GitHub Review Features

#### Review Status

- **Request Changes**: For critical issues that must be fixed before merge
- **Approve**: For code that meets all standards and requirements
- **Comment**: For suggestions and minor issues that don't block merge

#### Review Tools

- **Suggested Changes**: Use GitHub's suggestion feature for small fixes
- **Line Comments**: Comment on specific lines for targeted feedback
- **General Comments**: Use for overall architecture or approach discussions
- **File Comments**: Comment on entire files for broader organizational feedback

## Review Standards by File Type

### React Components (.tsx)

```typescript
// Review for:
// - Proper TypeScript interfaces
// - Component composition patterns
// - Accessibility attributes
// - Error boundaries
// - Performance considerations

interface ComponentProps {
  // Clear, typed prop definitions
  title: string;
  onAction?: (action: ActionType) => void;
  children?: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({
  title,
  onAction,
  children,
}) => {
  // Review implementation for best practices
};
```

### Tauri Commands (.rs)

```rust
// Review for:
// - Input validation
// - Error handling
// - Security considerations
// - Documentation
// - Return type appropriateness

/// Get application configuration with validation
///
/// # Arguments
/// * `config_type` - Type of configuration ("user", "system")
///
/// # Errors
/// Returns error if configuration cannot be read or is invalid
#[tauri::command]
pub async fn get_config(config_type: String) -> Result<ConfigData, ConfigError> {
    // Review implementation
}
```

### Custom Hooks (.ts)

```typescript
// Review for:
// - Proper hook patterns
// - Dependency management
// - Error handling
// - Reusability
// - Testing considerations

export const useCustomLogic = (param: string) => {
  const [state, setState] = useState();

  useEffect(() => {
    // Review effect implementation and dependencies
  }, [param]); // Are all dependencies listed?

  return { state, actions };
};
```

## Automated Review Tools

### Linting and Formatting

- **ESLint**: Enforces code style and catches common issues
- **Prettier**: Consistent code formatting
- **TypeScript**: Type checking and compilation errors
- **Clippy**: Rust linting and best practices

### CI/CD Integration

- **Automated Tests**: All tests must pass before review approval
- **Type Checking**: TypeScript compilation must succeed
- **Security Scanning**: Dependency vulnerability checks
- **Performance Testing**: Bundle size and performance regression checks

## Review Metrics and Goals

### Quality Metrics

- **Review Coverage**: All PRs must be reviewed by at least one team member
- **Review Turnaround**: Reviews completed within 24-48 hours
- **Defect Rate**: Track issues found in production vs. caught in review
- **Security Issues**: Zero security vulnerabilities merged to main

### Learning and Improvement

- **Knowledge Sharing**: Use reviews to share expertise across team
- **Pattern Documentation**: Document new patterns discovered in reviews
- **Retrospectives**: Regular review process improvement sessions
- **Training**: Identify areas where team needs additional training

## Conflict Resolution

### Technical Disagreements

1. **Discussion**: Engage in constructive technical discussion
2. **Research**: Provide evidence and references for positions
3. **Experimentation**: Create proof-of-concepts when helpful
4. **Escalation**: Involve senior team members when consensus isn't reached
5. **Documentation**: Record decisions for future reference

### Review Process Issues

- **Slow Reviews**: Establish review rotation and SLA expectations
- **Inconsistent Standards**: Regular calibration sessions with team
- **Overwhelming Feedback**: Focus on most critical issues first
- **Learning Curve**: Pair newer team members with experienced reviewers

## Best Practices for Reviewers

### Effective Communication

- **Be Specific**: Point to exact lines and provide concrete suggestions
- **Explain Why**: Help the author understand the reasoning behind feedback
- **Offer Alternatives**: Suggest specific improvements rather than just identifying problems
- **Acknowledge Good Work**: Recognize well-implemented solutions and learning
- **Ask Questions**: Use questions to understand intent and explore alternatives

### Review Efficiency

- **Focus on Important Issues**: Prioritize security, functionality, and maintainability
- **Use Tools**: Leverage automated checks to focus on higher-level concerns
- **Batch Comments**: Provide comprehensive feedback in fewer review cycles
- **Follow Up**: Check that feedback is addressed appropriately

### Continuous Improvement

- **Learn from Reviews**: Use reviews as learning opportunities
- **Update Standards**: Evolve review criteria based on project needs
- **Share Knowledge**: Document and share interesting findings with the team
- **Measure Impact**: Track how reviews improve overall code quality

This comprehensive review process ensures that all code merged into AntiGravity Agent meets high standards for quality, security, and maintainability while fostering a collaborative learning environment for the development team.
