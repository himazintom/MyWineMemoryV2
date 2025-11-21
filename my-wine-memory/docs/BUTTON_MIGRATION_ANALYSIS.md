# MyWineMemoryV2 Button Migration Plan

## Executive Summary
- **Total custom button classes found**: 32+
- **Already migrated**: 5 (action-button, edit-record-button, delete-record-button, tab-button, mode-button)
- **Remaining to analyze**: 27+
- **Recommended for migration**: 20 (High & Medium priority)
- **Recommended to keep custom**: 5-7 (special styling/branding requirements)

---

## Unified Button System Reference

The following unified button classes are available in `.btn` system:
- `.btn-primary` - Main CTAs, gradient background
- `.btn-secondary` - Alternative actions, bordered
- `.btn-tertiary` - Text/ghost buttons
- `.btn-danger` - Destructive actions
- `.btn-icon` - Circular icon-only buttons
- `.btn-tab` - Tab navigation with underline
- `.btn-toggle` - Mode switching with active state
- `.btn-mode` - Large mode selection cards

---

## PRIORITY 1: HIGH PRIORITY (5+ uses or critical user flows)

### 1. back-button (5 uses)
**Files:**
- AddTastingRecord.tsx:509
- SelectWine.tsx:184
- WineDetail.tsx:167
- PublicProfile.tsx:107
- UserPublicProfile.tsx:199

**Current CSS:**
```css
.back-button {
  position: absolute;
  left: 1rem;
  top: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: var(--btn-primary-text);
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
}
```

**Purpose:** Navigation/utility button in header
**Recommendation:** `btn-tertiary` or custom class with position styling
**Note:** Keep custom class as it needs absolute positioning in page headers

---

### 2. challenge-mode (5 uses - QuizLevelSelect)
**Files:**
- QuizLevelSelect.tsx:435, 438, 441, 444 (4 button variations)
- Used for: time-attack, perfect-run, random-100, blind-test

**Current State:** NO CSS DEFINITION - inherits default button styles
**Purpose:** Quiz challenge mode selection
**Recommendation:** `btn-mode` (already exists)
**Migration:** Change from `<button className="challenge-mode time-attack">` to `<button className="btn btn-mode">` 
**Priority:** HIGH - Uses undefined class, should consolidate to unified system

---

### 3. get-started-button (3 uses)
**Files:**
- Home.tsx:262 (View All Wines button)
- Records.tsx:61, 128 (Get Started prompt)

**Current CSS:**
```css
.get-started-button {
  width: 100%;
  padding: 1rem;
  border: none;
  background: var(--gradient-primary);
  color: var(--btn-primary-text);
  border-radius: 8px;
}
```

**Purpose:** Primary CTA for empty states
**Recommendation:** `.btn btn-primary btn-full`
**Migration:** Easy - consolidate to unified primary button

---

### 4. close-button (3 uses)
**Files:**
- LoginPrompt.tsx:51 (Modal close)
- AddTastingRecord.tsx:481 (Insight modal close)
- SelectWine.tsx:292 (Dialog close)

**Current CSS:**
```css
.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}
```

**Purpose:** Modal/dialog close button
**Recommendation:** `.btn btn-icon btn-sm` or `.btn btn-tertiary`
**Migration:** Consolidate to btn-icon (small circular icon button)

---

## PRIORITY 2: MEDIUM PRIORITY (1-2 uses, relatively simple)

### 5. google-signin-button (2 uses)
**Files:**
- LoginPrompt.tsx:70 (Login modal)
- WineDetail.tsx:152 (Protected content)

**Current CSS:**
```css
.google-signin-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.75rem 2rem;
  border-radius: 8px;
}
```

**Purpose:** Google authentication button
**Recommendation:** `btn-secondary` (neutral background with border)
**Migration:** Simple - Maps well to secondary button
**Note:** Could keep custom styling if Google branding requires specific treatment

---

### 6. next-button (2 uses in quiz game)
**Files:**
- QuizGame.tsx:558 (Next button in quiz)
- App.css:1531 (Quiz game progression)

**Current CSS:**
```css
.next-button {
  background: var(--wine-primary, var(--color-primary-dark));
  color: var(--btn-primary-text);
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
}
```

**Purpose:** Quiz navigation
**Recommendation:** `.btn btn-primary`
**Migration:** Straightforward - Maps directly to primary button

---

### 7. next-button-fixed (1 use)
**Files:**
- QuizGame.tsx:558

**Current CSS:**
```css
.next-button-fixed {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.875rem 2.5rem;
  border-radius: 30px;
  font-weight: bold;
  position: fixed;
}
```

