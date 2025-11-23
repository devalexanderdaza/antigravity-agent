---
agent: "agent"
model: Claude Sonnet 4
tools: ["codebase", "edit/editFiles", "search", "usages"]
description: "Refactor existing code to improve quality, performance, and maintainability"
---

# Code Refactoring Assistant

Refactor existing code to improve quality, performance, maintainability, and adherence to AntiGravity Agent standards.

## Refactoring Goals

### Code Quality Improvements

- **Type Safety**: Improve TypeScript usage and eliminate any types
- **React Patterns**: Modernize to latest React patterns and hooks
- **Code Organization**: Better separation of concerns and modularity
- **Performance**: Optimize rendering and reduce unnecessary re-renders
- **Maintainability**: Simplify complex logic and improve readability

### Common Refactoring Patterns

#### 1. Extract Custom Hooks

```typescript
// Before: Business logic in component
const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    invoke("fetch_data")
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return <div>{loading ? "Loading..." : data}</div>;
};

// After: Extracted custom hook
const useDataFetching = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    invoke("fetch_data")
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};

const MyComponent = () => {
  const { data, loading } = useDataFetching();
  return <div>{loading ? "Loading..." : data}</div>;
};
```

#### 2. Improve TypeScript Definitions

```typescript
// Before: Weak typing
const processData = (data: any) => {
  return data.map((item: any) => item.value);
};

// After: Strong typing
interface DataItem {
  id: string;
  value: string;
  metadata?: Record<string, unknown>;
}

const processData = (data: DataItem[]): string[] => {
  return data.map((item) => item.value);
};
```

#### 3. Performance Optimization

```typescript
// Before: Unnecessary re-renders
const ExpensiveComponent = ({ items, onSelect }) => {
  return (
    <div>
      {items.map((item) => (
        <Item key={item.id} item={item} onSelect={() => onSelect(item.id)} />
      ))}
    </div>
  );
};

// After: Optimized with memo and useCallback
const ExpensiveComponent = ({ items, onSelect }) => {
  const memoizedItems = useMemo(() => items, [items]);

  return (
    <div>
      {memoizedItems.map((item) => (
        <MemoizedItem key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
};

const MemoizedItem = React.memo(({ item, onSelect }) => {
  const handleSelect = useCallback(
    () => onSelect(item.id),
    [item.id, onSelect]
  );
  return <Item item={item} onSelect={handleSelect} />;
});
```

### Tauri-Specific Refactoring

#### Error Handling Improvement

```typescript
// Before: Basic error handling
const fetchConfig = async () => {
  try {
    const config = await invoke("get_config");
    setConfig(config);
  } catch (error) {
    console.error(error);
  }
};

// After: Comprehensive error handling
interface ConfigError {
  code: string;
  message: string;
  details?: string;
}

const fetchConfig = async (): Promise<void> => {
  try {
    setLoading(true);
    const config = await invoke<ConfigData>("get_config");
    setConfig(config);
    setError(null);
  } catch (error) {
    const configError = error as ConfigError;
    setError({
      message: configError.message || "Failed to load configuration",
      code: configError.code || "UNKNOWN_ERROR",
      retryable: configError.code !== "PERMISSION_DENIED",
    });
  } finally {
    setLoading(false);
  }
};
```

### Security Refactoring

#### Input Validation

```typescript
// Before: No validation
const updatePath = async (path: string) => {
  await invoke("set_path", { path });
};

// After: Proper validation
const validatePath = (path: string): boolean => {
  return path && path.trim().length > 0 && !path.includes("..");
};

const updatePath = async (path: string): Promise<void> => {
  if (!validatePath(path)) {
    throw new Error("Invalid path provided");
  }

  try {
    await invoke<void>("set_path", { path: path.trim() });
  } catch (error) {
    throw new Error(`Failed to update path: ${error.message}`);
  }
};
```

## Refactoring Process

### 1. Analysis Phase

- Identify code smells and improvement opportunities
- Analyze performance bottlenecks
- Review security vulnerabilities
- Assess TypeScript usage and type safety

### 2. Planning Phase

- Prioritize refactoring tasks by impact and risk
- Plan incremental changes to minimize disruption
- Identify dependencies and potential breaking changes
- Prepare comprehensive test coverage

### 3. Implementation Phase

- Make small, focused changes with clear commits
- Maintain backward compatibility where possible
- Update tests and documentation alongside code changes
- Verify no regressions are introduced

### 4. Validation Phase

- Run comprehensive test suite
- Perform manual testing of affected functionality
- Review performance impact
- Validate security improvements

## Refactoring Checklist

### Code Quality

- [ ] Remove any types and improve TypeScript usage
- [ ] Extract reusable logic into custom hooks or utilities
- [ ] Simplify complex functions and improve readability
- [ ] Add proper error handling and user feedback
- [ ] Update documentation and comments

### Performance

- [ ] Optimize component re-rendering with memo and callbacks
- [ ] Implement code splitting for large components
- [ ] Reduce bundle size with better imports
- [ ] Optimize expensive operations with useMemo

### Security

- [ ] Add input validation and sanitization
- [ ] Improve error messages to avoid information disclosure
- [ ] Validate file paths and system operations
- [ ] Update security-related configurations

### Maintainability

- [ ] Improve component organization and structure
- [ ] Extract shared constants and configurations
- [ ] Standardize naming conventions
- [ ] Update tests to cover new patterns

## Usage Instructions

1. **Identify the code to refactor** (files, components, functions)
2. **Describe the current issues or improvement goals**
3. **Specify any performance or security concerns**
4. **Indicate priority and timeline constraints**
5. **Mention any compatibility requirements**

The refactoring assistant will:

- Analyze the current code and identify improvement opportunities
- Provide a structured refactoring plan
- Implement changes following best practices
- Ensure backward compatibility and test coverage
- Document all changes and improvements made
