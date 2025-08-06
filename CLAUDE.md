# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyWineMemory is a PWA (Progressive Web App) for wine enthusiasts to record tasting notes, learn about wine through quizzes, and track their wine journey. The project is inspired by Duolingo's gamification approach and targets users who are beginning their wine journey.

**Live URL**: my-wine-memory.himazi.com

## Technology Stack (Planned)

- **Frontend**: React with PWA capabilities
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
- No password reset (delegated to Google)

### 2. Wine Recording System
- **Quick Mode**: Essential fields only (name, producer, country, region, rating)
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

## Development Guidelines

### Project Status
This repository currently contains only specification documents. No code has been implemented yet.

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

## File Structure (To Be Implemented)

Expected structure based on React + Firebase:
```
src/
├── components/          # Reusable UI components
├── pages/              # Route components (Home, Records, Quiz, Stats, Profile)
├── hooks/              # Custom React hooks
├── services/           # Firebase services, API calls
├── utils/              # Helper functions
├── contexts/           # React contexts for global state
├── assets/             # Images, icons, static files
└── types/              # TypeScript type definitions
```

## Important Notes

- **Language**: Primary development language is English, but UI supports Japanese
- **Authentication**: Only Google OAuth - no email/password option
- **Data Privacy**: All user data is private by default with opt-in sharing
- **Image Handling**: Multiple image uploads per wine record, WebP optimization required
- **Offline Support**: Limited to draft data storage only

## Future Considerations

- Planned premium features (LLM advice, advanced analytics)
- Potential wine shop partnerships
- AI image recognition for wine labels
- Community features expansion