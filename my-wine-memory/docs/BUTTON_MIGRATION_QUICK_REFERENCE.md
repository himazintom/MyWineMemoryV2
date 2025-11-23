# Button Migration Quick Reference

## At a Glance

### Status Summary
```
✅ Already Migrated:      5 (action-button, edit-record-button, delete-record-button, tab-button, mode-button)
🔴 Remaining to Migrate:  20
🟡 Keep Custom:           7
   ├─ back-button (5 uses) - absolute positioning
   ├─ category-button (1 use) - pill-style toggle
   ├─ wine-type-button (1 use) - dynamic colors
   ├─ add-url-button (1 use) - dashed border
   ├─ image-add-button (1 use) - grid layout
   ├─ remove-image-button (1 use) - positioned delete
   └─ privacy-toggle-button (1 use) - state toggle
```

---

## HIGH PRIORITY MIGRATIONS (Start Here!)

### Challenge Mode Buttons (5 uses)
**Location:** QuizLevelSelect.tsx (lines 435, 438, 441, 444)
```tsx
// BEFORE - No CSS definition
<button className="challenge-mode time-attack">⏱️ タイムアタック</button>

// AFTER
<button className="btn btn-mode">⏱️ タイムアタック</button>
```

### Get Started Buttons (3 uses)
**Locations:** 
- Home.tsx:262
- Records.tsx:61, 128

```tsx
// BEFORE
<button className="get-started-button" onClick={handleClick}>
  Get Started
</button>

// AFTER
<button className="btn btn-primary btn-full" onClick={handleClick}>
  Get Started
</button>
```

### Close Buttons (3 uses)
**Locations:**
- LoginPrompt.tsx:51
- AddTastingRecord.tsx:481
- SelectWine.tsx:292

```tsx
// BEFORE
<button className="close-button" onClick={onClose}>×</button>

// AFTER
<button className="btn btn-icon btn-sm" onClick={onClose}>×</button>
```

---

## MEDIUM PRIORITY MIGRATIONS

### CTA Buttons (8 total)
| Button | File | Count | Target |
|--------|------|-------|--------|
| add-tasting-button | WineDetail.tsx:172 | 1 | `.btn btn-primary` |
| add-first-record-button | WineDetail.tsx:349 | 1 | `.btn btn-primary btn-full` |
| add-detailed-record-button | WineDetail.tsx:498 | 1 | `.btn btn-primary` |
| add-record-button | Records.tsx:77 | 1 | `.btn btn-primary` |
| create-new-wine-button | SelectWine.tsx:226 | 1 | `.btn btn-primary btn-full` |
| cta-button | PublicProfile.tsx:179 | 1 | `.btn btn-primary btn-full` |
| view-all-button | Home.tsx:252 | 1 | `.btn btn-secondary btn-full` |
| view-all-records-button | WineDetail.tsx:336 | 1 | `.btn btn-secondary btn-full` |

### Auth Buttons (3 total)
| Button | File | Target |
|--------|------|--------|
| google-signin-button | LoginPrompt.tsx:70, WineDetail.tsx:152 | `.btn btn-secondary` |
| google-login-button | Profile.tsx:179 | `.btn btn-secondary` |
| login-suggestion-button | Home.tsx:101 | `.btn btn-primary` |

### Action/Navigation Buttons (4 total)
| Button | File | Count | Target |
|--------|------|-------|--------|
| next-button | QuizGame.tsx:558 | 2 | `.btn btn-primary` |
| retry-button | ErrorMessage.tsx:24 | 1 | `.btn btn-primary` |
| quiz-action-button | Quiz.tsx:121 | 1 | `.btn btn-mode` |
| public-profile-button | Profile.tsx:186 | 1 | `.btn btn-secondary` |

### Utility Buttons (5 total)
| Button | File | Target |
|--------|------|--------|
| logout-button | Profile.tsx:191 | `.btn btn-danger` |
| cancel-button | LoginPrompt.tsx:84 | `.btn btn-secondary` |
| copy-button | Profile.tsx:385 | `.btn btn-secondary btn-sm` |
| view-analysis-button | WineDetail.tsx:467 | `.btn btn-secondary` |
| remove-url-button | AddTastingRecord.tsx:1080 | `.btn btn-danger btn-sm` |

---

## BUTTONS TO KEEP CUSTOM

### Design-Specific Styling Required
1. **back-button** (5 uses)
   - Needs: `position: absolute; left: 1rem; top: 1.5rem;`
   - Found in: Page headers across multiple pages
   - Status: ✅ KEEP AS IS

2. **category-button** (1 use)
   - Needs: Pill-style border-radius (20px)
   - Used for: Aroma category selection
   - Status: ✅ KEEP AS IS

3. **wine-type-button** (1 use)
   - Needs: Dynamic border/background colors (data-driven)
   - Used for: Wine type filter
   - Status: ✅ KEEP AS IS
   - File: WineFilter.css:148-167

4. **add-url-button** (1 use)
   - Needs: Dashed border (distinctive "add" pattern)
   - Used for: Add reference URL field
   - Status: ✅ KEEP AS IS

5. **image-add-button** (1 use)
   - Needs: Grid layout positioning
   - Used for: Image gallery upload
   - Status: ✅ KEEP AS IS

6. **remove-image-button** (1 use)
   - Needs: Positioned absolutely on image
   - Alternative: Could use `.btn btn-icon` with custom positioning
   - Current: ✅ KEEP AS IS

