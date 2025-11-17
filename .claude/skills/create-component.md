# Create React Component

Create a new React component following MyWineMemory project conventions and best practices.

## What this skill does

1. Gather component requirements from the user
2. Determine the appropriate component type (page vs reusable component)
3. Create the component file with proper TypeScript typing
4. Add necessary imports and styling
5. Update routing if needed (for page components)
6. Create basic test file structure

## Usage

Use this skill when:
- Creating a new page component
- Creating a new reusable UI component
- Need to scaffold component boilerplate quickly
- Want to ensure component follows project patterns

## Instructions

### Step 1: Gather Requirements

Ask the user for:
- Component name (PascalCase, e.g., WineCard, AddTastingRecord)
- Component type: Page or Reusable component
- Component purpose and functionality
- Props needed (if any)
- State requirements

### Step 2: Determine Location

- **Page components** → `my-wine-memory/src/pages/[ComponentName].tsx`
- **Reusable components** → `my-wine-memory/src/components/[ComponentName].tsx`

### Step 3: Create Component File

Create component with this structure:

```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Add other imports as needed

interface [ComponentName]Props {
  // Define props here
}

const [ComponentName]: React.FC<[ComponentName]Props> = (props) => {
  // Add state and hooks
  const navigate = useNavigate();

  // Component logic

  return (
    <div className="[component-name]-container">
      {/* Component JSX */}
    </div>
  );
};

export default [ComponentName];
```

### Step 4: Add Styling

Add component-specific styles to `my-wine-memory/src/App.css` following existing patterns:
- Use mobile-first approach
- Follow BEM naming convention
- Include responsive breakpoints if needed

### Step 5: Update Routing (if Page Component)

Add route to `my-wine-memory/src/App.tsx`:

```typescript
<Route path="/route-path" element={<ComponentName />} />
```

### Step 6: Type Definitions

If component uses complex types, add them to `my-wine-memory/src/types/index.ts`

### Step 7: Integration

- Import component where needed
- Add to navigation if applicable (BottomNavigation.tsx)
- Update any parent components

## Best Practices

- **TypeScript**: Always use proper typing, no `any` types
- **Hooks**: Follow React hooks rules (order, conditionals)
- **Props**: Use interface for props definition
- **State**: Use appropriate hooks (useState, useContext, etc.)
- **Error Handling**: Include error boundaries where appropriate
- **Loading States**: Add loading indicators for async operations
- **Accessibility**: Include ARIA labels where needed
- **Mobile-First**: Design for mobile, enhance for desktop

## Component Patterns in This Project

### Authentication
```typescript
import { useAuth } from '../contexts/AuthContext';
const { currentUser } = useAuth();
```

### Navigation
```typescript
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
```

### Firebase Operations
```typescript
import { someService } from '../services/someService';
```

### Theme Support
```typescript
import { useTheme } from '../contexts/ThemeContext';
const { theme } = useTheme();
```

## Success Criteria

- Component file created in correct location
- Proper TypeScript types defined
- Component follows project patterns
- Styling added and responsive
- Routing updated (if applicable)
- No TypeScript or ESLint errors
- Component renders without errors
