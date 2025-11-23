---
agent: "agent"
model: Claude Sonnet 4
tools: ["codebase", "search", "problems", "runCommands", "usages"]
description: "Systematic debugging assistant for AntiGravity Agent issues"
---

# Debug Issue Assistant

Systematically identify, analyze, and resolve bugs in the AntiGravity Agent desktop application following structured debugging methodology.

## Debugging Process

### Phase 1: Problem Assessment

#### Gather Context

- **Error Analysis**: Read error messages, stack traces, and failure reports
- **Codebase Review**: Examine recent changes and related code areas
- **Behavior Comparison**: Document expected vs. actual behavior
- **Environment Check**: Verify system configuration and dependencies

#### Reproduce the Issue

```typescript
// Example: Reproducing a component error
describe("Bug Reproduction", () => {
  it("should reproduce the reported issue", () => {
    // Steps to reproduce
    render(<ProblemComponent />);
    userEvent.click(screen.getByRole("button"));

    // Capture the error or unexpected behavior
    expect(screen.getByText("Expected result")).toBeInTheDocument();
  });
});
```

### Phase 2: Investigation

#### Root Cause Analysis Checklist

- [ ] **State Management**: Check React state updates and data flow
- [ ] **Tauri Integration**: Verify command calls and IPC communication
- [ ] **TypeScript Issues**: Look for type-related errors and casting problems
- [ ] **Async Operations**: Check promise handling and race conditions
- [ ] **Event Handling**: Verify event listeners and cleanup
- [ ] **Performance**: Check for memory leaks or excessive re-renders

#### Common Bug Patterns in Tauri + React

##### 1. Tauri Command Issues

```typescript
// Problem: Unhandled promise rejection
const fetchData = () => {
  invoke("get_data"); // Missing await and error handling
};

// Solution: Proper async handling
const fetchData = async () => {
  try {
    setLoading(true);
    const data = await invoke<DataType>("get_data");
    setData(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

##### 2. React State Issues

```typescript
// Problem: State update after unmount
useEffect(() => {
  fetchData().then(setData); // Component might unmount before this completes
}, []);

// Solution: Cleanup and cancellation
useEffect(() => {
  let cancelled = false;

  fetchData().then((result) => {
    if (!cancelled) {
      setData(result);
    }
  });

  return () => {
    cancelled = true;
  };
}, []);
```

##### 3. Desktop Application Issues

```typescript
// Problem: Window state not persisting
const handleMinimize = () => {
  appWindow.minimize(); // State lost on minimize
};

