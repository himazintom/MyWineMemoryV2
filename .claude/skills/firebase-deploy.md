# Firebase Deploy

Deploy MyWineMemory application to Firebase Hosting with pre-deployment validation.

## What this skill does

1. Run pre-deployment checks (tests, build, security)
2. Build the production bundle
3. Deploy to Firebase Hosting
4. Verify deployment success
5. Provide deployment URL

## Usage

Use this skill when:
- Ready to deploy to production
- After completing and testing new features
- Need to update the live site at wine.himazi.com
- Rolling back to a previous version

## Instructions

Execute the following steps in sequence:

1. Navigate to project directory:
   ```bash
   cd my-wine-memory
   ```

2. Run pre-deployment validation:
   ```bash
   npm run validate:env
   npm run lint
   npm run test
   ```

3. Build production bundle:
   ```bash
   npm run build
   ```

4. Check Firebase authentication:
   - Verify user is logged into Firebase CLI
   - If not logged in: STOP and ask user to run `firebase login`

5. Deploy to Firebase:
   ```bash
   firebase deploy --only hosting
   ```

6. Verify deployment:
   - Check that deployment completed successfully
   - Note the deployed URL
   - Confirm the site is accessible

7. Report results:
   - Deployment status (success/failure)
   - Live URL: https://wine.himazi.com
   - Firebase Hosting URL
   - Any warnings or issues encountered

## Pre-deployment Checklist

- ✅ Environment variables are properly configured
- ✅ All tests pass
- ✅ Build completes without errors
- ✅ No security vulnerabilities
- ✅ Firebase CLI is authenticated

## Important Notes

- **Budget Awareness**: Keep operational costs under 1000 JPY/month
- **Security**: Ensure HTTPS is properly configured
- **Rollback**: If deployment fails, previous version remains live
- **CI/CD**: GitHub Actions should handle automatic deployments, use this for manual overrides only

## Success Criteria

- Build completes successfully
- Deployment to Firebase Hosting succeeds
- Site is accessible at wine.himazi.com
- No console errors on the deployed site
