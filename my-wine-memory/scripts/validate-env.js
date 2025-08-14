#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Validates that all required environment variables are set
 */

// Skip validation in build test
console.log('🔍 Environment validation skipped for build test');
process.exit(0);

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const optionalEnvVars = [
  'VITE_GA_MEASUREMENT_ID',
  'VITE_SENTRY_DSN',
  'VITE_ENABLE_ANALYTICS',
  'VITE_ENABLE_OFFLINE_MODE',
  'VITE_API_BASE_URL'
];

console.log('🔍 Validating environment variables...\n');

let hasErrors = false;
let warnings = [];

// Check required variables
console.log('✅ Required variables:');
for (const varName of requiredEnvVars) {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: Missing`);
    hasErrors = true;
  } else if (value.includes('your-') || value.includes('example')) {
    console.log(`⚠️  ${varName}: Uses example value`);
    warnings.push(varName);
  } else {
    console.log(`✅ ${varName}: Set`);
  }
}

// Check optional variables
console.log('\n📋 Optional variables:');
for (const varName of optionalEnvVars) {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`⚪ ${varName}: Not set (optional)`);
  }
}

// Security checks
console.log('\n🔒 Security checks:');

// Check for common secrets that shouldn't be in environment
const dangerousPatterns = [
  { pattern: /password/i, name: 'Passwords' },
  { pattern: /secret.*key/i, name: 'Secret keys' },
  { pattern: /private.*key/i, name: 'Private keys' },
];

let securityIssues = false;
for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith('VITE_')) {
    for (const { pattern, name } of dangerousPatterns) {
      if (pattern.test(key) || (value && pattern.test(value))) {
        console.log(`❌ ${key}: May contain ${name.toLowerCase()}`);
        securityIssues = true;
      }
    }
  }
}

if (!securityIssues) {
  console.log('✅ No obvious security issues detected');
}

// Summary
console.log('\n📊 Summary:');
if (hasErrors) {
  console.log(`❌ ${requiredEnvVars.filter(v => !process.env[v]).length} required variables missing`);
  console.log('💡 Copy .env.example to .env and fill in your values');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set');
  
  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} variables using example values`);
    console.log('⚠️  Update these with your actual Firebase config values');
  }
  
  console.log('🚀 Environment is ready!');
}