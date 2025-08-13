# MyWineMemory Development Setup

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account
- Git

## Initial Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd my-wine-memory
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
npm run setup:env

# Or manually
cp .env.example .env
```

### 3. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable the following services:
   - Authentication (Google provider)
   - Firestore Database
   - Storage
4. Get your config from Project Settings → General → Your apps
5. Update `.env` with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Validate Setup

```bash
# Check environment variables
npm run validate:env

# Run security checks
npm run security:check
```

### 5. Deploy Security Rules

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules,storage:rules
```

## Development

### Start Development Server

```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode  
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run validate:env` - Validate environment variables
- `npm run security:check` - Run security audit

## Security Notes

### Environment Variables

- **Never commit `.env` files** - they're in `.gitignore`
- All public environment variables must be prefixed with `VITE_`
- Validate environment variables before build with `npm run validate:env`
- Use example values in `.env.example` (never real secrets)

### Firebase Security

- Firestore rules are strictly configured for owner-only access
- Storage rules limit file types and sizes
- Authentication is required for most operations
- Regular security audits with `npm run security:check`

## Production Deployment

1. Ensure all environment variables are set in your hosting platform
2. Run security validation: `npm run security:check`
3. Build: `npm run build` 
4. Deploy: `firebase deploy`

## Troubleshooting

### Common Issues

**Environment Variable Errors:**
```bash
# Validate your configuration
npm run validate:env

# Check for typos in .env file
```

**Firebase Connection Issues:**
- Verify project ID matches Firebase console
- Check authentication domain settings
- Ensure Firebase services are enabled

**Build Errors:**
- Run `npm run lint` to check for code issues
- Check TypeScript errors with `tsc --noEmit`
- Validate environment with `npm run validate:env`

### Getting Help

1. Check the console for detailed error messages
2. Validate environment setup with provided scripts
3. Review Firebase console for service status
4. Check network connectivity and CORS settings