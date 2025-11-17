#!/usr/bin/env node

/**
 * Project Context Analyzer for MyWineMemory
 *
 * Advanced analysis tool that provides deep insights about:
 * - Code structure and patterns
 * - Component dependencies
 * - Service layer architecture
 * - Recent changes and trends
 * - Potential issues or improvements
 *
 * Used by session-start hook to provide rich context to Claude.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProjectAnalyzer {
  constructor(rootDir = process.cwd()) {
    this.rootDir = rootDir;
    this.srcDir = path.join(rootDir, 'my-wine-memory', 'src');
  }

  /**
   * Analyze project structure and component distribution
   */
  analyzeStructure() {
    const structure = {
      components: [],
      pages: [],
      services: [],
      hooks: [],
      contexts: [],
      types: [],
    };

    if (!fs.existsSync(this.srcDir)) {
      return structure;
    }

    const categories = [
      { key: 'components', dir: 'components' },
      { key: 'pages', dir: 'pages' },
      { key: 'services', dir: 'services' },
      { key: 'hooks', dir: 'hooks' },
      { key: 'contexts', dir: 'contexts' },
    ];

    categories.forEach(({ key, dir }) => {
      const dirPath = path.join(this.srcDir, dir);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath)
          .filter(f => f.endsWith('.ts') || f.endsWith('.tsx'))
          .map(f => ({
            name: f.replace(/\.(ts|tsx)$/, ''),
            path: path.join(dir, f),
            size: this.getFileSize(path.join(dirPath, f)),
          }));
        structure[key] = files;
      }
    });

    // Check types directory
    const typesPath = path.join(this.srcDir, 'types');
    if (fs.existsSync(typesPath)) {
      structure.types = fs.readdirSync(typesPath)
        .filter(f => f.endsWith('.ts'))
        .map(f => f.replace('.ts', ''));
    }

    return structure;
  }

  /**
   * Get file size in KB
   */
  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return Math.round(stats.size / 1024);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Analyze recent changes in the codebase
   */
  analyzeRecentChanges(days = 7) {
    try {
      const since = `${days}.days.ago`;
      const gitLog = execSync(
        `git log --since="${since}" --name-only --pretty=format:"COMMIT:%H|%s|%ar" --`,
        { encoding: 'utf8', cwd: this.rootDir }
      ).trim();

      if (!gitLog) {
        return { commits: 0, files: new Set(), areas: {} };
      }

      const lines = gitLog.split('\n');
      const commits = [];
      const files = new Set();
      const areas = {};

      let currentCommit = null;

      lines.forEach(line => {
        if (line.startsWith('COMMIT:')) {
          if (currentCommit) {
            commits.push(currentCommit);
          }
          const [hash, message, time] = line.substring(7).split('|');
          currentCommit = { hash: hash.substring(0, 7), message, time, files: [] };
        } else if (line && currentCommit) {
          currentCommit.files.push(line);
          files.add(line);

          // Categorize by area
          if (line.includes('/src/components/')) {
            areas.components = (areas.components || 0) + 1;
          } else if (line.includes('/src/pages/')) {
            areas.pages = (areas.pages || 0) + 1;
          } else if (line.includes('/src/services/')) {
            areas.services = (areas.services || 0) + 1;
          } else if (line.includes('/src/hooks/')) {
            areas.hooks = (areas.hooks || 0) + 1;
          } else if (line.includes('.md')) {
            areas.documentation = (areas.documentation || 0) + 1;
          }
        }
      });

      if (currentCommit) {
        commits.push(currentCommit);
      }

      return {
        commits: commits.length,
        files,
        areas,
        recentCommits: commits.slice(0, 5),
      };
    } catch (error) {
      return { commits: 0, files: new Set(), areas: {} };
    }
  }

  /**
   * Detect common patterns and practices
   */
  analyzeCodePatterns() {
    const patterns = {
      usesTypeScript: false,
      usesFirebase: false,
      usesReactRouter: false,
      usesContextAPI: false,
      usesCustomHooks: false,
      testCoverage: 'unknown',
    };

    try {
      const packageJsonPath = path.join(this.rootDir, 'my-wine-memory', 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        patterns.usesTypeScript = !!packageJson.devDependencies?.typescript;
        patterns.usesFirebase = !!packageJson.dependencies?.firebase;
        patterns.usesReactRouter = !!packageJson.dependencies?.['react-router-dom'];
      }

      const contextsDir = path.join(this.srcDir, 'contexts');
      patterns.usesContextAPI = fs.existsSync(contextsDir) &&
        fs.readdirSync(contextsDir).some(f => f.endsWith('.tsx'));

      const hooksDir = path.join(this.srcDir, 'hooks');
      patterns.usesCustomHooks = fs.existsSync(hooksDir) &&
        fs.readdirSync(hooksDir).some(f => f.endsWith('.ts'));

      return patterns;
    } catch (error) {
      return patterns;
    }
  }

  /**
   * Identify potential issues or areas for improvement
   */
  detectIssues() {
    const issues = [];

    // Check for missing .env
    const envPath = path.join(this.rootDir, 'my-wine-memory', '.env');
    if (!fs.existsSync(envPath)) {
      issues.push({
        severity: 'warning',
        type: 'config',
        message: 'Missing .env file - Firebase configuration may not be set up',
      });
    }

    // Check for node_modules
    const nodeModulesPath = path.join(this.rootDir, 'my-wine-memory', 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      issues.push({
        severity: 'error',
        type: 'dependencies',
        message: 'node_modules not found - run "npm install"',
      });
    }

    // Check for large files that might need optimization
    try {
      const srcPath = path.join(this.rootDir, 'my-wine-memory', 'src');
      if (fs.existsSync(srcPath)) {
        const checkDirectory = (dir) => {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
              checkDirectory(filePath);
            } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
              const sizeKB = stat.size / 1024;
              if (sizeKB > 500) {
                issues.push({
                  severity: 'info',
                  type: 'performance',
                  message: `Large file detected: ${filePath.replace(this.rootDir, '')} (${Math.round(sizeKB)}KB)`,
                });
              }
            }
          });
        };
        checkDirectory(srcPath);
      }
    } catch (error) {
      // Ignore errors in file scanning
    }

    return issues;
  }

  /**
   * Get comprehensive project insights
   */
  getFullAnalysis() {
    return {
      structure: this.analyzeStructure(),
      recentChanges: this.analyzeRecentChanges(7),
      patterns: this.analyzeCodePatterns(),
      issues: this.detectIssues(),
    };
  }

  /**
   * Generate a human-readable summary
   */
  generateSummary() {
    const analysis = this.getFullAnalysis();
    const { structure, recentChanges, patterns, issues } = analysis;

    let summary = '';

    // Structure overview
    summary += `📊 Code Structure:\n`;
    summary += `   Components: ${structure.components.length}\n`;
    summary += `   Pages: ${structure.pages.length}\n`;
    summary += `   Services: ${structure.services.length}\n`;
    summary += `   Custom Hooks: ${structure.hooks.length}\n`;
    summary += `   Contexts: ${structure.contexts.length}\n\n`;

    // Recent activity
    if (recentChanges.commits > 0) {
      summary += `📈 Recent Activity (7 days):\n`;
      summary += `   Commits: ${recentChanges.commits}\n`;
      summary += `   Files changed: ${recentChanges.files.size}\n`;
      if (Object.keys(recentChanges.areas).length > 0) {
        summary += `   Active areas:\n`;
        Object.entries(recentChanges.areas)
          .sort((a, b) => b[1] - a[1])
          .forEach(([area, count]) => {
            summary += `      ${area}: ${count} changes\n`;
          });
      }
      summary += `\n`;
    }

    // Tech stack
    summary += `🔧 Tech Stack:\n`;
    summary += `   TypeScript: ${patterns.usesTypeScript ? '✓' : '✗'}\n`;
    summary += `   Firebase: ${patterns.usesFirebase ? '✓' : '✗'}\n`;
    summary += `   React Router: ${patterns.usesReactRouter ? '✓' : '✗'}\n`;
    summary += `   Context API: ${patterns.usesContextAPI ? '✓' : '✗'}\n`;
    summary += `   Custom Hooks: ${patterns.usesCustomHooks ? '✓' : '✗'}\n\n`;

    // Issues
    if (issues.length > 0) {
      summary += `⚠️ Detected Issues:\n`;
      issues.forEach(issue => {
        const icon = issue.severity === 'error' ? '❌' :
                    issue.severity === 'warning' ? '⚠️' : 'ℹ️';
        summary += `   ${icon} ${issue.message}\n`;
      });
      summary += `\n`;
    }

    return summary;
  }
}

// Export for use in other scripts
if (require.main === module) {
  // Run as standalone script
  const analyzer = new ProjectAnalyzer();
  console.log(analyzer.generateSummary());
} else {
  // Export as module
  module.exports = ProjectAnalyzer;
}
