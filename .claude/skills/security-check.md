# Security Check

Run comprehensive security validation for MyWineMemory project.

## What this skill does

1. Validate environment variables configuration
2. Run npm audit for dependency vulnerabilities
3. Check Firebase security rules
4. Verify authentication implementation
5. Review data access patterns
6. Check for common security issues

## Usage

Use this skill when:
- Before deploying to production
- After adding new dependencies
- When updating Firebase configuration
- As part of regular security audits
- After modifying authentication or authorization code

## Instructions

### Step 1: Navigate to Project

```bash
cd my-wine-memory
```

### Step 2: Run Security Script

```bash
npm run security:check
```

This runs:
- `npm audit` - Check for vulnerable dependencies
- `npm run validate:env` - Verify environment variables

### Step 3: Manual Security Checks

#### 3.1 Environment Variables

Verify these files exist and are properly configured:
- `.env` exists and is in `.gitignore`
- `.env.example` has template without real values
- No sensitive data in version control

Check for:
```bash
git log --all --full-history -- "**/.env"
```

If `.env` found in git history, ALERT USER immediately.

#### 3.2 Firebase Security Rules

Review `firestore.rules`:

```bash
cat firestore.rules
```

Verify:
- All collections require authentication
- Users can only access their own data (`request.auth.uid == resource.data.userId`)
- No rules with `allow read, write: if true;`
- Proper validation for data types and required fields

Review `storage.rules`:

```bash
cat storage.rules
```

Verify:
- Image uploads require authentication
- File size limits are enforced
- Only allowed file types (images)
- User isolation for uploaded files

#### 3.3 Authentication Implementation

Check authentication context:

```bash
grep -r "currentUser" src/
```

Verify:
- Protected routes check authentication
- API calls include user authentication
- No hardcoded credentials

#### 3.4 Data Access Patterns

Review service files:

```bash
grep -r "collection(db" src/services/
```

Verify:
- All queries filter by userId
- No global data access without user context
- Proper error handling

#### 3.5 Common Vulnerabilities

Check for:

**XSS Prevention:**
```bash
grep -r "dangerouslySetInnerHTML" src/
grep -r "innerHTML" src/
```

**Command Injection:**
```bash
grep -r "eval(" src/
grep -r "Function(" src/
```

**SQL Injection (Firestore):**
- Review where clauses for user input sanitization
- Check that user input is not directly used in queries

**Sensitive Data Exposure:**
```bash
grep -ri "password\|secret\|api.key\|token" src/
```

### Step 4: Dependency Audit

Run npm audit and review results:

```bash
npm audit
```

If vulnerabilities found:
- **Critical/High**: Fix immediately
- **Moderate**: Review and plan fix
- **Low**: Monitor and fix in next update

Update vulnerable packages:
```bash
npm audit fix
```

For breaking changes:
```bash
npm audit fix --force
```
(Use with caution, may break code)

### Step 5: Firebase Configuration

Verify Firebase config is properly secured:

Check `src/config/firebase.ts`:
- Uses environment variables (not hardcoded)
- Only includes public Firebase config
- No private keys or secrets

### Step 6: HTTPS Enforcement

Verify `firebase.json` enforces HTTPS:

```json
"headers": [{
  "source": "**",
  "headers": [{
    "key": "Strict-Transport-Security",
    "value": "max-age=31536000; includeSubDomains"
  }]
}]
```

### Step 7: Generate Security Report

Create a report with:
1. **Dependency Vulnerabilities**: Count and severity
2. **Security Rules**: Status (secure/needs review)
3. **Authentication**: Status (properly implemented/issues found)
4. **Data Access**: Status (user-isolated/potential leaks)
5. **Common Vulnerabilities**: Issues found
6. **Recommendations**: Prioritized list of fixes

## Security Checklist

- ✅ No vulnerable dependencies (or acceptable risk documented)
- ✅ Environment variables properly configured and not in git
- ✅ Firebase security rules enforce user isolation
- ✅ Storage rules enforce authentication and file type validation
- ✅ All routes properly protect authenticated content
- ✅ No XSS vulnerabilities
- ✅ No command injection risks
- ✅ Sensitive data not exposed in code
- ✅ HTTPS enforced
- ✅ Firebase config uses environment variables

## Common Issues and Fixes

### High Severity npm Vulnerabilities
```bash
npm audit fix
npm test  # Verify nothing broke
```

### Missing Environment Variables
- Copy from `.env.example`
- Fill in Firebase configuration values
- Add to `.gitignore` if not already

### Insecure Firestore Rules
- Add authentication check: `request.auth != null`
- Add user isolation: `request.auth.uid == resource.data.userId`
- Deploy rules: `firebase deploy --only firestore:rules`

### Exposed Sensitive Data
- Remove from code immediately
- Use environment variables instead
- Check git history and remove if found
- Rotate any exposed credentials

## Success Criteria

- No critical or high severity vulnerabilities
- All security rules enforce user authentication and isolation
- No sensitive data exposed in code or version control
- All security checklist items pass
- Security report generated with actionable recommendations
