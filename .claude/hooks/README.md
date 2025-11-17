# Claude Hooks for MyWineMemory

This directory contains automated hooks that improve development workflow and code quality.

## Hooks Overview

### 🚀 Session Start Hook (`session-start.js`) **NEW!**
**Purpose**: Automatically enhances Claude's understanding of the project at the start of each session.

**Triggers**:
- Every time a new Claude Code session starts
- Runs before any user interaction

**Behavior**:
- ✅ Analyzes project structure and code organization
- ✅ Shows recent commits and development activity
- ✅ Lists available skills and quick actions
- ✅ Displays project health status
- ✅ Detects potential issues or configuration problems
- ✅ Provides tech stack summary
- ✅ Suggests next steps based on project state

**Features**:
- **Project Analysis**: Deep scan of component structure, services, and code patterns
- **Activity Tracking**: Recent commits, changed files, and active development areas
- **Health Checks**: Dependencies, environment configuration, file sizes
- **Smart Suggestions**: Context-aware recommendations for next steps
- **Rich Context**: Provides Claude with comprehensive project understanding

**Advanced Analysis** (via `project-analyzer.js`):
- Code structure metrics (components, pages, services count)
- Large file detection (potential refactoring candidates)
- Recent change patterns (what areas are being actively developed)
- Tech stack verification (TypeScript, Firebase, React Router, etc.)
- Issue detection (missing configs, large files, etc.)

### 🏗️ Auto-Build Hook (`auto-build.js`)
**Purpose**: Automatically runs `npm run build` when source files are modified.

**Triggers**: 
- Any `.ts`, `.tsx`, `.js`, `.jsx` files in `/src/` are modified
- Runs after `Write`, `Edit`, or `MultiEdit` operations

**Behavior**:
- ✅ Build succeeds → Silent success message
- ⚠️ Build with warnings → Shows warnings but continues
- ❌ Build fails → Shows errors but doesn't block Claude (allows fixes)

### 🎨 Dark Mode Check Hook (`check-dark-mode.js`)
**Purpose**: Reminds to consider dark mode support when adding new UI elements.

**Triggers**:
- CSS files are modified (checks for missing `[data-theme="dark"]` variants)
- React components are modified (detects new elements with classes)

**Behavior**:
- Scans for new CSS classes without dark mode variants
- Alerts about new elements that might need dark mode styling
- Provides suggestions for dark mode implementation

### 🚀 Auto-Commit Hook (`auto-commit.js`)
**Purpose**: Automatically commits accumulated changes to maintain development flow.

**Triggers**:
- 3+ total files changed, OR
- 2+ source files changed

**Behavior**:
- Stages only source files (`/src/` directory)
- Generates descriptive commit messages based on changed file types
- Adds standardized footer with Claude Code attribution
- Suggests pushing changes after committing

### 🎯 Hook Manager (`hook-manager.js`)
**Purpose**: Orchestrates all hooks and manages execution flow.

**Integration**:
- Called by Claude Code after `Write|Edit|MultiEdit` operations
- Coordinates hook execution based on file types and changes
- Handles errors gracefully to avoid blocking development

## Configuration

The hooks are configured in `.claude/settings.local.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "node .claude/hooks/session-start.js"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/hook-manager.js"
          }
        ]
      }
    ]
  }
}
```

## Development Workflow

With these hooks enabled, the development flow becomes:

1. **Session Start** → Claude receives comprehensive project context
2. **Code Changes** → Claude makes modifications with full understanding
3. **Auto-Build** → Immediately validates changes
4. **Dark Mode Check** → Ensures UI consistency
5. **Auto-Commit** → Commits when threshold reached
6. **Manual Push** → Developer pushes when ready

### Session Start Enhancement

The Session Start hook provides Claude with rich context including:

```
╔════════════════════════════════════════════════════════════╗
║  🍷 MyWineMemory - Session Start Context                  ║
╚════════════════════════════════════════════════════════════╝

📋 Project Overview:
   Description: Personal wine learning PWA with gamification
   Live URL: https://wine.himazi.com
   Tech Stack: React 18 + TypeScript + Firebase

🌿 Git Status:
   Current Branch: claude/feature-branch (feature branch)
   Working Tree: Clean

📝 Recent Commits:
   b61df94 - feat: Add unified Claude Code skills (2 hours ago)
   ...

💚 Project Health:
   ✓ Dependencies installed
   ✓ Environment configured (.env)

📊 Code Structure:
   Components: 12
   Pages: 10
   Services: 8
   Custom Hooks: 3
   Contexts: 2
   Largest files:
      AddTastingRecord (45KB)
      WineDetail (38KB)

📈 Recent Activity (7 days):
   Commits: 15
   Files changed: 42
   Active areas:
      components: 18 changes
      pages: 12 changes
      services: 8 changes

🔧 Tech Stack:
   ✓ TypeScript
   ✓ Firebase
   ✓ React Router
   ✓ Context API

🛠️  Available Skills (6):
   🧪 test-and-build - Run tests and build
   🔧 lint-fix - Fix linting errors
   🔒 security-check - Run security audit
   🚀 firebase-deploy - Deploy to production
   ⚛️  create-component - Create new component
   🗄️  create-service - Create Firebase service

⚡ Quick Actions:
   Try: "Use the <skill-name> skill"
   Example: "Use the test-and-build skill"
```

This context helps Claude:
- Understand the current state of development
- Make informed suggestions
- Avoid common pitfalls
- Recommend relevant skills
- Detect configuration issues early

## Customization

### Adjusting Auto-Commit Threshold
Edit `auto-commit.js` line 25 to change when auto-commits trigger:

```javascript
if (totalChanges >= 3 || sourceChanges.length >= 2) {
```

### Modifying Build Behavior
Edit `auto-build.js` to change which file types trigger builds:

```javascript
const shouldBuild = modifiedFiles.some(file => 
  file.includes('/src/') && 
  (file.endsWith('.ts') || file.endsWith('.tsx') /* add more types */)
);
```

### Extending Dark Mode Checks
Edit `check-dark-mode.js` to add more sophisticated dark mode pattern detection.

## Benefits

- **🧠 Smart Context**: Claude understands your project from the start
- **🔄 Continuous Validation**: Catches build errors immediately
- **🎨 Consistent UI**: Prevents dark mode oversights
- **📝 Automated History**: Maintains clean git history
- **⚡ Faster Development**: Reduces manual workflow steps
- **🛡️ Quality Assurance**: Multiple layers of automated checks
- **📊 Project Insights**: Automatic analysis of code structure and patterns
- **⚠️ Early Warning**: Detects issues before they become problems
- **🎯 Guided Development**: Context-aware suggestions and next steps

## Troubleshooting

If hooks are not running:
1. Check file permissions: `chmod +x .claude/hooks/*.js`
2. Verify Node.js is available in PATH
3. Check Claude Code settings are properly configured
4. Review hook output in Claude Code console