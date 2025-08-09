# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyWineMemory is a PWA (Progressive Web App) for wine enthusiasts to record tasting notes, learn about wine through quizzes, and track their wine journey. The project is inspired by Duolingo's gamification approach and targets users who are beginning their wine journey.

**Live URL**: my-wine-memory.himazi.com

## Technology Stack

- **Frontend**: React 18 with TypeScript and Vite
- **Backend**: Firebase
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication (Google OAuth)
- **Storage**: Firebase Storage (for images)
- **Hosting**: Firebase Hosting
- **External APIs**: OpenRouter/Groq for LLM-based quiz evaluation
- **CI/CD**: GitHub Actions for automatic Firebase deployment

## Architecture Overview

The application follows a modular architecture with these core domains:

### 1. User Management
- Google OAuth authentication only
- Profile management with badges and statistics
- Guest mode with local storage for temporary data
- No password reset (delegated to Google)

### 2. Wine Recording System (New Three-Step Workflow)

**New Workflow**: ①ワイン選択/追加 → ②記録保存 → ③日付ごとの記録確認

#### Database Structure (Separated Architecture):
- **WineMaster**: Shared wine data to prevent duplicates
  - wineName, producer, country, region, vintage
  - grapeVarieties, wineType, alcoholContent, winemaker
  - referenceCount (tracks how many users recorded this wine)
  
- **TastingRecord**: Individual user experiences
  - Links to WineMaster via wineId
  - overallRating (0.0-10.0 scale), tastingDate, recordMode
  - notes, price, purchaseLocation, images
  - User-specific data and personal evaluation

#### Recording Modes:
- **Quick Mode**: Essential fields only (rating, notes, date)
- **Detailed Mode**: Comprehensive wine analysis including:
  - Visual analysis (color, clarity, viscosity)
  - Aroma analysis (staged: first impression, after swirling, categorized)
  - Taste analysis (attack, development, finish)
  - Component analysis (acidity, tannins, sweetness, body)
  - Environmental factors and food pairings
  - Multiple images and reference URLs

### 3. Gamification System (Duolingo-inspired)
- **Badges**: 12-tier progression system for recording, streaks, quiz performance
- **XP/Levels**: Points for various activities (recording: 10-20XP, quizzes: 5XP)
- **Streaks**: Daily activity tracking with freeze functionality
- **Daily Goals**: Customizable wine recording and quiz targets

### 4. Quiz System
- 1000 questions across 10 difficulty levels (sourced from sommelier exams)
- Spaced repetition for incorrect answers
- Personalized quizzes based on user's wine records (LLM-evaluated)
- Heart system (5 lives, time-based recovery)

### 5. Data Management
- **Draft System**: Auto-save every 30 seconds, max 5 drafts
- **Soft Delete**: 3-day trash retention with auto-cleanup
- **Privacy**: Global public/private toggle for all records
- **Guest Mode**: Local storage for temporary data before login

## Development Guidelines

### Project Status
The application has been fully implemented with the new three-step workflow and responsive design.

### Development Phases
1. **MVP**: Basic wine recording, authentication, record listing
2. **Gamification**: Badge system, XP, streaks
3. **Learning**: Quiz functionality, spaced repetition
4. **Advanced**: Statistics, PWA features, drafts

### Design Principles
- **Mobile-first**: Primary usage on smartphones during wine tastings
- **PWA-ready**: Offline capability for drafts, push notifications
- **Dual themes**: Light mode (vineyard-inspired) and dark mode (bar ambiance)
- **Responsive**: Support for PC, tablet, and mobile

### Key Constraints
- Budget: <1000 JPY/month operational costs
- Security: HTTPS required, user data isolation
- Performance: 3-second initial load target
- Browser support: Chrome (primary), Safari (supported), Edge (unsupported)

## File Structure (Implemented)

