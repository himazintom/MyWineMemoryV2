#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Get the files that were modified
const modifiedFiles = process.argv.slice(2);
console.log('🔧 Auto-build hook triggered');

// Check if any TypeScript/React files were modified
const shouldBuild = modifiedFiles.some(file => 
  file.includes('/src/') && 
  (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'))
);

if (!shouldBuild) {
  console.log('⏭️  No source files changed, skipping build');
  process.exit(0);
}

console.log(`📁 Modified files: ${modifiedFiles.join(', ')}`);

try {
  // Change to the project directory
  process.chdir(path.join(__dirname, '../../my-wine-memory'));
  
  console.log('🏗️  Running build...');
  const buildOutput = execSync('npm run build', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ Build completed successfully');
  
  // Check for any warnings or notices
  if (buildOutput.includes('warning') || buildOutput.includes('Warning')) {
    console.log('⚠️  Build completed with warnings:');
    console.log(buildOutput);
  }
  
} catch (error) {
  console.error('❌ Build failed:');
  console.error(error.stdout || error.message);
  
  // Don't fail the hook - let Claude continue and fix the issues
  console.log('🔄 Build failed, but continuing to allow fixes...');
}