// Solution: Proper state management
const handleMinimize = async () => {
  await invoke("save_window_state", { state: currentState });
  await appWindow.minimize();
};
```

### Phase 3: Resolution

#### Fix Implementation Strategy

1. **Minimal Changes**: Make the smallest change that fixes the issue
2. **Error Boundaries**: Add proper error handling around the fix
3. **Input Validation**: Add validation to prevent similar issues
4. **Performance Impact**: Consider the performance implications
5. **Breaking Changes**: Avoid breaking existing functionality

#### Testing the Fix

```typescript
// Test that the fix resolves the issue
describe("Bug Fix Verification", () => {
  it("should handle the error case properly", async () => {
    // Mock the error condition
    vi.mocked(invoke).mockRejectedValue(new Error("Network error"));

    render(<ComponentWithFix />);

    // Verify error is handled gracefully
    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });
  });

  it("should not break existing functionality", () => {
    // Test that normal operation still works
    render(<ComponentWithFix />);

    expect(screen.getByText("Normal operation")).toBeInTheDocument();
  });
});
```

## Debugging Tools and Techniques

### Frontend Debugging

- **React DevTools**: Component state and props inspection
- **Browser DevTools**: Network requests, console errors, performance profiling
- **TypeScript Compiler**: Type checking and error reporting
- **Vite DevServer**: Hot reload and error overlay

### Backend Debugging

- **Rust Debugging**: Use `println!` and `dbg!` macros for logging
- **Tauri DevTools**: IPC communication monitoring
- **System Logs**: Check OS-specific logging for system integration issues
- **Process Monitoring**: Track resource usage and performance

### Tauri-Specific Debugging

```rust
// Add comprehensive logging to Rust commands
#[tauri::command]
pub async fn debug_command(param: String) -> Result<String, String> {
    println!("Command called with param: {}", param);

    match perform_operation(&param) {
        Ok(result) => {
            println!("Operation successful: {:?}", result);
            Ok(result)
        },
        Err(e) => {
            eprintln!("Operation failed: {}", e);
            Err(e.to_string())
        }
    }
}
```

### Desktop Application Debugging

```typescript
// Debug system tray issues
const debugSystemTray = async () => {
  try {
    console.log("System tray status:", await invoke("get_tray_status"));

    const trayItems = await invoke("get_tray_menu_items");
    console.log("Tray menu items:", trayItems);
  } catch (error) {
    console.error("System tray debug error:", error);
  }
};
```

## Common Issue Categories

### Performance Issues

- **Memory Leaks**: Check for proper cleanup in useEffect
- **Excessive Re-renders**: Use React DevTools Profiler
- **Large Bundle Size**: Analyze with bundle analyzer
- **Slow Startup**: Profile application initialization

### Security Issues

- **Input Validation**: Check for unvalidated user inputs
- **File Path Traversal**: Validate file operations
- **XSS Vulnerabilities**: Check for unsafe HTML rendering
- **Configuration Exposure**: Verify no sensitive data in logs

### Integration Issues

- **IPC Communication**: Check Tauri command signatures and types
- **File System Access**: Verify permissions and path handling
- **System Events**: Check event listener registration and cleanup
- **Cross-Platform**: Test on different operating systems

## Debugging Workflow

### 1. Immediate Response

```bash
# Gather basic information
npm run lint          # Check for obvious code issues
npm run type-check    # Verify TypeScript types
npm test -- --run     # Run relevant tests
```

### 2. Deep Investigation

```typescript
// Add comprehensive logging
const debugMode = process.env.NODE_ENV === "development";

const debugLog = (message: string, data?: any) => {
  if (debugMode) {
    console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, data);
  }
};

// Use throughout the application
debugLog("Component mounted", { props, state });
debugLog("Tauri command called", { command, params });
debugLog("Error occurred", { error, context });
```

### 3. Systematic Testing

```typescript
// Test different scenarios
describe("Systematic Bug Investigation", () => {
  describe("Normal conditions", () => {
    it("should work with valid input", () => {
      /* test */
    });
  });

  describe("Error conditions", () => {
    it("should handle network errors", () => {
      /* test */
    });
    it("should handle invalid input", () => {
      /* test */
    });
  });

  describe("Edge cases", () => {
    it("should handle empty data", () => {
      /* test */
    });
    it("should handle very large data", () => {
      /* test */
    });
  });
});
```

## Prevention Strategies

### Code Quality

- Use TypeScript strict mode
- Implement comprehensive error handling
- Add input validation at all boundaries
- Use proper async/await patterns
- Implement proper cleanup in useEffect

### Testing

- Write tests for error scenarios
- Test edge cases and boundary conditions
- Include integration tests for Tauri commands
- Test cross-platform compatibility
- Perform security testing

### Monitoring

- Implement comprehensive logging
- Monitor performance metrics
- Track error rates and patterns
- Use crash reporting tools
- Monitor user feedback and issues

## Usage Instructions

1. **Describe the issue** (error messages, unexpected behavior, steps to reproduce)
2. **Provide context** (when it started, what changed, environment details)
3. **Include error logs** (console errors, stack traces, system logs)
4. **Specify impact** (user experience, system stability, data integrity)
5. **Indicate urgency** (critical bug, minor issue, enhancement)

The debugging assistant will:

- Systematically analyze the issue using the structured approach
- Identify the root cause through comprehensive investigation
- Provide a targeted fix with proper testing
- Suggest prevention strategies to avoid similar issues
- Document the resolution for future reference
