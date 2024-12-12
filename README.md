# Easy Schedule

A mobile-first, user-friendly scheduling application that makes it easy to coordinate availability among groups of people.

## Features

- Create schedules with customizable time slots and date ranges
- Share schedules using simple 4-digit PIN codes
- Real-time updates as participants mark their availability
- Mobile-optimized interface with intuitive touch interactions
- Visual heat map showing popular time slots

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up Firebase:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Copy your Firebase configuration to `src/firebase.js`

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Create a Schedule:
   - Click "Create Schedule" on the home page
   - Set your schedule parameters (dates, times, slot duration)
   - Share the generated PIN with participants

2. Join a Schedule:
   - Enter the PIN code on the home page
   - Input your name
   - Select your available time slots

The schedule updates in real-time as participants mark their availability!
