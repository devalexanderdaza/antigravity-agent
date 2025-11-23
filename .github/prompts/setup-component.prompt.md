---
agent: "agent"
model: Claude Sonnet 4
tools: ["codebase", "edit/editFiles", "new"]
description: "Generate a new React component for AntiGravity Agent"
---

# React Component Generator

Generate a new React component following AntiGravity Agent patterns and conventions.

## Component Requirements

When creating a new component, ensure it follows these patterns:

### TypeScript Integration

- Use proper TypeScript interfaces for all props
- Export prop interfaces for reusability
- Use React.FC type for functional components when appropriate
- Implement proper event handler typing

### Component Structure

```typescript
interface ComponentNameProps {
  // Define all props with proper types
  title?: string;
  onAction?: (data: ActionData) => void;
  children?: React.ReactNode;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  onAction,
  children,
}) => {
  // Component implementation
};
```

### Required Elements

1. **Props Interface**: Define clear TypeScript interfaces
2. **Default Props**: Provide sensible defaults where appropriate
3. **Event Handlers**: Implement proper callback patterns
4. **Accessibility**: Include ARIA attributes and semantic HTML
5. **Error Handling**: Implement error boundaries where needed
6. **Styling**: Use Tailwind CSS classes following project patterns

### Desktop Application Patterns

- Consider system tray integration requirements
- Implement proper keyboard navigation
- Use desktop-appropriate UI patterns (tooltips, context menus)
- Handle window state management where relevant

### Tauri Integration (when needed)

- Use proper Tauri invoke patterns with TypeScript
- Implement loading and error states for backend communication
- Handle async operations appropriately

### Testing Considerations

- Structure components for easy testing with React Testing Library
- Provide clear test IDs or accessible queries
- Separate business logic into custom hooks when possible

## Usage Instructions

1. **Specify the component name and purpose**
2. **Describe the required props and functionality**
3. **Indicate any Tauri backend integration needs**
4. **Mention specific styling or interaction requirements**
5. **Note any accessibility or desktop-specific considerations**

The generator will create:

- Component file with proper TypeScript typing
- Props interface definition
- Basic styling with Tailwind CSS
- Accessibility attributes
- Export statement for easy importing
