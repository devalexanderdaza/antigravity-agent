---
description: "Main GitHub Copilot instructions for AntiGravity Agent - Tauri + React + TypeScript desktop application"
applyTo: "**/*"
---

# AntiGravity Agent - Copilot Instructions

AntiGravity Agent is a modern desktop application built with Tauri, React 19, and TypeScript 5. This application provides a sophisticated system tray interface for managing antigravity processes with advanced backup, configuration, and monitoring capabilities.

## Project Overview

**Technology Stack:**

- **Frontend**: React 19 + TypeScript 5 + Vite
- **Backend**: Rust + Tauri
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: Custom component library with shadcn/ui patterns
- **State Management**: React hooks + Custom hooks
- **Testing**: Vitest + React Testing Library (when implemented)

**Architecture Pattern:**

- **Frontend**: Component-based architecture with custom hooks
- **Backend**: Rust commands with proper error handling
- **Communication**: Tauri IPC bridge between frontend and backend
- **Configuration**: JSON-based with encryption support
- **System Integration**: System tray, window management, and process monitoring

## Core Development Principles

1. **Modern React Patterns**: Use React 19 features, functional components with hooks, and proper TypeScript integration
2. **Tauri Best Practices**: Leverage Rust backend for system operations, secure IPC communication, and proper error handling
3. **Type Safety**: Comprehensive TypeScript usage with strict mode and proper interface definitions
4. **Security First**: Implement proper encryption, input validation, and secure configuration management
5. **User Experience**: Focus on intuitive system tray integration and responsive UI patterns
6. **Performance**: Optimize for desktop application performance with proper state management and efficient rendering

## File Organization

```
src/                     # React frontend source
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # Business logic and API communication
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
src-tauri/              # Rust backend source
├── src/                # Rust source code
├── capabilities/       # Tauri capabilities configuration
└── icons/              # Application icons
```

## Development Guidelines

### Code Quality

- Follow existing code patterns and architectural decisions
- Use descriptive variable and function names
- Write self-documenting code with meaningful comments
- Implement proper error handling and user feedback
- Maintain consistent code formatting with project standards

### React Development

- Use functional components with hooks exclusively
- Implement custom hooks for reusable logic
- Follow component composition patterns
- Use TypeScript interfaces for all props and state
- Implement proper loading states and error boundaries

### Tauri Integration

- Use Tauri commands for all backend communication
- Implement proper error handling in Rust commands
- Follow secure coding practices for system operations
- Use appropriate Tauri APIs for system integration

### Security Considerations

- Validate all user inputs
- Use encryption for sensitive configuration data
- Implement proper error messages without exposing sensitive information
- Follow Tauri security best practices for IPC communication

## Testing Strategy

- Write unit tests for utility functions and hooks
- Implement component tests for UI components
- Test Rust backend logic with appropriate Rust testing frameworks
- Focus on critical paths: configuration management, backup/restore, and system integration

## Performance Considerations

- Optimize React rendering with proper dependency arrays
- Use React.memo for expensive component renders
- Implement efficient state updates to prevent unnecessary re-renders
- Optimize Tauri commands for performance
- Consider desktop application memory usage patterns

When contributing to this project, ensure your code follows these guidelines and integrates seamlessly with the existing architecture.
