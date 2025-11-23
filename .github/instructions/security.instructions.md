---
applyTo: "**/*"
description: "Security best practices and guidelines for AntiGravity Agent desktop application"
---

# Security Guidelines

Security best practices for developing a secure desktop application with Tauri, focusing on data protection, input validation, and secure system integration.

## Tauri Security Framework

- Follow Tauri security guidelines and CSP (Content Security Policy) configuration
- Use appropriate Tauri capabilities and permissions with principle of least privilege
- Configure proper allowlist for Tauri commands and APIs
- Implement secure IPC communication patterns
- Use Tauri's built-in security features for file system access

## Input Validation and Sanitization

- Validate all user inputs on both frontend and backend
- Sanitize data before processing or storage
- Use proper type checking and schema validation
- Implement bounds checking for numeric inputs
- Validate file paths to prevent directory traversal attacks
- Escape output data appropriately for the context

## Configuration and Data Security

- Encrypt sensitive configuration data at rest
- Use secure key derivation and storage mechanisms
- Implement proper configuration backup encryption
- Avoid storing sensitive data in plaintext files
- Use secure random number generation for cryptographic operations
- Implement proper key rotation and management

## File System Security

- Validate all file paths and prevent unauthorized access
- Use proper file permissions and access controls
- Implement secure temporary file handling
- Avoid following symbolic links without validation
- Use atomic file operations to prevent race conditions
- Clean up temporary files and sensitive data properly

## Process Management Security

- Validate process execution parameters
- Use proper sandboxing and isolation techniques
- Implement secure process communication patterns
- Monitor and log process activities appropriately
- Handle process cleanup and resource management securely
- Prevent injection attacks in process arguments

## Network Security (if applicable)

- Use HTTPS for all external communications
- Validate SSL/TLS certificates properly
- Implement proper timeout and retry mechanisms
- Sanitize data received from external sources
- Use secure authentication and authorization patterns
- Implement rate limiting and abuse prevention

## Error Handling and Information Disclosure

- Avoid exposing sensitive information in error messages
- Log detailed errors for debugging without exposing to users
- Implement proper error boundaries and fallback mechanisms
- Use generic error messages for user-facing errors
- Sanitize stack traces and debug information

## Authentication and Authorization

- Implement proper user authentication mechanisms
- Use secure session management patterns
- Implement role-based access controls where needed
- Validate user permissions before executing operations
- Use secure password storage and validation
- Implement proper logout and session cleanup

## Cryptographic Security

- Use established, vetted cryptographic libraries
- Implement proper key generation and management
- Use appropriate encryption algorithms and modes
- Implement proper random number generation
- Handle cryptographic failures gracefully
- Keep cryptographic libraries and dependencies updated

## Dependency Security

- Regularly audit and update dependencies
- Use security scanning tools for dependency vulnerabilities
- Pin dependency versions to prevent supply chain attacks
- Remove unused dependencies and minimize attack surface
- Use official package sources and verify checksums
- Monitor security advisories for used dependencies

## Logging and Monitoring

- Implement comprehensive security logging
- Log security-relevant events (authentication, access, errors)
- Avoid logging sensitive information (passwords, keys, personal data)
- Implement log rotation and secure storage
- Monitor for suspicious activities and patterns
- Use structured logging for security analysis

## Desktop Application Security

- Implement proper window and system tray security
- Validate system integration points
- Use secure inter-process communication
- Implement proper application signing and verification
- Handle system events securely
- Protect against desktop-specific attack vectors

## Code Security Practices

- Use static analysis tools to identify security vulnerabilities
- Implement proper code review processes for security
- Follow secure coding practices and guidelines
- Use linting rules that enforce security best practices
- Implement proper memory management to prevent leaks
- Use compiler and runtime security features

## Update and Patching Security

- Implement secure update mechanisms
- Verify update authenticity and integrity
- Use secure channels for update distribution
- Implement proper rollback mechanisms
- Test updates thoroughly before deployment
- Communicate security updates to users appropriately

## Privacy Protection

- Minimize data collection and processing
- Implement proper data anonymization techniques
- Provide clear privacy policies and user controls
- Use data encryption for personal information
- Implement proper data retention and deletion policies
- Respect user privacy preferences and settings
