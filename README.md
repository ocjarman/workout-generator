# 💪 Weekly Workout Generator

A full-stack workout generator application built with React, TypeScript, Express, and PostgreSQL. Displays a personalized weekly workout schedule with detailed exercise information.

## Features

- 📅 Weekly workout schedule (Monday - Sunday)
- 🏋️ Detailed exercise breakdowns with sets, reps, and rest times
- 💪 Mix of strength training, HIIT, cardio, and recovery days
- 🎨 Modern, responsive UI with smooth animations
- 📱 Mobile-friendly design
- 🔄 Toggle between daily and weekly views
- 🚀 Auto-seeding database on deployment (no manual setup needed)

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- CSS3 with custom properties
- Deployed on Vercel

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- Deployed on Render

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

**Note:** The database will automatically seed with workout data when the server starts for the first time. No manual seeding required!

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

## Deployment

This app is currently deployed at:
- **Frontend (Vercel)**: [Your Vercel URL]
- **Backend (Render)**: [Your Render URL]

### Deployment Architecture

**Frontend (Vercel)**
- Deployed from the `client` directory
- Automatically rebuilds on push to main branch
- CORS configured to accept requests from Vercel preview URLs

**Backend (Render)**
- Deployed from the `server` directory  
- PostgreSQL database included
- Auto-seeds database on first startup
- No manual database setup required!

### Deploying Your Own Instance

#### Option 1: Vercel (Frontend) + Render (Backend) - Recommended

**Backend on Render:**
1. Go to [Render](https://render.com)
2. Create a new PostgreSQL database
3. Create a Web Service:
   - Connect your GitHub repository
   - Root directory: `server`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Add environment variable: `DATABASE_URL` (auto-populated from PostgreSQL)
4. Database will auto-seed on first deployment ✨

**Frontend on Vercel:**
1. Go to [Vercel](https://vercel.com)
2. Import your repository
3. Configure:
   - Root directory: `client`
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variable: `VITE_API_URL=your-render-backend-url`
5. Deploy!

#### Option 2: Railway (Backend) + Vercel (Frontend)
- Deploy PostgreSQL and server to Railway
- Deploy client to Vercel
- Update API endpoints accordingly

#### Option 3: Docker (Local/Self-hosted)
- Use the provided `docker-compose.yml`
- Deploy to any Docker-compatible hosting

## API Endpoints

- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:day` - Get workout by day name
- `GET /api/workouts/today/current` - Get today's workout

## Customization

To customize the workouts:
1. Edit the workout data in `server/src/index.ts` (lines 38-173)
2. Clear your database: `DELETE FROM workouts;`
3. Restart the server - it will auto-seed with your new workout data

Alternatively, you can still use the seed script:
```bash
npm run seed
```

## Recent Updates

### Auto-Seeding Feature
- Database automatically seeds with workout data on first server startup
- No manual database setup required for deployment
- Checks if database is empty before seeding to prevent duplicates

### Deployment Improvements
- CORS configured to support Vercel preview and production URLs
- Simplified deployment process with auto-initialization
- Works seamlessly with Render's PostgreSQL database

### Enhanced CORS Support
- Localhost for development
- Vercel preview URLs
- Any Vercel deployment via regex pattern
- Easy to extend for additional domains

## License

MIT

## Author

Built with 💪 for fitness enthusiasts
