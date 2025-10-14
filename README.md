# 💪 Weekly Workout Generator

A full-stack workout generator application built with React, TypeScript, Express, and PostgreSQL. Displays a personalized weekly workout schedule with detailed exercise information.

## Features

- 📅 Weekly workout schedule (Monday - Sunday)
- 🏋️ Detailed exercise breakdowns with sets, reps, and rest times
- 💪 Mix of strength training, HIIT, cardio, and recovery days
- 🎨 Modern, responsive UI with smooth animations
- 📱 Mobile-friendly design
- 🔄 Toggle between daily and weekly views

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- CSS3 with custom properties

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL

## Weekly Schedule

- **Monday**: Lower Body Strength + 20min HIIT
- **Tuesday**: Upper Body Strength + Core
- **Wednesday**: Steady State Cardio (Walking/Peloton)
- **Thursday**: Lower Body Strength + Glute Focus
- **Friday**: Upper Body Strength + 20min HIIT
- **Saturday**: Long Run (4-5 miles)
- **Sunday**: Rest Day / Yoga

## Setup Instructions

### Prerequisites

- Node.js (v20.11.0 or higher recommended)
- PostgreSQL (v14 or higher)
- npm or yarn

### Database Setup

1. Install PostgreSQL if you haven't already
2. Create a new database:
   ```bash
   createdb workout_generator
   ```

3. Create a `.env` file in the `server` directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/workout_generator
   PORT=3000
   ```

### Installation

1. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

2. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

3. Seed the database:
   ```bash
   cd ../server
   npm run seed
   ```

### Running the Application

1. Start the server (from `server` directory):
   ```bash
   npm run dev
   ```

2. Start the client (from `client` directory, in a new terminal):
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## Building for Production

### Client
```bash
cd client
npm run build
```

### Server
```bash
cd server
npm run build
npm start
```

## Embedding in Portfolio

To embed this app in your portfolio:

1. Build the production version
2. Deploy to a hosting service (Vercel, Netlify, Railway, etc.)
3. Use an iframe in your portfolio:
   ```html
   <iframe src="https://your-deployed-url.com" width="100%" height="800px"></iframe>
   ```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend + Database)
- Deploy client to Vercel
- Deploy server and PostgreSQL to Railway
- Update API endpoints in client to point to Railway backend

### Option 2: Render (Full Stack)
- Deploy both frontend and backend to Render
- Use Render's PostgreSQL database

### Option 3: Docker
- Use the provided docker-compose.yml (if added)
- Deploy to any Docker-compatible hosting

## API Endpoints

- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:day` - Get workout by day name
- `GET /api/workouts/today/current` - Get today's workout

## Customization

To customize the workouts, edit `server/src/seed.ts` and re-run:
```bash
npm run seed
```

## License

MIT

## Author

Built with 💪 for fitness enthusiasts