**Purpose:** Fixed position next button in quiz
**Recommendation:** `.btn btn-primary` (with fixed positioning wrapper)
**Migration:** Separate positioning from button styling

---

### 8. retry-button (1 use)
**Files:**
- ErrorMessage.tsx:24

**Current CSS:**
```css
.retry-button {
  background: var(--primary-color);
  color: var(--btn-primary-text);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
}
```

**Purpose:** Error recovery
**Recommendation:** `.btn btn-primary` or `.btn btn-secondary`
**Migration:** Straightforward consolidation

---

### 9. quiz-action-button (1 use)
**Files:**
- Quiz.tsx:121 (Quiz mode selection)

**Current CSS:**
```css
.quiz-action-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--card-bg);
}
```

**Purpose:** Quiz mode action card
**Recommendation:** `.btn btn-mode` (large mode selection cards)
**Migration:** Maps to btn-mode in unified system

---

### 10. copy-button (1 use)
**Files:**
- Profile.tsx:385 (Copy share URL)

**Current CSS:**
```css
.copy-button {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}
```

**Purpose:** Copy to clipboard
**Recommendation:** `.btn btn-secondary btn-sm`
**Migration:** Use small secondary button

---

### 11. login-suggestion-button (1 use)
**Files:**
- Home.tsx:101 (Login prompt in dashboard)

**Current CSS:**
```css
.login-suggestion-button {
  background: var(--primary-color);
  color: var(--btn-primary-text);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
}
```

**Purpose:** Prompt user to login
**Recommendation:** `.btn btn-primary`
**Migration:** Direct migration to primary button

---

### 12. google-login-button (1 use)
**Files:**
- Profile.tsx:179

**Current CSS:** (Uses primary-color)
**Purpose:** OAuth login button
**Recommendation:** `.btn btn-secondary` (neutral treatment)
**Migration:** Consolidate to secondary

---

### 13. logout-button (1 use)
**Files:**
- Profile.tsx:191

