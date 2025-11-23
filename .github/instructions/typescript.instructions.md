## <!-- Based on: https://github.com/github/awesome-copilot/blob/main/instructions/typescript-5-es2022.instructions.md -->

applyTo: '**/\*.ts,**/\*.tsx'
description: 'TypeScript development standards targeting TypeScript 5.x for AntiGravity Agent'

---

# TypeScript Development Guidelines

Guidelines for TypeScript development targeting TypeScript 5.x and ES2022 output for the AntiGravity Agent desktop application.

## Core Principles

- Respect the existing architecture and coding standards
- Prefer readable, explicit solutions over clever shortcuts
- Extend current abstractions before inventing new ones
- Prioritize maintainability and clarity with clean, focused code

## General Guidelines

- Target TypeScript 5.x / ES2022 and prefer native features over polyfills
- Use pure ES modules; avoid CommonJS patterns
- Follow the project's build, lint, and test scripts
- Note design trade-offs when intent is not obvious
- Follow the repository's folder and responsibility layout for new code

## Naming and Style Conventions

- Use PascalCase for classes, interfaces, enums, and type aliases
- Use camelCase for variables, functions, and methods
- Skip interface prefixes like 'I'; rely on descriptive names
- Name entities for their behavior or domain meaning, not implementation
- Use kebab-case filenames (e.g., user-session.ts, data-service.ts)

## Type System Best Practices

- Avoid `any` (implicit or explicit); prefer `unknown` plus narrowing
- Use discriminated unions for state machines and event handling
- Centralize shared contracts instead of duplicating shapes
- Express intent with TypeScript utility types (Readonly, Partial, Record)
- Define proper interfaces for Tauri command parameters and responses
- Use branded types for domain-specific string types (paths, IDs)

## Async Programming and Error Handling

- Use async/await; wrap awaits in try/catch with structured errors
- Guard edge cases early to avoid deep nesting
- Send errors through the project's logging/telemetry utilities
- Surface user-facing errors via the repository's notification pattern
- Debounce configuration-driven updates appropriately
- Dispose resources deterministically in cleanup functions

## Architecture Patterns

- Follow the repository's dependency injection or composition pattern
- Keep modules single-purpose and focused
- Observe existing initialization and disposal sequences
- Keep transport, domain, and presentation layers decoupled with clear interfaces
- Supply lifecycle hooks (initialize, dispose) when adding services
- Use proper TypeScript module patterns for code organization

## Tauri-Specific TypeScript Patterns

- Define proper types for all Tauri command interfaces
- Use type-safe Tauri invoke patterns with proper error handling
- Implement TypeScript definitions for Tauri events and state
- Use branded types for Tauri-specific data (file paths, window labels)
- Define proper interfaces for configuration and settings types

## External Integrations

- Instantiate clients outside hot paths and inject them for testability
- Never hardcode secrets; load them from secure configuration sources
- Apply retries, backoff, and cancellation to network or IO calls
- Normalize external responses and map errors to domain shapes
- Use proper TypeScript definitions for external API responses

## Security Practices

- Validate and sanitize external input with schema validators or type guards
- Avoid dynamic code execution and untrusted template rendering
- Encode untrusted content before rendering; use framework escaping
- Use parameterized approaches to prevent injection attacks
- Keep secrets in secure storage and request least-privilege scopes
- Favor immutable flows and defensive copies for sensitive data

## Configuration and Settings

- Reach configuration through shared helpers and validate with schemas
- Handle configuration via the project's secure storage patterns
- Guard undefined and error states appropriately
- Document new configuration keys and update related tests
- Use proper TypeScript definitions for all configuration shapes

## Performance and Reliability

- Lazy-load heavy dependencies and dispose them when done
- Defer expensive work until users need it
- Batch or debounce high-frequency events to reduce thrash
- Track resource lifetimes to prevent leaks
- Use proper TypeScript patterns for performance-critical code

## Testing Expectations

- Add or update unit tests with proper TypeScript typing
- Expand integration or end-to-end suites when behavior crosses modules
- Run targeted test scripts for quick feedback
- Avoid brittle timing assertions; prefer fake timers or injected clocks
- Use proper TypeScript test utilities and mocking patterns

## Documentation Standards

- Add JSDoc to public APIs with proper TypeScript integration
- Include @remarks or @example when helpful for complex types
- Write comments that capture intent and design decisions
- Remove stale notes during refactors
- Update architecture docs when introducing significant TypeScript patterns
