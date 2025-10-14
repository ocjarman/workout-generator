# 💪 Workout Generator - Project Overview

## 📋 Project Summary

A full-stack workout generator web application that displays a personalized weekly workout schedule. Built with modern web technologies and designed to be embedded in your portfolio.

### Key Features
- 📅 Complete 7-day workout schedule
- 💪 Detailed exercise instructions (sets, reps, rest periods)
- 🎨 Beautiful, modern dark theme UI
- 📱 Fully responsive design
- 🔄 Toggle between daily and weekly views
- ⚡ Fast performance with Vite
- 🗄️ PostgreSQL database backend

## 🏗️ Architecture

```
workout-generator/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── WorkoutCard.tsx
│   │   │   ├── WeeklyView.tsx
│   │   │   └── *.css
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── *.css
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/                # Express Backend
│   ├── src/
│   │   ├── database.ts   # PostgreSQL connection
│   │   ├── index.ts      # Express app & API routes
│   │   └── seed.ts       # Database seeding
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
├── SETUP.md
├── DEPLOYMENT.md
└── docker-compose.yml
```

## 🎯 Weekly Workout Schedule

| Day | Workout Type | Duration |
|-----|-------------|----------|
| Monday | Lower Body Strength + 20min HIIT | 60 min |
| Tuesday | Upper Body Strength + Core | 55 min |
| Wednesday | Steady State Cardio | 45 min |
| Thursday | Lower Body Strength + Glute Focus | 55 min |
| Friday | Upper Body Strength + 20min HIIT | 60 min |
| Saturday | Long Run (4-5 miles) | 40 min |
| Sunday | Rest / Active Recovery / Yoga | 30 min |

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite 5** - Build tool
- **CSS3** - Styling with CSS custom properties

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **pg** - PostgreSQL client

### Development
- **tsx** - TypeScript execution
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## 📡 API Endpoints

```
GET  /api/workouts              # Get all workouts
GET  /api/workouts/:day         # Get workout by day name
GET  /api/workouts/today/current # Get today's workout
```

## 🚀 Quick Start

1. **Setup Database**
   ```bash
   createdb workout_generator
   ```

2. **Install Dependencies**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. **Configure Environment**
   ```bash
   cd server
   echo "DATABASE_URL=postgresql://localhost:5432/workout_generator" > .env
   echo "PORT=3000" >> .env
   ```

4. **Seed Database**
   ```bash
   npm run seed
   ```

5. **Run Application**
   ```bash
   # Terminal 1
   cd server && npm run dev
   
   # Terminal 2
   cd client && npm run dev
   ```

6. **Open Browser**
   ```
   http://localhost:5173
   ```

## 🎨 Design System

### Color Palette
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#ec4899` (Pink)
- **Background**: `#0f172a` (Dark Blue)
- **Surface**: `#1e293b` (Slate)
- **Text**: `#f1f5f9` (Light Gray)
- **Success**: `#10b981` (Green)

### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Headings**: 2rem - 2.5rem
- **Body**: 0.9rem - 1.1rem

### Components
- **Cards**: Rounded corners (16-20px), subtle shadows
- **Buttons**: Gradient backgrounds, smooth transitions
- **Animations**: Fade-in, slide effects, hover states

## 📦 Deployment Options

### Recommended: Vercel + Railway
- **Frontend**: Deploy to Vercel (free tier)
- **Backend + DB**: Deploy to Railway (free tier)
- **Setup Time**: ~10 minutes

### Alternative: Render
- Full-stack deployment
- PostgreSQL included
- Easy GitHub integration

### Docker
- Use included `docker-compose.yml`
- Deploy anywhere (AWS, DigitalOcean, etc.)

## 🔗 Embedding in Portfolio

### Method 1: iframe
```html
<iframe 
  src="https://your-workout-app.vercel.app" 
  width="100%" 
  height="800px"
  frameborder="0">
</iframe>
```

### Method 2: Link
```html
<a href="https://your-workout-app.vercel.app" target="_blank">
  View Live Demo →
</a>
```

## 📝 Customization Guide

### Add New Workouts
1. Edit `server/src/seed.ts`
2. Add workout object to `workouts` array
3. Run `npm run seed` to update database

### Modify Styling
- Global styles: `client/src/index.css`
- Component styles: `client/src/components/*.css`
- Theme variables: CSS custom properties in `index.css`

### Add New Features
- New API endpoint: `server/src/index.ts`
- New component: `client/src/components/`
- New page: Update `App.tsx`

## 🧪 Testing the App

1. Check all 7 days load correctly
2. Verify exercise details display properly
3. Test weekly view
4. Check responsive design (mobile/tablet)
5. Verify API endpoints work
6. Test database connection

## 🐛 Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Kill process on port 5173
lsof -ti:5173 | xargs kill
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
brew services list

# Start PostgreSQL
brew services start postgresql@14
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📈 Future Enhancements

- [ ] User authentication
- [ ] Custom workout creation
- [ ] Progress tracking
- [ ] Exercise video demonstrations
- [ ] Social sharing features
- [ ] Mobile app (React Native)
- [ ] Workout history/calendar
- [ ] REST timer
- [ ] Exercise substitutions

## 📄 License

MIT License - Feel free to use this in your portfolio!

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

Built with 💪 for fitness enthusiasts everywhere!

