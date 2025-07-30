## Project Overview
LittleMeals is a family meal tracking app that lets parents log what their children eat/refuse faster than writing in Apple Notes. One meal entry captures all children's responses with real-time family sync and AI-powered insights.

## Core User Flow Example
```
Breakfast: Ragi oat banana pancakes
Date: Today
Sam: [Tap] Eaten ✅
Sebbie: [Tap] Partially Eaten 🟡  
Dee-Dee-Dee: [Tap] Refused ❌
Notes: "Dee refused because he could see the banana in the pancake"
[Save] → Syncs to all family devices
```

## Tech Stack (Zero Cost → Revenue Scaling)
- **Frontend:** React Native + Expo + TypeScript + NativeWind
- **Backend:** Supabase (PostgreSQL + Real-time + Auth + Storage)
- **AI:** OpenAI API ($5 free credit) + Expo Speech
- **Development:** Expo EAS Build + GitHub + Vercel (all free tiers)

## Database Schema (Supabase PostgreSQL)
```sql
-- Core tables with Row Level Security
profiles (id, email, name, family_id)
families (id, name, created_by, invite_code)
children (id, name, birthdate, family_id, created_at)
meals (id, meal_name, date, meal_type, family_id, created_by, timestamp)
meal_responses (id, meal_id, child_id, response, notes, timestamp)
foods (id, name, category, family_id, frequency_count, last_used)
```

## Core Features Priority
1. **Family meal logging** - One meal, multiple child responses
2. **Voice logging** - "Breakfast pancakes - Sam ate, Dee refused"
3. **Smart Search/AI** - "When did Emma last eat bananas?" + AI insights
4. **Real-time family sync** - All caregivers see updates instantly
5. **Personal food database** - Autocomplete from family's logged foods
6. **Pattern insights** - Visual trends and pediatrician reports

## Key Design Principles
- **Faster than Apple Notes** - Sub-1-second logging target
- **Family-first** - Multiple children, multiple caregivers
- **Offline-first** - Must work during meals without internet
- **Clean & simple** - No feature bloat, zombie-parent friendly

## Navigation Structure
```
Tab Navigator:
├── Log (main meal logging screen)
├── Insights (dashboard + analytics)
├── Search (Smart Search/AI chat)
└── Settings (family + children management)
```

## Folder Structure
```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components for each tab
├── services/           # Supabase, OpenAI, Speech APIs
├── types/              # TypeScript interfaces
├── utils/              # Helper functions
├── hooks/              # Custom React hooks
└── constants/          # Colors, fonts, config
```

## Testing Strategy
- **Unit Tests:** Jest + React Native Testing Library for components/functions
- **Integration Tests:** Test Supabase operations and API integrations
- **E2E Tests:** Detox for critical user flows (meal logging, family sync)
- **Manual Testing Checklist:** Step-by-step verification for each feature

## Testing Setup
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native detox
```

## Test Structure
```
__tests__/
├── components/         # Component unit tests
├── services/          # API/Supabase integration tests
├── screens/           # Screen integration tests
├── e2e/              # End-to-end test scenarios
└── utils/            # Utility function tests
```
