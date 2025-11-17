# MyWineMemory Claude Skills

This directory contains unified skills for developing and maintaining the MyWineMemory application with Claude Code.

## What are Skills?

Skills are reusable task templates that help Claude Code perform common development tasks consistently and efficiently. Each skill provides step-by-step instructions for specific operations.

## Available Skills

### 1. 🧪 test-and-build

Run comprehensive tests and build validation.

**Use when:**
- Before committing code changes
- After making significant changes
- Before deploying to production

**What it does:**
- Runs linting checks
- Executes full test suite
- Performs production build
- Reports errors and warnings

```
Use the test-and-build skill to validate my changes
```

---

### 2. 🔧 lint-fix

Automatically fix linting errors and maintain code quality.

**Use when:**
- Code has linting errors
- Before committing changes
- After refactoring code

**What it does:**
- Runs ESLint with auto-fix
- Reports remaining issues
- Provides fix suggestions
- Maintains code style consistency

```
Use the lint-fix skill to clean up my code
```

---

### 3. 🚀 firebase-deploy

Deploy application to Firebase Hosting with validation.

**Use when:**
- Ready to deploy to production
- Need to update live site (wine.himazi.com)
- Rolling back to previous version

**What it does:**
- Runs pre-deployment checks
- Builds production bundle
- Deploys to Firebase Hosting
- Verifies deployment success
- Provides live URL

```
Use the firebase-deploy skill to deploy to production
```

---

### 4. ⚛️ create-component

Create new React components following project conventions.

**Use when:**
- Creating new page components
- Creating reusable UI components
- Need to scaffold component boilerplate

**What it does:**
- Gathers component requirements
- Creates component file with TypeScript
- Adds proper styling
- Updates routing (for pages)
- Follows project patterns

```
Use the create-component skill to create a new WineRating component
```

---

### 5. 🗄️ create-service

Create Firebase service modules for data operations.

**Use when:**
- Creating new Firestore collection handlers
- Adding data access layer
- Implementing CRUD operations

**What it does:**
- Creates service file with CRUD operations
- Adds TypeScript types
- Implements error handling
- Updates security rules
- Follows Firebase best practices

```
Use the create-service skill to create a user preferences service
```

---

### 6. 🔒 security-check

Run comprehensive security validation.

**Use when:**
- Before deploying to production
- After adding new dependencies
- When updating Firebase configuration
- During regular security audits

**What it does:**
- Validates environment variables
- Runs npm audit
- Checks Firebase security rules
- Verifies authentication
- Reviews data access patterns
- Generates security report

```
Use the security-check skill before I deploy
```

---

## How to Use Skills

### Method 1: Direct Request

Simply ask Claude Code to use a specific skill:

```
Use the test-and-build skill
```

### Method 2: Implicit Invocation

Claude Code will automatically suggest and use appropriate skills based on your request:

```
I want to deploy my changes to production
→ Claude will use the firebase-deploy skill

Can you check if my code is secure?
→ Claude will use the security-check skill
```

## Skill Workflow Examples

### Complete Feature Development

```
1. "Use the create-component skill to create a new TastingNote component"
2. "Use the create-service skill for tasting notes"
3. "Use the lint-fix skill"
4. "Use the test-and-build skill"
5. "Use the security-check skill"
6. "Use the firebase-deploy skill"
```

### Quick Fix and Deploy

```
1. Make code changes
2. "Use the test-and-build skill"
3. "Use the firebase-deploy skill"
```

### Code Quality Maintenance

```
1. "Use the lint-fix skill"
2. "Use the test-and-build skill"
3. "Use the security-check skill"
```

## Project-Specific Guidelines

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Firebase (Firestore, Auth, Storage, Hosting)
- **Testing**: Jest
- **Linting**: ESLint

### Key Principles

1. **Personal Learning Focus**: This is a personal wine learning app, not a social platform
2. **Mobile-First**: Primary usage on smartphones
3. **Budget-Conscious**: Keep costs under 1000 JPY/month
4. **Security**: User data isolation, HTTPS enforcement
5. **TypeScript**: Proper typing, no `any` types
6. **React Best Practices**: Hooks rules, proper component structure

### Database Architecture

- **wines_master**: Shared wine data to prevent duplicates
- **tasting_records**: Individual user experiences

### Three-Step Recording Workflow

1. Select/Add Wine (`/select-wine`)
2. Record Tasting (`/add-tasting-record/:wineId`)
3. View Records (`/records`, `/wine-detail/:wineId`)

## Customizing Skills

Skills are markdown files that can be customized for your specific needs:

1. **Edit**: Modify existing skills in `.claude/skills/[skill-name].md`
2. **Create**: Add new skills by creating new `.md` files
3. **Share**: Skills are checked into git and shared with team

## Best Practices

### When to Use Skills

✅ **Use skills for:**
- Repetitive development tasks
- Tasks requiring multiple steps
- Operations with specific validation requirements
- Maintaining consistency across the codebase

❌ **Don't use skills for:**
- One-off exploratory tasks
- Simple single-command operations
- Tasks requiring heavy customization

### Skill Development Tips

1. **Be Specific**: Skills work best with clear, step-by-step instructions
2. **Include Validation**: Always verify the result of operations
3. **Handle Errors**: Provide guidance for common failure scenarios
4. **Follow Patterns**: Reference existing code patterns in the project
5. **Update Regularly**: Keep skills current with project evolution

## Troubleshooting

### Skill Not Working as Expected

1. Check that you're in the correct directory (`/home/user/MyWineMemoryV2`)
2. Verify project dependencies are installed (`cd my-wine-memory && npm install`)
3. Ensure environment variables are configured (`.env` file)
4. Check Firebase authentication if Firebase operations fail

### Common Issues

**"Command not found" errors**
```bash
cd my-wine-memory
npm install
```

**"Firebase not authenticated" errors**
```bash
firebase login
```

**"Environment variables missing" errors**
```bash
cp .env.example .env
# Edit .env with your Firebase config
```

## Contributing

When creating new skills:

1. Use clear, descriptive names
2. Include comprehensive "What it does" section
3. Specify "Use when" scenarios
4. Provide step-by-step instructions
5. Include success criteria
6. Add examples and common issues
7. Update this README with the new skill

## Resources

- **Project Overview**: `/CLAUDE.md`
- **Architecture Details**: `/仕様書_現行.md`
- **Firebase Checklist**: `my-wine-memory/FIREBASE_CONSOLE_CHECKLIST.md`
- **Live Site**: https://wine.himazi.com

## Support

For issues or questions about skills:

1. Check skill documentation in the respective `.md` file
2. Review project documentation in `CLAUDE.md`
3. Ask Claude Code for clarification or modifications

---

**Last Updated**: 2025-11-17

**Maintained by**: Claude Code for MyWineMemory project
