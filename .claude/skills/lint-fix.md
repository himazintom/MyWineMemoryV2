# Lint and Fix

Run ESLint on the MyWineMemory codebase and automatically fix issues where possible.

## What this skill does

1. Navigate to the `my-wine-memory` directory
2. Run ESLint with auto-fix enabled
3. Report any remaining issues that require manual fixing
4. Provide suggestions for fixing unfixable issues

## Usage

Use this skill when:
- Code has linting errors
- Before committing changes
- After refactoring code
- To maintain code quality standards

## Instructions

Execute the following steps:

1. Change to the project directory:
   ```bash
   cd my-wine-memory
   ```

2. Run ESLint with auto-fix:
   ```bash
   npx eslint . --fix
   ```

3. Check for remaining issues:
   ```bash
   npm run lint
   ```

4. Report results:
   - List any auto-fixed issues
   - List remaining issues that need manual fixing
   - Provide specific suggestions for fixing each remaining issue
   - Offer to fix the remaining issues if requested

## Common Issues and Fixes

- **Unused imports**: Remove them
- **Missing dependencies**: Add them to useEffect dependency arrays
- **Type errors**: Add proper TypeScript types
- **Console statements**: Remove or comment out debug console logs
- **React hooks rules**: Follow hooks order and conditional usage rules

## Success Criteria

- No ESLint errors remain
- All auto-fixable issues are resolved
- Code follows project style guidelines
