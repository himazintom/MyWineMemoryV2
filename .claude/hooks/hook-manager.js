#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const toolUse = JSON.parse(process.env.CLAUDE_TOOL_USE || '{}');
const toolName = toolUse.name;
const filePath = toolUse.parameters?.file_path;

// Extract files from the tool parameters
const modifiedFiles = [];
if (filePath) {
  modifiedFiles.push(filePath);
}
if (toolUse.parameters?.edits) {
  // MultiEdit case
  modifiedFiles.push(filePath);
}

console.log('🎯 Hook Manager activated');

// Always run dark mode check for UI files
if (filePath && (filePath.endsWith('.tsx') || filePath.endsWith('.jsx') || filePath.endsWith('.css'))) {
  try {
    require('./check-dark-mode.js');
  } catch (error) {
    console.log('⚠️  Dark mode check skipped');
  }
}

// Run build check for source files
if (modifiedFiles.some(file => 
  file && file.includes('/src/') && 
  (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'))
)) {
  try {
    execSync(`node "${path.join(__dirname, 'auto-build.js')}" ${modifiedFiles.join(' ')}`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
  } catch (error) {
    console.log('⚠️  Auto-build check skipped');
  }
}

// Run auto-commit check (less frequent - only on multiple changes)
try {
  execSync(`node "${path.join(__dirname, 'auto-commit.js')}"`, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.log('⚠️  Auto-commit check skipped');
}