#!/usr/bin/env node

/**
 * Session Start Hook for MyWineMemory
 *
 * This hook runs at the start of each Claude Code session to:
 * - Provide project context and current state
 * - List available skills and tools
 * - Show recent activity and development status
 * - Offer quick actions for common tasks
 *
 * This auto-enhances Claude's understanding of the project.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ProjectAnalyzer = require('./project-analyzer.js');

// ANSI color codes for better readability
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function exec(command) {
  try {
    return execSync(command, { encoding: 'utf8', cwd: process.cwd() }).trim();
  } catch (error) {
    return null;
  }
}

function getProjectInfo() {
  const info = {
    name: 'MyWineMemory',
    description: 'Personal wine learning PWA with gamification',
    liveUrl: 'wine.himazi.com',
    tech: 'React 18 + TypeScript + Firebase',
  };
  return info;
}

function getGitStatus() {
  const branch = exec('git branch --show-current');
  const status = exec('git status --short');
  const recentCommits = exec('git log -3 --oneline --decorate');
  const isDirty = status && status.length > 0;

  return {
    branch,
    isDirty,
    status,
    recentCommits,
  };
}

function getAvailableSkills() {
  const skillsDir = path.join(process.cwd(), '.claude', 'skills');

  if (!fs.existsSync(skillsDir)) {
    return [];
  }

  const skills = fs.readdirSync(skillsDir)
    .filter(file => file.endsWith('.md') && file !== 'README.md')
    .map(file => file.replace('.md', ''));

  return skills;
}

function getProjectHealth() {
  const health = {
    dependencies: false,
    env: false,
    build: null,
  };

  // Check if node_modules exists
  const nodeModulesPath = path.join(process.cwd(), 'my-wine-memory', 'node_modules');
  health.dependencies = fs.existsSync(nodeModulesPath);

  // Check if .env exists
  const envPath = path.join(process.cwd(), 'my-wine-memory', '.env');
  health.env = fs.existsSync(envPath);

  return health;
}

function getQuickActions() {
  return [
    { emoji: '🧪', action: 'test-and-build', description: 'Run tests and build' },
    { emoji: '🔧', action: 'lint-fix', description: 'Fix linting errors' },
    { emoji: '🔒', action: 'security-check', description: 'Run security audit' },
    { emoji: '🚀', action: 'firebase-deploy', description: 'Deploy to production' },
    { emoji: '⚛️', action: 'create-component', description: 'Create new component' },
    { emoji: '🗄️', action: 'create-service', description: 'Create Firebase service' },
  ];
}

function getRecentActivity() {
  const gitLog = exec('git log -5 --pretty=format:"%h - %s (%ar)" --date=relative');
  return gitLog ? gitLog.split('\n') : [];
}

function getBranchInfo() {
  const currentBranch = exec('git branch --show-current');
  const branches = exec('git branch -a');
  const isFeatureBranch = currentBranch && currentBranch.startsWith('claude/');

  return {
    current: currentBranch,
    isFeatureBranch,
    all: branches ? branches.split('\n').map(b => b.trim()).filter(b => b) : [],
  };
}

function generateContextMessage() {
  const project = getProjectInfo();
  const git = getGitStatus();
  const skills = getAvailableSkills();
  const health = getProjectHealth();
  const quickActions = getQuickActions();
  const activity = getRecentActivity();
  const branch = getBranchInfo();

  // Advanced analysis
  const analyzer = new ProjectAnalyzer();
  const analysis = analyzer.getFullAnalysis();

  let message = '\n';
  message += `${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}\n`;
  message += `${colors.bright}${colors.cyan}║  🍷 ${project.name} - Session Start Context${colors.reset}${colors.cyan}                  ║${colors.reset}\n`;
  message += `${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n\n`;

  // Project Overview
  message += `${colors.bright}📋 Project Overview:${colors.reset}\n`;
  message += `   ${colors.dim}Description:${colors.reset} ${project.description}\n`;
  message += `   ${colors.dim}Live URL:${colors.reset} ${colors.blue}https://${project.liveUrl}${colors.reset}\n`;
  message += `   ${colors.dim}Tech Stack:${colors.reset} ${project.tech}\n\n`;

  // Git Status
  message += `${colors.bright}🌿 Git Status:${colors.reset}\n`;
  message += `   ${colors.dim}Current Branch:${colors.reset} ${colors.green}${git.branch}${colors.reset}`;
  if (branch.isFeatureBranch) {
    message += ` ${colors.yellow}(feature branch)${colors.reset}`;
  }
  message += `\n`;
  message += `   ${colors.dim}Working Tree:${colors.reset} ${git.isDirty ? colors.yellow + 'Modified' : colors.green + 'Clean'}${colors.reset}\n`;

  if (git.isDirty && git.status) {
    message += `   ${colors.dim}Changes:${colors.reset}\n`;
    git.status.split('\n').slice(0, 5).forEach(line => {
      message += `      ${colors.yellow}${line}${colors.reset}\n`;
    });
  }
  message += `\n`;

  // Recent Activity
  if (activity.length > 0) {
    message += `${colors.bright}📝 Recent Commits:${colors.reset}\n`;
    activity.forEach(commit => {
      message += `   ${colors.dim}${commit}${colors.reset}\n`;
    });
    message += `\n`;
  }

  // Project Health
  message += `${colors.bright}💚 Project Health:${colors.reset}\n`;
  message += `   ${health.dependencies ? colors.green + '✓' : colors.yellow + '✗'} Dependencies installed${colors.reset}\n`;
  message += `   ${health.env ? colors.green + '✓' : colors.yellow + '✗'} Environment configured (.env)${colors.reset}\n\n`;

  // Project Structure (from analyzer)
  if (analysis.structure) {
    const { structure } = analysis;
    const total = structure.components.length + structure.pages.length +
                  structure.services.length + structure.hooks.length;

    if (total > 0) {
      message += `${colors.bright}📊 Code Structure:${colors.reset}\n`;
      message += `   ${colors.dim}Components:${colors.reset} ${structure.components.length}\n`;
      message += `   ${colors.dim}Pages:${colors.reset} ${structure.pages.length}\n`;
      message += `   ${colors.dim}Services:${colors.reset} ${structure.services.length}\n`;
      message += `   ${colors.dim}Custom Hooks:${colors.reset} ${structure.hooks.length}\n`;
      message += `   ${colors.dim}Contexts:${colors.reset} ${structure.contexts.length}\n`;

      // Show largest components (potential refactoring candidates)
      const largeComponents = [...structure.components, ...structure.pages]
        .filter(c => c.size > 20)
        .sort((a, b) => b.size - a.size)
        .slice(0, 3);

      if (largeComponents.length > 0) {
        message += `   ${colors.dim}Largest files:${colors.reset}\n`;
        largeComponents.forEach(comp => {
          message += `      ${comp.name} (${comp.size}KB)\n`;
        });
      }
      message += `\n`;
    }
  }

  // Recent Changes Analysis
  if (analysis.recentChanges && analysis.recentChanges.commits > 0) {
    const { recentChanges } = analysis;
    message += `${colors.bright}📈 Recent Activity (7 days):${colors.reset}\n`;
    message += `   ${colors.dim}Commits:${colors.reset} ${recentChanges.commits}\n`;
    message += `   ${colors.dim}Files changed:${colors.reset} ${recentChanges.files.size}\n`;

    if (Object.keys(recentChanges.areas).length > 0) {
      message += `   ${colors.dim}Active areas:${colors.reset}\n`;
      Object.entries(recentChanges.areas)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([area, count]) => {
          message += `      ${area}: ${count} changes\n`;
        });
    }
    message += `\n`;
  }

  // Tech Stack
  if (analysis.patterns) {
    const { patterns } = analysis;
    message += `${colors.bright}🔧 Tech Stack:${colors.reset}\n`;
    message += `   ${patterns.usesTypeScript ? colors.green + '✓' : colors.yellow + '✗'} TypeScript${colors.reset}\n`;
    message += `   ${patterns.usesFirebase ? colors.green + '✓' : colors.yellow + '✗'} Firebase${colors.reset}\n`;
    message += `   ${patterns.usesReactRouter ? colors.green + '✓' : colors.yellow + '✗'} React Router${colors.reset}\n`;
    message += `   ${patterns.usesContextAPI ? colors.green + '✓' : colors.yellow + '✗'} Context API${colors.reset}\n`;
    message += `\n`;
  }

  // Issues and Warnings
  if (analysis.issues && analysis.issues.length > 0) {
    const errors = analysis.issues.filter(i => i.severity === 'error');
    const warnings = analysis.issues.filter(i => i.severity === 'warning');

    if (errors.length > 0 || warnings.length > 0) {
      message += `${colors.bright}⚠️  Detected Issues:${colors.reset}\n`;

      errors.forEach(issue => {
        message += `   ${colors.yellow}❌ ${issue.message}${colors.reset}\n`;
      });

      warnings.slice(0, 3).forEach(issue => {
        message += `   ${colors.yellow}⚠  ${issue.message}${colors.reset}\n`;
      });

      message += `\n`;
    }
  }

  // Available Skills
  if (skills.length > 0) {
    message += `${colors.bright}🛠️  Available Skills (${skills.length}):${colors.reset}\n`;
    skills.forEach(skill => {
      const quickAction = quickActions.find(qa => qa.action === skill);
      const emoji = quickAction ? quickAction.emoji : '📌';
      const desc = quickAction ? quickAction.description : '';
      message += `   ${emoji} ${colors.cyan}${skill}${colors.reset}`;
      if (desc) {
        message += ` ${colors.dim}- ${desc}${colors.reset}`;
      }
      message += `\n`;
    });
    message += `\n`;
  }

  // Quick Actions
  message += `${colors.bright}⚡ Quick Actions:${colors.reset}\n`;
  message += `   ${colors.dim}Try: "Use the <skill-name> skill"${colors.reset}\n`;
  message += `   ${colors.dim}Example: "Use the test-and-build skill"${colors.reset}\n\n`;

  // Important Paths
  message += `${colors.bright}📂 Key Directories:${colors.reset}\n`;
  message += `   ${colors.dim}Source:${colors.reset} my-wine-memory/src/\n`;
  message += `   ${colors.dim}Components:${colors.reset} my-wine-memory/src/components/\n`;
  message += `   ${colors.dim}Pages:${colors.reset} my-wine-memory/src/pages/\n`;
  message += `   ${colors.dim}Services:${colors.reset} my-wine-memory/src/services/\n`;
  message += `   ${colors.dim}Types:${colors.reset} my-wine-memory/src/types/\n\n`;

  // Development Commands
  message += `${colors.bright}🔧 Development Commands:${colors.reset}\n`;
  message += `   ${colors.dim}cd my-wine-memory${colors.reset}\n`;
  message += `   ${colors.dim}npm run dev${colors.reset}      - Start development server\n`;
  message += `   ${colors.dim}npm run build${colors.reset}    - Build for production\n`;
  message += `   ${colors.dim}npm test${colors.reset}         - Run tests\n`;
  message += `   ${colors.dim}npm run lint${colors.reset}     - Check code quality\n\n`;

  // Next Steps Suggestions
  message += `${colors.bright}💡 Suggested Next Steps:${colors.reset}\n`;

  if (!health.dependencies) {
    message += `   ${colors.yellow}⚠${colors.reset} Run: ${colors.cyan}cd my-wine-memory && npm install${colors.reset}\n`;
  }

  if (!health.env) {
    message += `   ${colors.yellow}⚠${colors.reset} Setup: ${colors.cyan}cp my-wine-memory/.env.example my-wine-memory/.env${colors.reset}\n`;
  }

  if (git.isDirty) {
    message += `   ${colors.blue}ℹ${colors.reset} You have uncommitted changes. Review or commit when ready.\n`;
  }

  if (branch.isFeatureBranch) {
    message += `   ${colors.blue}ℹ${colors.reset} Working on feature branch. Remember to push when ready.\n`;
  }

  message += `\n`;

  // Footer
  message += `${colors.dim}${colors.cyan}────────────────────────────────────────────────────────────${colors.reset}\n`;
  message += `${colors.dim}Session initialized with project context. Ready to assist!${colors.reset}\n`;
  message += `${colors.dim}Type "help" or ask questions about the codebase.${colors.reset}\n\n`;

  return message;
}

// Main execution
try {
  const contextMessage = generateContextMessage();
  console.log(contextMessage);

  // Return structured data for Claude to use
  const structuredContext = {
    project: getProjectInfo(),
    git: getGitStatus(),
    skills: getAvailableSkills(),
    health: getProjectHealth(),
    branch: getBranchInfo(),
  };

  // Output as JSON comment for Claude to parse (optional enhancement)
  // console.log('<!-- SESSION_CONTEXT:', JSON.stringify(structuredContext), '-->');

} catch (error) {
  console.error('Error in session-start hook:', error.message);
  process.exit(0); // Don't block Claude from starting
}
