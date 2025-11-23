---
applyTo: "src-tauri/**/*.rs,**/*.ts,**/*.tsx"
description: "Tauri development standards and best practices for desktop application development"
---

# Tauri Development Guidelines

Best practices for developing desktop applications with Tauri, focusing on the Rust backend and TypeScript frontend integration.

## Project Architecture

- Rust backend handles all system operations, file I/O, and process management
- React frontend provides user interface and application state management
- Tauri IPC bridge ensures secure communication between frontend and backend
- System tray integration for background operation and quick access
- Configuration management with encryption and secure storage

## Rust Backend Development

- Use structured error handling with custom error types
- Implement proper logging for debugging and monitoring
- Follow Rust best practices for memory safety and performance
- Use appropriate Rust crates for system operations (serde, tokio, etc.)
- Implement proper input validation for all command parameters
- Use async patterns for non-blocking operations

## Tauri Commands

- Define clear, single-purpose commands for specific operations
- Use proper parameter and return type definitions
- Implement comprehensive error handling with user-friendly messages
- Validate all input parameters before processing
- Use appropriate Tauri command attributes and permissions
- Document command purposes and expected behavior

## IPC Communication

- Use invoke() for command calls from frontend to backend
- Implement proper TypeScript definitions for all command interfaces
- Handle async operations with proper loading and error states
- Use Tauri events for backend-to-frontend communication when needed
- Implement proper error propagation and user feedback

## Security Best Practices

- Follow Tauri security guidelines and CSP configuration
- Validate all user inputs on the Rust backend
- Use secure storage for sensitive configuration data
- Implement proper file path validation and sandboxing
- Use appropriate Tauri capabilities and permissions
- Avoid exposing sensitive system information to the frontend

## System Integration

- Implement proper system tray functionality with context menus
- Handle window state management (minimize to tray, restore, etc.)
- Use appropriate system notifications and user feedback
- Implement proper application lifecycle management
- Handle system events appropriately (shutdown, sleep, etc.)

## Configuration Management

- Use JSON or TOML for configuration files with proper validation
- Implement encryption for sensitive configuration data
- Provide configuration migration and backup capabilities
- Use proper default values and validation schemas
- Handle configuration errors gracefully with user feedback

## Process Management

- Implement safe process spawning and monitoring
- Use proper process cleanup and resource management
- Handle process errors and unexpected termination gracefully
- Implement process status monitoring and reporting
- Use appropriate timeout and retry mechanisms

## File System Operations

- Validate all file paths and prevent directory traversal
- Use proper file locking and atomic operations when needed
- Implement backup and restore functionality safely
- Handle file system errors gracefully with user feedback
- Use appropriate file permissions and access controls

## Error Handling

- Define custom error types for different error categories
- Provide meaningful error messages to users
- Log detailed error information for debugging
- Handle recoverable errors gracefully
- Implement proper error propagation from backend to frontend

## Performance Considerations

- Use async operations for I/O-bound tasks
- Implement proper resource cleanup and memory management
- Optimize for desktop application performance patterns
- Use appropriate caching strategies for frequently accessed data
- Monitor memory usage and prevent leaks

## Testing Strategy

- Write unit tests for Rust backend logic
- Test Tauri commands with proper mocking
- Implement integration tests for critical workflows
- Test error handling and edge cases
- Use appropriate Rust testing frameworks and patterns

## Build and Deployment

- Configure proper Tauri build settings for target platforms
- Use appropriate code signing and packaging options
- Implement proper version management and updates
- Configure build optimizations for production releases
- Test on target platforms before deployment
