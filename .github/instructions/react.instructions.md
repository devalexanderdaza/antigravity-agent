## <!-- Based on: https://github.com/github/awesome-copilot/blob/main/instructions/reactjs.instructions.md -->

applyTo: '**/\*.jsx,**/\*.tsx'
description: 'React development standards and best practices for AntiGravity Agent'

---

# React Development Guidelines

Instructions for building high-quality React components following modern patterns, hooks, and best practices for the AntiGravity Agent desktop application.

## Project Context

- React 19+ with TypeScript for type safety
- Functional components with hooks as default
- Tauri desktop application architecture
- Custom component library with consistent design system
- System tray and desktop-focused UI patterns

## Component Architecture

- Use functional components with hooks exclusively
- Implement component composition over inheritance
- Organize components by feature or domain for scalability
- Separate presentational and container components clearly
- Use custom hooks for reusable stateful logic
- Implement proper component hierarchies with clear data flow

## TypeScript Integration

- Use TypeScript interfaces for all props, state, and component definitions
- Define proper types for event handlers and refs
- Implement generic components where appropriate
- Use strict mode in tsconfig.json for type safety
- Leverage React's built-in types (React.FC, React.ComponentProps, etc.)
- Create union types for component variants and states

## State Management

- Use useState for local component state
- Implement useReducer for complex state logic
- Leverage useContext for sharing state across component trees
- Use custom hooks for business logic abstraction
- Implement proper state normalization and data structures
- Consider Tauri state management for cross-component persistence

## Hooks and Effects

- Use useEffect with proper dependency arrays to avoid infinite loops
- Implement cleanup functions in effects to prevent memory leaks
- Use useMemo and useCallback for performance optimization when needed
- Create custom hooks for reusable stateful logic
- Follow the rules of hooks (only call at the top level)
- Use useRef for accessing DOM elements and storing mutable values

## Performance Optimization

- Use React.memo for component memoization when appropriate
- Implement code splitting with React.lazy and Suspense
- Optimize bundle size with tree shaking and dynamic imports
- Use useMemo and useCallback judiciously to prevent unnecessary re-renders
- Profile components with React DevTools to identify performance bottlenecks
- Consider desktop application memory usage patterns

## Error Handling

- Implement Error Boundaries for component-level error handling
- Use proper error states in data fetching
- Implement fallback UI for error scenarios
- Log errors appropriately for debugging
- Handle async errors in effects and event handlers
- Provide meaningful error messages to users

## Desktop Application Patterns

- Implement proper system tray integration patterns
- Use appropriate desktop UI components (tooltips, context menus)
- Handle window state management appropriately
- Consider desktop-specific user interactions
- Implement proper keyboard navigation for desktop users
- Use native desktop notification patterns when available

## Tauri Integration

- Use Tauri invoke functions for backend communication
- Implement proper loading and error states for Tauri commands
- Handle Tauri events and window management appropriately
- Use Tauri-specific React patterns for system integration
- Implement secure communication patterns between frontend and backend

## Security Best Practices

- Sanitize user inputs to prevent XSS attacks
- Validate and escape data before rendering
- Use HTTPS for external API calls
- Implement proper authentication and authorization patterns
- Avoid storing sensitive data in browser storage
- Follow Tauri security guidelines for desktop applications

## Accessibility

- Use semantic HTML elements appropriately
- Implement proper ARIA attributes and roles
- Ensure keyboard navigation works for all interactive elements
- Provide alt text for images and descriptive text for icons
- Implement proper color contrast ratios
- Test with screen readers and accessibility tools
- Consider desktop application accessibility patterns

## Testing Guidelines

- Write unit tests for components using React Testing Library
- Test component behavior, not implementation details
- Use Jest for test runner and assertion library
- Mock Tauri commands and external dependencies appropriately
- Test accessibility features and keyboard navigation
- Focus on critical user workflows and edge cases