Current structure based on React + Firebase:
```
my-wine-memory/src/
├── components/          # Reusable UI components
│   ├── BottomNavigation.tsx
│   ├── WineCard.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── pages/              # Route components
│   ├── Home.tsx        # Dashboard with quick actions
│   ├── SelectWine.tsx  # Step 1: Wine selection/creation
│   ├── AddTastingRecord.tsx  # Step 2: Tasting record input
│   ├── Records.tsx     # Step 3: Date-based record viewing
│   ├── WineDetail.tsx  # Individual wine with chronological records
│   ├── Quiz.tsx
│   ├── QuizGame.tsx
│   ├── Stats.tsx
│   ├── Profile.tsx
│   └── AddWine.tsx     # Legacy page (to be removed)
├── hooks/              # Custom React hooks
│   └── useAsyncOperation.ts
├── services/           # Firebase services, API calls
│   ├── wineMasterService.ts     # WineMaster CRUD operations
│   ├── tastingRecordService.ts  # TastingRecord CRUD operations
│   ├── wineService.ts          # Legacy service
│   ├── userService.ts
│   └── guestDataService.ts
├── contexts/           # React contexts for global state
│   └── AuthContext.tsx
├── types/              # TypeScript type definitions
│   └── index.ts        # WineMaster, TastingRecord interfaces
├── App.tsx             # Main routing component
├── App.css             # Global styles with full-width responsive design
└── main.tsx            # Application entry point
```

## Important Notes

- **Language**: Primary development language is English, but UI supports Japanese
- **Authentication**: Only Google OAuth - no email/password option
- **Data Privacy**: All user data is private by default with opt-in sharing
- **Image Handling**: Multiple image uploads per wine record, WebP optimization required
- **Offline Support**: Limited to draft data storage only
- **Responsive Design**: Full-width (100vw) layout for all screen sizes
- **Workflow**: Three-step process for wine recording

## Application Workflow (Implemented)

### Three-Step Wine Recording Process:

1. **Step 1: Wine Selection (`/select-wine`)**
   - Search existing wines in the WineMaster database
   - Display popular wines and recent additions
   - Create new wine if not found (adds to WineMaster collection)
   - Navigate to `/add-tasting-record/{wineId}`

2. **Step 2: Tasting Record Input (`/add-tasting-record/:wineId`)**
   - Display selected wine information from WineMaster
   - Collect user's personal tasting experience data
   - Support both Quick and Detailed recording modes
   - Save to TastingRecord collection linked to WineMaster
   - Navigate back to Records or Wine Detail page

3. **Step 3: Record Viewing (`/records` and `/wine-detail/:wineId`)**
   - **Records Page**: Groups TastingRecords by WineMaster with statistics
   - **Wine Detail Page**: Shows individual wine with chronological tasting history
   - Edit existing records via `/edit-tasting-record/:recordId`
   - Delete records with confirmation

### Navigation Structure:

```
/ (Home)
├── /select-wine                     # Step 1: Wine selection
├── /add-tasting-record/:wineId      # Step 2: New tasting record
├── /edit-tasting-record/:recordId   # Edit existing record
├── /records                         # Step 3: Record overview
├── /wine-detail/:wineId            # Individual wine details
├── /quiz                           # Quiz system
├── /quiz/play/:difficulty          # Quiz game
├── /stats                          # User statistics
├── /profile                        # User profile
└── /add-wine                       # Legacy page (to be removed)
```

### Database Collections:

1. **wineMasters** - Shared wine data
   ```typescript
   {
     id: string,
     wineName: string,
     producer: string,
     country: string,
     region: string,
     vintage?: number,
     grapeVarieties?: string[],
     wineType?: 'red' | 'white' | 'rose' | 'sparkling' | 'dessert' | 'fortified',
     referenceCount: number,
     createdAt: Date,
     createdBy: string
   }
   ```

2. **tastingRecords** - Individual user experiences
   ```typescript
   {
     id: string,
     userId: string,
     wineId: string,
     overallRating: number,  // 0.0-10.0 scale
     tastingDate: Date,
     recordMode: 'quick' | 'detailed',
     notes?: string,
     price?: number,
     purchaseLocation?: string,
     images?: string[]
   }
   ```

## Future Considerations

- Planned premium features (LLM advice, advanced analytics)
- Potential wine shop partnerships
- AI image recognition for wine labels
- Community features expansion