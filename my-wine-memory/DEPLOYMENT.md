# MyWineMemory Deployment Guide

## GitHub Repository Secrets (✅ Already Configured)

Your repository already has the following secrets configured:

### Firebase Configuration
- ✅ `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON
- ✅ `VITE_FIREBASE_API_KEY` - Firebase API key
- ✅ `VITE_FIREBASE_APP_ID` - Firebase App ID
- ✅ `VITE_FIREBASE_AUTH_DOMAIN` - Firebase Auth domain
- ✅ `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase Messaging Sender ID
- ✅ `VITE_FIREBASE_PROJECT_ID` - Firebase Project ID
- ✅ `VITE_FIREBASE_STORAGE_BUCKET` - Firebase Storage bucket

## Deployment Process

### 1. Automatic Deployment (Recommended)

With your current GitHub Secrets setup:

1. **Push to main branch** → Automatic deployment to production
2. **Create PR** → Build verification and testing
3. **Merge PR** → Deployment pipeline activated

### 2. Activate GitHub Actions

To enable CI/CD pipeline:

```bash
# Copy workflow template
cp .github/workflows/ci.yml.example .github/workflows/ci.yml

# Commit the workflow
git add .github/workflows/ci.yml
git commit -m "Add CI/CD pipeline"
git push
```

### 3. Manual Deployment

For manual deployments:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
firebase deploy
```

## Environment Configuration by Environment

### Development (.env.local)
```env
VITE_FIREBASE_PROJECT_ID=your-dev-project-id
VITE_DEBUG=true
```

### Production (GitHub Secrets)
- All secrets already configured ✅
- Deployed automatically on main branch push

### Staging (Optional)
```env
VITE_FIREBASE_PROJECT_ID=your-staging-project-id
VITE_DEBUG=false
```

## Security Checklist

### ✅ Repository Security (Completed)
- [x] GitHub Secrets configured
- [x] Environment variables validated
- [x] .env files in .gitignore
- [x] Security audit passing (0 vulnerabilities)

### ✅ Firebase Security (Completed)
- [x] Firestore security rules enforced
- [x] Storage security rules configured
- [x] Authentication required for sensitive operations

### ✅ Build Security (Completed)
- [x] Environment validation in build process
- [x] TypeScript strict mode enabled
- [x] ESLint security rules active

## Deployment Commands

```bash
# Full deployment preparation
npm run security:check        # Audit + env validation
npm run build                 # Production build
firebase deploy               # Deploy to Firebase

# Quick checks
npm run validate:env          # Check environment vars
npm run pre-commit            # Pre-commit validation
npm run setup:git             # Setup Git hooks
```

## Monitoring & Maintenance

### Post-Deployment Verification
1. Check application loads: https://my-wine-memory.himazi.com
2. Verify authentication works
3. Test wine record creation
4. Check Firebase console for errors

### Regular Maintenance
```bash
# Weekly security check
npm run security:check

# Monthly dependency updates
npm update && npm audit fix

# Quarterly environment review
npm run validate:env
```

## Troubleshooting

### Deployment Failures
1. **Build fails**: Check `npm run validate:env`
2. **Firebase errors**: Verify project ID in GitHub Secrets
3. **Auth issues**: Check Firebase Auth domain configuration

### Environment Issues
```bash
# Debug environment
npm run validate:env

# Reset environment
npm run setup:env
```

Your deployment setup is production-ready! 🚀