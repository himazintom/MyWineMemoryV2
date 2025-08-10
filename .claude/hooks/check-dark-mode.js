#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const toolUse = JSON.parse(process.env.CLAUDE_TOOL_USE || '{}');
const filePath = toolUse.parameters?.file_path;

if (filePath && (filePath.endsWith('.css') || filePath.endsWith('.tsx') || filePath.endsWith('.jsx'))) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for new CSS classes without dark mode variants
    if (filePath.endsWith('.css')) {
      const newClasses = content.match(/\.[a-zA-Z-]+[^{]*\s*{[^}]*}/g) || [];
      const missingDarkMode = newClasses.filter(cls => {
        const className = cls.split('{')[0].trim();
        return !content.includes(`[data-theme="dark"] ${className}`) &&
               !content.includes(`data-theme="dark"`) &&
               !className.includes('dark-mode') &&
               !className.includes(':root') &&
               !className.includes('@media');
      });
      
      if (missingDarkMode.length > 0) {
        console.log('⚠️  Warning: New CSS classes may need dark mode variants:');
        missingDarkMode.slice(0, 5).forEach(cls => {
          const className = cls.split('{')[0].trim();
          console.log(`  - ${className}`);
        });
        console.log('💡 Consider adding: [data-theme="dark"] prefix for dark mode support.');
      }
    }
    
    // Check for new divs/elements without dark mode classes in React files
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
      const newDivs = content.match(/<div[^>]*className="[^"]*"[^>]*>/g) || [];
      const potentialIssues = newDivs.filter(div => 
        !div.includes('data-theme') && 
        !div.includes('theme') &&
        div.includes('className=')
      );
      
      if (potentialIssues.length > 0) {
        console.log('💡 Tip: New elements detected. Ensure dark mode support in CSS.');
        console.log(`   Found ${potentialIssues.length} elements with classes.`);
      }
    }
    
  } catch (error) {
    // Silently ignore file read errors
  }
}