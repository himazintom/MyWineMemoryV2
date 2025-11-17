# Test and Build

Run comprehensive tests and build validation for MyWineMemory project.

## What this skill does

1. Navigate to the `my-wine-memory` directory
2. Run linting to check code quality
3. Run the full test suite
4. Execute the production build
5. Report any errors or warnings

## Usage

Use this skill when:
- Before committing code changes
- After making significant changes to the codebase
- Before deploying to production
- As part of CI/CD validation

## Instructions

Execute the following steps in sequence:

1. Change to the project directory:
   ```bash
   cd my-wine-memory
   ```

2. Run linting:
   ```bash
   npm run lint
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Run build:
   ```bash
   npm run build
   ```

5. Report results:
   - If all steps pass: Confirm that tests and build completed successfully
   - If any step fails: Report the specific error and suggest fixes
   - Provide a summary of test coverage if available

## Success Criteria

- All linting rules pass
- All tests pass with no failures
- Build completes without errors
- No TypeScript compilation errors
