#!/usr/bin/env node

/**
 * Git Environment Setup Script
 * Sets up Git hooks and checks for sensitive data
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Git environment...\n');

// Check if this is a git repository
if (!fs.existsSync('.git')) {
    console.log('❌ Not a Git repository. Run "git init" first.');
    process.exit(1);
}

// Setup git hooks
const hooksDir = '.git/hooks';
const preCommitSource = '.githooks/pre-commit.example';
const preCommitTarget = path.join(hooksDir, 'pre-commit');

if (fs.existsSync(preCommitSource)) {
    try {
        const hookContent = fs.readFileSync(preCommitSource, 'utf8');
        fs.writeFileSync(preCommitTarget, hookContent);
        
        // Make executable on Unix systems
        if (process.platform !== 'win32') {
            fs.chmodSync(preCommitTarget, '755');
        }
        
        console.log('✅ Pre-commit hook installed');
    } catch (error) {
        console.log(`⚠️  Failed to install pre-commit hook: ${error.message}`);
    }
} else {
    console.log('⚪ Pre-commit hook template not found');
}

// Check for sensitive patterns in existing files
console.log('\n🔍 Scanning for sensitive patterns...');

const sensitivePatterns = [
    /api[_\-]?key\s*[:=]\s*["'][^"']{20,}["']/i,
    /secret[_\-]?key\s*[:=]\s*["'][^"']{20,}["']/i,
    /password\s*[:=]\s*["'][^"']{8,}["']/i,
    /token\s*[:=]\s*["'][^"']{20,}["']/i,
    /firebase[_\-]?service[_\-]?account/i,
];

let foundSensitive = false;
const scanFiles = [
    'src/**/*.ts',
    'src/**/*.tsx', 
    'src/**/*.js',
    '*.json',
    '*.md'
];

function scanFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        sensitivePatterns.forEach((pattern, index) => {
            if (pattern.test(content)) {
                console.log(`⚠️  Potential sensitive data in ${filePath}`);
                foundSensitive = true;
            }
        });
    } catch (error) {
        // File might not exist or be readable, skip
    }
}

// Simple file scanner (replace with glob in production)
function scanDirectory(dir) {
    try {
        const entries = fs.readdirSync(dir);
        
        entries.forEach(entry => {
            const fullPath = path.join(dir, entry);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
                scanDirectory(fullPath);
            } else if (stat.isFile() && /\.(ts|tsx|js|json|md)$/.test(entry)) {
                scanFile(fullPath);
            }
        });
    } catch (error) {
        // Directory might not exist, skip
    }
}

scanDirectory('.');

if (foundSensitive) {
    console.log('\n🚨 Sensitive patterns detected!');
    console.log('💡 Review flagged files and remove any hardcoded secrets');
    console.log('💡 Use environment variables instead');
} else {
    console.log('✅ No obvious sensitive patterns detected');
}

// Git configuration recommendations
console.log('\n⚙️  Git Configuration Recommendations:');

const gitConfigs = [
    ['core.autocrlf', 'input', 'Handle line endings'],
    ['init.defaultBranch', 'main', 'Use main as default branch'],
    ['pull.rebase', 'true', 'Use rebase for pulls'],
    ['fetch.prune', 'true', 'Auto-prune deleted branches'],
];

gitConfigs.forEach(([key, value, description]) => {
    console.log(`💡 git config ${key} ${value}  # ${description}`);
});

// Environment variable checklist
console.log('\n📋 Environment Variables Checklist:');
console.log('✓ .env files are in .gitignore');
console.log('✓ .env.example provides template');
console.log('✓ CI/CD secrets are configured in repository settings');
console.log('✓ Production secrets are set in hosting platform');

console.log('\n🚀 Git environment setup complete!');
console.log('💡 Run "npm run validate:env" before each commit');
console.log('💡 Review .github/workflows/ci.yml.example for CI/CD setup');