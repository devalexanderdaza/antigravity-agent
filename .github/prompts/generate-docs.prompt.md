---
agent: "agent"
model: Claude Sonnet 4
tools: ["codebase", "search", "new"]
description: "Generate comprehensive documentation for AntiGravity Agent components and features"
---

# Documentation Generator

Generate comprehensive, up-to-date documentation for AntiGravity Agent components, APIs, and features.

## Documentation Types

### API Documentation

- **Tauri Commands**: Document all backend commands with parameters and return types
- **React Components**: Document component props, usage, and examples
- **Custom Hooks**: Document hook parameters, return values, and usage patterns
- **Utility Functions**: Document function signatures, parameters, and use cases

### User Documentation

- **Feature Guides**: Step-by-step instructions for using application features
- **Configuration**: Documentation for all configuration options and settings
- **Troubleshooting**: Common issues and their solutions
- **Installation**: Setup and deployment instructions

### Developer Documentation

- **Architecture**: System design and component relationships
- **Contributing**: Guidelines for contributing to the project
- **Testing**: Testing strategies and running tests
- **Build Process**: Development setup and build instructions

## Documentation Standards

### Structure Template

````markdown
# Component/Feature Name

## Overview

Brief description of what this component/feature does and its purpose.

## Usage

### Basic Usage

```typescript
// Code example showing basic usage
```
````

### Advanced Usage

```typescript
// Code example showing advanced features
```

## API Reference

### Props/Parameters

| Name  | Type    | Default   | Description          |
| ----- | ------- | --------- | -------------------- |
| prop1 | string  | undefined | Description of prop1 |
| prop2 | boolean | false     | Description of prop2 |

### Return Value

Description of what the component/function returns.

## Examples

### Example 1: Basic Implementation

```typescript
// Complete working example
```

### Example 2: Advanced Features

```typescript
// Example showing advanced usage
```

## Security Considerations

- Important security notes and best practices
- Input validation requirements
- Permission and access control notes

## Performance Notes

- Performance characteristics
- Optimization tips
- Resource usage considerations

## Troubleshooting

### Common Issues

- Issue 1: Description and solution
- Issue 2: Description and solution

## Related

- Links to related components/features
- References to additional documentation

````

### Component Documentation Template
```typescript
/**
 * @component ComponentName
 * @description Brief description of what this component does
 *
 * @example
 * ```tsx
 * <ComponentName
 *   title="Example Title"
 *   onAction={handleAction}
 * >
 *   Content goes here
 * </ComponentName>
 * ```
 *
 * @param {ComponentNameProps} props - The component props
 * @param {string} props.title - The title to display
 * @param {() => void} props.onAction - Callback for action events
 * @param {React.ReactNode} props.children - Child elements
 *
 * @returns {JSX.Element} The rendered component
 *
 * @see {@link RelatedComponent} for similar functionality
 * @since 1.0.0
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  onAction,
  children
}) => {
  // Component implementation
};
````

### Tauri Command Documentation

````rust
/// Get application configuration
///
/// # Arguments
///
/// * `config_type` - The type of configuration to retrieve ("user", "system", "default")
/// * `decrypt` - Whether to decrypt sensitive values
///
/// # Returns
///
/// Returns a `ConfigData` struct containing the configuration values
///
/// # Errors
///
/// This function will return an error if:
/// * The configuration file cannot be read
/// * The configuration is malformed
/// * Decryption fails (when decrypt=true)
///
/// # Example
///
/// ```typescript
/// const config = await invoke('get_config', {
///   configType: 'user',
///   decrypt: true
/// });
/// ```
///
/// # Security
///
/// This command requires read access to configuration files.
/// Sensitive values are only decrypted when explicitly requested.
#[tauri::command]
pub async fn get_config(config_type: String, decrypt: bool) -> Result<ConfigData, ConfigError> {
    // Implementation
}
````

## Documentation Generation Process

### 1. Code Analysis

- Extract component props and TypeScript interfaces
- Identify Tauri commands and their signatures
- Analyze custom hooks and utility functions
- Review existing JSDoc and comments

### 2. Content Generation

- Generate comprehensive API documentation
- Create usage examples and code snippets
- Document security and performance considerations
- Add troubleshooting information

### 3. Quality Assurance

- Verify code examples compile and work correctly
- Check for consistency in terminology and style
- Validate links and cross-references
- Ensure accessibility of documentation

## Desktop Application Documentation

### System Integration Features

- Document system tray functionality and context menus
- Explain window management and state preservation
- Document desktop notification usage
- Cover keyboard shortcuts and accessibility features

### Configuration and Settings

- Document all configuration options with examples
- Explain backup and restore procedures
- Document security settings and encryption options
- Cover platform-specific configurations

### Process Management

- Document process monitoring and control features
- Explain error handling and recovery procedures
- Document logging and diagnostic capabilities
- Cover performance monitoring and optimization

## Documentation Formats

### Markdown Documentation

- User guides and feature documentation
- Developer setup and contribution guides
- Architecture and design documentation
- Troubleshooting and FAQ sections

### JSDoc/TSDoc

- Inline code documentation
- API reference generation
- Type definitions and interfaces
- Function and method documentation

### README Files

- Project overview and quick start guides
- Installation and setup instructions
- Basic usage examples
- Links to detailed documentation

## Interactive Documentation

### Code Examples

- Provide working, copy-paste ready examples
- Include both TypeScript and usage examples
- Show error handling and edge cases
- Demonstrate best practices

### Visual Aids

- Include screenshots for UI components
- Create diagrams for complex workflows
- Use flowcharts for decision processes
- Provide architecture diagrams

## Maintenance and Updates

### Automated Documentation

- Generate API docs from code comments
- Keep examples in sync with actual code
- Validate documentation during CI/CD
- Update version information automatically

### Review Process

- Regular documentation reviews for accuracy
- User feedback integration
- Performance and accessibility updates
- Link validation and cleanup

## Usage Instructions

1. **Specify the component, feature, or API to document**
2. **Indicate the target audience (users, developers, contributors)**
3. **Mention any specific requirements or focus areas**
4. **Provide any existing documentation to update or improve**
5. **Specify the desired output format (Markdown, JSDoc, README, etc.)**

The documentation generator will:

- Analyze the specified code or feature
- Generate comprehensive documentation following project standards
- Include practical examples and usage scenarios
- Cover security, performance, and troubleshooting aspects
- Ensure consistency with existing documentation style
