#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Auto-commit hook checking for changes...');

try {
  // Check for uncommitted changes
  const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  
  if (!status) {
    console.log('✨ No changes to commit');
    process.exit(0);
  }
  
  const changedFiles = status.split('\n').map(line => line.substring(3));
  const sourceChanges = changedFiles.filter(file => 
    file.includes('src/') && 
    (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'))
  );
  
  // Only auto-commit if we have meaningful source changes
  if (sourceChanges.length === 0) {
    console.log('⏭️  No source file changes detected, skipping auto-commit');
    process.exit(0);
  }
  
  // Count the number of changes
  const totalChanges = changedFiles.length;
  
  // Auto-commit threshold: 3+ files or significant changes
  if (totalChanges >= 3 || sourceChanges.length >= 2) {
    console.log(`📊 Detected ${totalChanges} changed files (${sourceChanges.length} source files)`);
    console.log('🚀 Auto-committing changes...');
    
    // Stage source files
    sourceChanges.forEach(file => {
      try {
        execSync(`git add "${file}"`, { stdio: 'pipe' });
      } catch (error) {
        console.log(`⚠️  Could not stage ${file}`);
      }
    });
    
    // Generate commit message based on changes
    let commitMessage = generateCommitMessage(sourceChanges);
    
    // Commit with generated message
    execSync(`git commit -m "${commitMessage}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"`, { stdio: 'pipe' });
    
    console.log('✅ Changes committed successfully');
    console.log(`📝 Commit message: ${commitMessage}`);
    
    // Ask if should push (output suggestion for Claude)
    console.log('💡 Suggestion: Consider pushing changes with `git push`');
    
  } else {
    console.log(`📊 ${totalChanges} changes detected, but below auto-commit threshold`);
  }
  
} catch (error) {
  console.log('⚠️  Auto-commit check failed (this is normal if not in a git repo)');
}

function generateCommitMessage(changedFiles) {
  const fileTypes = {
    components: changedFiles.filter(f => f.includes('/components/')),
    pages: changedFiles.filter(f => f.includes('/pages/')),
    services: changedFiles.filter(f => f.includes('/services/')),
    hooks: changedFiles.filter(f => f.includes('/hooks/')),
    types: changedFiles.filter(f => f.includes('/types/'))
  };
  
  let message = '';
  
  if (fileTypes.pages.length > 0) {
    message += `Update pages (${fileTypes.pages.length} files)`;
  }
  if (fileTypes.components.length > 0) {
    message += message ? ` and components` : `Update components (${fileTypes.components.length} files)`;
  }
  if (fileTypes.services.length > 0) {
    message += message ? ` and services` : `Update services (${fileTypes.services.length} files)`;
  }
  
  return message || `Update ${changedFiles.length} source files`;
}