**Current CSS:** (Primary styling)
**Purpose:** Authentication
**Recommendation:** `.btn btn-danger` (since it's destructive - logging out)
**Migration:** Use danger button for logout

---

### 14. public-profile-button (1 use)
**Files:**
- Profile.tsx:186

**Purpose:** View public profile
**Recommendation:** `.btn btn-secondary`
**Migration:** Simple secondary button

---

### 15. add-tasting-button (1 use)
**Files:**
- WineDetail.tsx:172

**Purpose:** Add new tasting record
**Recommendation:** `.btn btn-primary`
**Migration:** Primary button for main action

---

### 16. add-first-record-button (1 use)
**Files:**
- WineDetail.tsx:349

**Purpose:** Empty state CTA
**Recommendation:** `.btn btn-primary btn-full`
**Migration:** Primary full-width button

---

### 17. view-all-button (1 use)
**Files:**
- Home.tsx:252

**Current CSS:**
```css
.view-all-button {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--primary-color);
  background: var(--card-bg);
}
```

**Purpose:** Expand/explore button
**Recommendation:** `.btn btn-secondary btn-full`
**Migration:** Secondary button with border

---

### 18. view-all-records-button (1 use)
**Files:**
- WineDetail.tsx:336

**Purpose:** Expand records section
**Recommendation:** `.btn btn-secondary btn-full`
**Migration:** Secondary button

---

### 19. view-analysis-button (1 use)
**Files:**
- WineDetail.tsx:467

**Purpose:** View detailed analysis
**Recommendation:** `.btn btn-secondary`
**Migration:** Secondary button

---

### 20. add-detailed-record-button (1 use)
**Files:**
- WineDetail.tsx:498

**Purpose:** Detailed mode CTA
**Recommendation:** `.btn btn-primary`
**Migration:** Primary button

---

## PRIORITY 3: SIMPLE CONSOLIDATION (Single-purpose, utility)

### 21. cancel-button (1 use)
**Files:**
- LoginPrompt.tsx:84

**Recommendation:** `.btn btn-secondary`

---

### 22. level-button (5 uses across quiz)
**Files:**
- Quiz system (level selection)

**Current State:** Has custom styling for available/locked states
**Recommendation:** Create `.btn-quiz-level` extending btn-primary with state modifiers
**OR:** Use `.btn btn-primary` with state classes

---

## PRIORITY 4: KEEP CUSTOM (Dynamic styling based on data)

### 23. category-button
**Files:**
- AddTastingRecord.tsx:824 (Aroma categories)

**Current CSS:**
```css
.category-button {
  background: var(--secondary-bg);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.category-button.active {
  background: var(--primary-color);
  color: var(--btn-primary-text);
}
```

**Purpose:** Toggle-style category selection with active state
**Recommendation:** **KEEP CUSTOM** - Use for pill-style toggle buttons
**Reason:** Specific border-radius (20px pill style) and toggle behavior differs from unified buttons

---

### 24. wine-type-button
**Files:**
- WineFilter.tsx:192 (Wine type selection)

**Current CSS** (WineFilter.css):
```css
.wine-type-button {
  padding: 8px 12px;
  border: 2px solid #444;
  border-radius: 8px;
  background: transparent;
}

.wine-type-button.selected {
  color: white;
  font-weight: 600;
}
```

**Current Usage:** Uses inline styles for borderColor and backgroundColor based on wine type data
**Recommendation:** **KEEP CUSTOM** - Dynamic color styling per wine type
**Reason:** Border/background colors are data-driven, not static CSS variables

---

### 25. remove-image-button
**Files:**
- AddTastingRecord.tsx:581

**Current CSS:**
```css
.remove-image-button {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-red-dark);
  border-radius: 50%;
  width: 24px;
  height: 24px;
}
```

**Purpose:** Delete image from gallery
**Recommendation:** **KEEP CUSTOM** (OR use `.btn btn-icon btn-sm` with position)
**Note:** Could be refactored to use btn-icon with destructive styling

---

### 26. remove-url-button
**Files:**
- AddTastingRecord.tsx:1080

**Current CSS:**
```css
.remove-url-button {
  padding: 8px 12px;
  background: var(--error-text);
  color: var(--btn-primary-text);
  border: none;
}
```

**Purpose:** Remove reference URL
**Recommendation:** `.btn btn-danger btn-sm`
**Migration:** Use danger button for destructive action

---

### 27. add-url-button
**Files:**
- AddTastingRecord.tsx:1089

**Current CSS:**
```css
.add-url-button {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 2px dashed var(--primary-color);
  border-radius: 8px;
}
```

**Purpose:** Add reference URL
**Recommendation:** **KEEP CUSTOM** - Dashed border is distinctive UX pattern
**Reason:** Dashed border indicates "add" action, should be preserved

---

### 28. image-add-button
**Files:**
- AddTastingRecord.tsx:600

**Current CSS:**
```css
.image-add-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-tertiary);
  font-size: 0.9rem;
}
```

**Purpose:** Upload images
**Recommendation:** **KEEP CUSTOM** - Grid-based layout requires special positioning
**Note:** Works with image-gallery-add container

---

### 29. create-new-wine-button
**Files:**
- SelectWine.tsx:226

**Current CSS:** (Primary styling)
**Purpose:** Create new wine in database
**Recommendation:** `.btn btn-primary btn-full`
**Migration:** Primary button

---

### 30. add-record-button
**Files:**
- Records.tsx:77

**Purpose:** Add new tasting record
**Recommendation:** `.btn btn-primary`
**Migration:** Primary button

---

### 31. privacy-toggle-button
**Files:**
- WineDetail.tsx:456

**Current CSS:**
```css
.privacy-toggle-button {
  /* Base styles */
}

.privacy-toggle-button.public {
  /* Public state */
}

.privacy-toggle-button.private {
  /* Private state */
}
```

**Purpose:** Toggle public/private status
**Recommendation:** `.btn btn-toggle` (already in unified system)
**Migration:** Use btn-toggle for state switching

---

### 32. cta-button
**Files:**
- PublicProfile.tsx:179

**Current State:** NO CSS DEFINITION
**Purpose:** Call-to-action on public profile
**Recommendation:** `.btn btn-primary btn-full`
**Migration:** Use primary button

---

---

## MIGRATION STRATEGY

### Phase 1: HIGH PRIORITY (2-3 commits)
1. **Commit: Migrate CTA buttons to unified system**
   - get-started-button → btn-primary
   - cta-button → btn-primary
   - view-all-button → btn-secondary
   - add-tasting-button → btn-primary
   - create-new-wine-button → btn-primary
   - add-first-record-button → btn-primary
   - add-detailed-record-button → btn-primary
   - add-record-button → btn-primary

2. **Commit: Migrate challenge-mode & quiz buttons**
   - challenge-mode → btn-mode
   - quiz-action-button → btn-mode
   - level-button → btn-primary with state modifiers
   - next-button → btn-primary
   - retry-button → btn-primary

3. **Commit: Migrate authentication & utility buttons**
   - google-signin-button → btn-secondary
   - google-login-button → btn-secondary
   - login-suggestion-button → btn-primary
   - logout-button → btn-danger
   - close-button → btn-icon

### Phase 2: MEDIUM PRIORITY (1-2 commits)
4. **Commit: Migrate view/analysis/navigation buttons**
   - view-all-records-button → btn-secondary
   - view-analysis-button → btn-secondary
   - public-profile-button → btn-secondary
   - cancel-button → btn-secondary
   - copy-button → btn-secondary
   - next-button-fixed → btn-primary

5. **Commit: Migrate form control buttons**
   - remove-url-button → btn-danger
   - remove-image-button → btn-icon or btn-danger
   - back-button → (keep custom for positioning)

### Phase 3: KEEP CUSTOM (No changes)
- back-button (absolute positioning)
- category-button (pill-style toggle)
- wine-type-button (dynamic color styling)
- add-url-button (dashed border pattern)
- image-add-button (grid positioning)
- privacy-toggle-button → btn-toggle

---

## SUMMARY TABLE

| Button Class | Count | Unified Target | Priority | Notes |
|---|---|---|---|---|
| challenge-mode | 5 | btn-mode | HIGH | No CSS definition, consolidate |
| back-button | 5 | CUSTOM | HIGH | Absolute positioning required |
| get-started-button | 3 | btn-primary | HIGH | Easy migration |
| close-button | 3 | btn-icon | HIGH | Modal controls |
| google-signin-button | 2 | btn-secondary | MEDIUM | Auth button |
| next-button | 2 | btn-primary | MEDIUM | Quiz progression |
| level-button | 5+ | btn-primary | MEDIUM | Quiz levels |
| next-button-fixed | 1 | btn-primary | MEDIUM | Position separately |
| retry-button | 1 | btn-primary | MEDIUM | Error handling |
| quiz-action-button | 1 | btn-mode | MEDIUM | Large card button |
| copy-button | 1 | btn-secondary | MEDIUM | Utility |
| login-suggestion-button | 1 | btn-primary | MEDIUM | CTA |
| google-login-button | 1 | btn-secondary | MEDIUM | Auth |
| logout-button | 1 | btn-danger | MEDIUM | Destructive |
| public-profile-button | 1 | btn-secondary | MEDIUM | Navigation |
| add-tasting-button | 1 | btn-primary | MEDIUM | Main action |
| add-first-record-button | 1 | btn-primary | MEDIUM | Empty state |
| view-all-button | 1 | btn-secondary | MEDIUM | Expand action |
| view-all-records-button | 1 | btn-secondary | MEDIUM | Expand action |
| view-analysis-button | 1 | btn-secondary | MEDIUM | Secondary action |
| add-detailed-record-button | 1 | btn-primary | MEDIUM | Main action |
| cancel-button | 1 | btn-secondary | MEDIUM | Negative action |
| create-new-wine-button | 1 | btn-primary | MEDIUM | Main action |
| add-record-button | 1 | btn-primary | MEDIUM | Main action |
| cta-button | 1 | btn-primary | MEDIUM | No CSS, use primary |
| remove-url-button | 1 | btn-danger | MEDIUM | Destructive |
| remove-image-button | 1 | btn-icon/btn-danger | MEDIUM | Destructive |
| privacy-toggle-button | 1 | btn-toggle | MEDIUM | State switch |
| category-button | 1 | CUSTOM | KEEP | Pill-style toggle |
| wine-type-button | 1 | CUSTOM | KEEP | Dynamic colors |
| add-url-button | 1 | CUSTOM | KEEP | Dashed border UX |
| image-add-button | 1 | CUSTOM | KEEP | Grid positioning |

---

## Implementation Guidelines

### Migration Checklist
- [ ] Remove custom CSS class from HTML
- [ ] Add `.btn` base class and appropriate modifier classes
- [ ] Test hover/active states match design system
- [ ] Update any positioning (if previously position: absolute/fixed)
- [ ] Verify button text/icon sizing
- [ ] Test on mobile viewport

### Code Example
**Before:**
```tsx
<button className="get-started-button" onClick={handleClick}>
  Start Recording
</button>
```

**After:**
```tsx
<button className="btn btn-primary btn-full" onClick={handleClick}>
  Start Recording
</button>
```

### Custom Button Preservation
For buttons marked "KEEP CUSTOM":
1. Keep existing CSS class
2. Do NOT migrate to unified system
3. Document in CLAUDE.md why custom styling is needed
4. Monitor for future standardization opportunities

