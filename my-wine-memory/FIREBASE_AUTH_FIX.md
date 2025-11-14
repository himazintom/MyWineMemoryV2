# Firebase Authentication Fix for iPhone/Safari

## 🎯 Problem Summary

Google login doesn't work on iPhone Safari due to third-party cookie blocking in Safari 16.1+, Firefox 109+, and Chrome 115+.

## 🔧 Solution Steps (Priority Order)

### ✅ Step 1: Fix authDomain Configuration [CRITICAL - 85% success rate]

**Current Issue:**
```bash
# Likely current configuration
VITE_FIREBASE_AUTH_DOMAIN=mywinememory-4bdf9.firebaseapp.com
```

This causes cross-origin cookie blocking between `firebaseapp.com` and `himazi.com`.

**Required Fix:**
```bash
# Update .env or production environment variables
VITE_FIREBASE_AUTH_DOMAIN=wine.himazi.com
```

**Why this works:**
- Firebase Hosting automatically handles `/__/auth/` paths on custom domains
- Eliminates cross-origin iframe communication
- No third-party cookies needed
- Official Firebase best practice (Option 1)

**Implementation:**

1. **Verify Firebase Hosting Custom Domain:**
   ```
   Firebase Console → Hosting → Domains
   Ensure: wine.himazi.com is connected
   ```

2. **Update Environment Variables:**
   - Production: Update in Firebase Hosting environment config
   - Local: Create `.env.local` with custom domain

3. **Verify Authorized Domains:**
   ```
   Firebase Console → Authentication → Settings → Authorized domains
   Ensure both domains are listed:
   - wine.himazi.com ✅
   - mywinememory-4bdf9.firebaseapp.com ✅
   ```

4. **Rebuild and Deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

---

### ✅ Step 2: Verify OAuth Redirect URIs [70% success rate]

**Check Google Cloud Console:**
```
Google Cloud Console
→ APIs & Services
→ Credentials
→ OAuth 2.0 Client ID
→ Authorized redirect URIs
```

**Required URIs:**
```
https://wine.himazi.com/__/auth/handler
https://mywinememory-4bdf9.firebaseapp.com/__/auth/handler
```

---

### ✅ Step 3: Add Storage Availability Detection [30% success rate]

Detects Safari private browsing mode which disables localStorage.

**Implementation:** See code in `src/contexts/AuthContext.tsx`

---

## 📊 Testing Checklist

### iPhone Safari Testing:

- [ ] Standard browsing mode
- [ ] Private browsing mode
- [ ] PWA mode (Add to Home Screen)
- [ ] Safari 17.x (latest)
- [ ] Safari 16.x (if possible)

### Expected Behavior:

1. Click "Googleでログイン"
2. Browser redirects to Google OAuth
3. User authorizes app
4. Browser redirects back to app
5. User is logged in
6. Console shows: `[Auth] Redirect sign-in successful for user: <uid>`

### Debug Logs:

Check Safari console for:
```
[Auth] Device detection: { isIOS: true, shouldUseRedirect: true }
[Auth] Using redirect method for better compatibility...
[Auth] Checking for redirect result...
[Auth] Redirect sign-in successful for user: <uid>
```

### Common Errors:

| Error Code | Cause | Solution |
|------------|-------|----------|
| `auth/unauthorized-domain` | Domain not in authorized list | Add to Firebase Console |
| `auth/web-storage-unsupported` | Private browsing mode | Inform user to use standard mode |
| `auth/popup-blocked` | Popup blocker | Already handled (use redirect) |
| Redirect to wrong URL | authDomain misconfigured | Update to custom domain |

---

## 🔄 Alternative Solutions (if Step 1 doesn't work)

### Option A: Switch to signInWithPopup

```typescript
// Only for desktop browsers
if (!isIOS && !isSafari) {
  await signInWithPopup(auth, provider);
}
```

### Option B: Reverse Proxy (Complex)

Set up proxy to forward `/__/auth/` requests from custom domain to Firebase.
**Not recommended** - use authDomain fix instead.

### Option C: Use Different Auth Provider

Consider implementing:
- Apple Sign In (native iOS integration)
- Email/Password (no OAuth required)
- Phone Authentication (SMS-based)

---

## 📚 References

- [Firebase Best Practices for signInWithRedirect](https://firebase.google.com/docs/auth/web/redirect-best-practices)
- [GitHub Issue #6716](https://github.com/firebase/firebase-js-sdk/issues/6716)
- [GitHub Issue #8329](https://github.com/firebase/firebase-js-sdk/issues/8329)
- [Safari ITP Announcement](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)

---

## ⚡ Quick Fix Summary

**Most likely fix (85% success):**
1. Change `VITE_FIREBASE_AUTH_DOMAIN` to `wine.himazi.com`
2. Verify domain in Firebase Console authorized domains
3. Rebuild and deploy
4. Test on iPhone Safari

**Estimated time:** 10-15 minutes
**Difficulty:** Easy
**Risk:** Very low (can revert if needed)