7. **privacy-toggle-button** (1 use)
   - Needs: State-based styling (public/private)
   - Recommendation: Migrate to `.btn btn-toggle` with state classes
   - Status: ⚠️ CONSIDER MIGRATION

---

## IMPLEMENTATION ORDER

### Week 1: Quick Wins (10 buttons)
```
Commit 1: Migrate CTA buttons (8 buttons)
  ├─ add-tasting-button → btn-primary
  ├─ add-first-record-button → btn-primary btn-full
  ├─ add-detailed-record-button → btn-primary
  ├─ add-record-button → btn-primary
  ├─ create-new-wine-button → btn-primary btn-full
  ├─ cta-button → btn-primary btn-full
  ├─ view-all-button → btn-secondary btn-full
  └─ view-all-records-button → btn-secondary btn-full

Commit 2: Migrate challenge-mode & quiz buttons (3 buttons)
  ├─ challenge-mode → btn-mode
  ├─ quiz-action-button → btn-mode
  └─ level-button → btn-primary (with state modifiers)

Commit 3: Migrate authentication buttons (3 buttons)
  ├─ google-signin-button → btn-secondary
  ├─ google-login-button → btn-secondary
  └─ login-suggestion-button → btn-primary
```

### Week 2: Remaining (10 buttons)
```
Commit 4: Migrate navigation & utility buttons (5 buttons)
  ├─ next-button → btn-primary
  ├─ retry-button → btn-primary
  ├─ logout-button → btn-danger
  ├─ cancel-button → btn-secondary
  └─ public-profile-button → btn-secondary

Commit 5: Migrate close & copy buttons (3 buttons)
  ├─ close-button → btn-icon btn-sm
  ├─ copy-button → btn-secondary btn-sm
  ├─ view-analysis-button → btn-secondary
  └─ remove-url-button → btn-danger btn-sm

Commit 6: Migrate fixed positioning & state buttons (2 buttons)
  ├─ next-button-fixed → btn-primary (with wrapper div)
  └─ privacy-toggle-button → btn-toggle (optional)
```

---

## Testing Checklist

For each migrated button:
- [ ] Button displays correctly in light mode
- [ ] Button displays correctly in dark mode
- [ ] Hover state matches design system
- [ ] Active/focused state visible
- [ ] Disabled state appears when applicable
- [ ] Mobile responsive (touch target ≥44px)
- [ ] Icon alignment proper (if icon button)
- [ ] Text truncation handled (for long labels)
- [ ] No conflicting inline styles
- [ ] Consistent with surrounding UI

---

## Before/After Examples

### Example 1: Simple Primary Button
```tsx
// BEFORE
<button className="get-started-button">Start</button>

// AFTER
<button className="btn btn-primary btn-full">Start</button>
```

### Example 2: Auth Button
```tsx
// BEFORE
<button className="google-signin-button">
  <img src={googleIcon} alt="Google" />
  Sign in with Google
</button>

// AFTER
<button className="btn btn-secondary">
  <img src={googleIcon} alt="Google" />
  Sign in with Google
</button>
```

### Example 3: Quiz Mode Button
```tsx
// BEFORE
<button className="challenge-mode time-attack">
  ⏱️ タイムアタック
</button>

// AFTER
<button className="btn btn-mode">
  ⏱️ タイムアタック
</button>
```

### Example 4: Small Icon Button
```tsx
// BEFORE
<button className="close-button">×</button>

// AFTER
<button className="btn btn-icon btn-sm">×</button>
```

### Example 5: Destructive Action
```tsx
// BEFORE
<button className="remove-url-button">Remove</button>

// AFTER
<button className="btn btn-danger btn-sm">Remove</button>
```

---

## CSS Cleanup

After migrations are complete, remove from App.css:
- `.view-all-button` (line 658)
- `.get-started-button` (line 676)
- `.google-login-button` (line 994)
- `.logout-button` (line 1009)
- `.level-button` (lines 1066-1088, 7006-7032)
- `.back-button` (line 1152) - **EXCEPTION: Keep for positioning**
- `.next-button` (line 1531)
- `.retry-button` (line 2452)
- `.google-signin-button` (line 2803)
- `.login-suggestion-button` (line 2858)
- `.close-button` (line 2919) - **EXCEPTION: Keep if needed for modals**
- `.cancel-button` (line 2952)
- `.quiz-back-button` (line 3389)
- `.public-profile-button` (line 3690)
- `.create-new-wine-button` (line 4452)
- `.add-first-record-button` (line 5112)
- `.add-tasting-button` (line 5265)
- `.remove-url-button` (line 5845)
- `.add-url-button` (line 5860)
- `.add-detailed-record-button` (line 5981)
- `.view-all-records-button` (line 6043)
- `.view-analysis-button` (line 6060)
- `.remove-image-button` (line 6471) - **EXCEPTION: Keep for positioning**
- `.copy-button` (line 7230)
- `.quiz-action-button` (line 7079, 8110)
- `.next-button-fixed` (line 8038)

**KEEP in CSS:**
- `.back-button` (absolute positioning)
- `.category-button` (pill styling)
- `.wine-type-button` (in WineFilter.css)
- `.add-url-button` (dashed border)
- `.image-add-button` (grid layout)
- `.remove-image-button` (positioned delete icon)
- `.privacy-toggle-button` (if not migrated to btn-toggle)

