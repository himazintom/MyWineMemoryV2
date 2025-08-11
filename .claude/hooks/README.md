# Claude Hooks for MyWineMemory

This directory contains automated hooks that improve development workflow and code quality.

## Hooks Overview

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

1. **Code Changes** → Claude makes modifications
2. **Auto-Build** → Immediately validates changes
3. **Dark Mode Check** → Ensures UI consistency
4. **Auto-Commit** → Commits when threshold reached
5. **Manual Push** → Developer pushes when ready

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

- **🔄 Continuous Validation**: Catches build errors immediately
- **🎨 Consistent UI**: Prevents dark mode oversights
- **📝 Automated History**: Maintains clean git history
- **⚡ Faster Development**: Reduces manual workflow steps
- **🛡️ Quality Assurance**: Multiple layers of automated checks

## Troubleshooting

If hooks are not running:
1. Check file permissions: `chmod +x .claude/hooks/*.js`
2. Verify Node.js is available in PATH
3. Check Claude Code settings are properly configured
4. Review hook output in Claude Code console