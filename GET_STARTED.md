# 🚀 Get Started in 5 Minutes!

Welcome to your Workout Generator! This guide will get you up and running quickly.

## 📁 Project Structure

```
workout-generator/
├── 📱 client/              # React Frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   └── package.json
│
├── 🖥️  server/             # Express Backend (Node + TypeScript)
│   ├── src/
│   │   ├── database.ts    # PostgreSQL setup
│   │   ├── index.ts       # API routes
│   │   └── seed.ts        # Workout data
│   └── package.json
│
├── 📖 Documentation
│   ├── README.md          # Overview
│   ├── SETUP.md           # Detailed setup
│   ├── DEPLOYMENT.md      # Deploy guide
│   └── PROJECT_OVERVIEW.md # Technical details
│
└── 🐳 Deployment Files
    ├── docker-compose.yml
    ├── vercel.json
    └── start.sh           # Quick start script
```

## ⚡ Quick Start (Easiest Way)

### Option 1: Using the Start Script

```bash
cd /Users/oliviafsa/workout-generator
./start.sh
```

This script will:
- ✅ Check and start PostgreSQL
- ✅ Create the database if needed
- ✅ Seed the database with workouts
- ✅ Start both client and server

### Option 2: Manual Setup

**Step 1: Database Setup**
```bash
# Create database
createdb workout_generator

# Configure server
cd server
echo "DATABASE_URL=postgresql://localhost:5432/workout_generator
PORT=3000" > .env
```

**Step 2: Seed Database**
```bash
cd server
npm run seed
```

**Step 3: Start Servers**

Terminal 1 (Server):
```bash
cd server
npm run dev
```

Terminal 2 (Client):
```bash
cd client
npm run dev
```

**Step 4: Open App**
```
http://localhost:5173
```

## 🎯 What's Included?

### Weekly Workouts
- **Monday**: Lower Body + HIIT
- **Tuesday**: Upper Body + Core
- **Wednesday**: Cardio Recovery
- **Thursday**: Glutes Focus
- **Friday**: Upper Body + HIIT
- **Saturday**: Long Run
- **Sunday**: Rest/Yoga

### Features
- 📅 Full weekly schedule
- 💪 Detailed exercise plans
- ⏱️ Sets, reps, rest times
- 🎨 Beautiful dark mode UI
- 📱 Mobile responsive
- 🔄 Daily/weekly views

## 🛠️ Customization

### Change Workouts
1. Edit `server/src/seed.ts`
2. Update the `workouts` array
3. Run `npm run seed` to update

### Change Styling
- Colors: `client/src/index.css` (CSS variables)
- Components: `client/src/components/*.css`
- Layout: `client/src/App.css`

### Add API Endpoints
Edit `server/src/index.ts`

## 🚀 Deploy to Production

### Quick Deploy: Vercel + Railway

**1. Deploy Backend (Railway)**
- Go to railway.app
- Create PostgreSQL database
- Deploy server folder
- Run seed command
- Copy backend URL

**2. Deploy Frontend (Vercel)**
- Go to vercel.com
- Import repository
- Set root to `client/`
- Update API URL in code
- Deploy

**3. Embed in Portfolio**
```html
<iframe src="your-vercel-url.app" width="100%" height="800px"></iframe>
```

See `DEPLOYMENT.md` for detailed instructions.

## 📦 Available Commands

### Root Directory
```bash
npm run install:all    # Install all dependencies
npm run dev:client     # Start client
npm run dev:server     # Start server
npm run build:client   # Build client
npm run build:server   # Build server
npm run seed           # Seed database
```

### Client Directory
```bash
npm run dev            # Start dev server
npm run build          # Build for production
npm run preview        # Preview production build
```

### Server Directory
```bash
npm run dev            # Start dev server (watch mode)
npm run build          # Compile TypeScript
npm start              # Run production server
npm run seed           # Populate database
```

## 🐳 Using Docker

```bash
# Start everything with Docker
docker-compose up

# Access app at http://localhost:5173
```

## ❓ Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL status
brew services list

# Start PostgreSQL
brew services start postgresql@14

# Verify database exists
psql -l | grep workout_generator
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Module Errors
```bash
# Reinstall dependencies
cd client && rm -rf node_modules package-lock.json && npm install
cd ../server && rm -rf node_modules package-lock.json && npm install
```

## 🎨 Embedding in Your Portfolio

### iframe (Recommended)
```html
<div class="project-showcase">
  <h3>Workout Generator</h3>
  <iframe 
    src="https://your-app.vercel.app"
    width="100%"
    height="800px"
    frameborder="0"
    style="border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
  </iframe>
</div>
```

### Link with Preview
```html
<a href="https://your-app.vercel.app" target="_blank" class="project-link">
  <img src="screenshot.png" alt="Workout Generator">
  <h3>View Live Demo →</h3>
</a>
```

## 📚 Next Steps

1. ✅ Customize workouts in `seed.ts`
2. ✅ Update colors/theme to match your brand
3. ✅ Deploy to Vercel + Railway
4. ✅ Embed in your portfolio
5. ✅ Share with friends!

## 🆘 Need Help?

Check these files:
- `README.md` - Project overview
- `SETUP.md` - Detailed setup guide
- `DEPLOYMENT.md` - Deployment options
- `PROJECT_OVERVIEW.md` - Technical details

## 🎉 You're All Set!

Your workout generator is ready to use! Open http://localhost:5173 and start exploring your personalized fitness schedule.

Happy coding! 💪

