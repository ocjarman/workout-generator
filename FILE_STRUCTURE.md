# 📂 Complete File Structure

```
workout-generator/
│
├── 📱 CLIENT (React Frontend)
│   ├── src/
│   │   ├── components/
│   │   │   ├── WorkoutCard.tsx       # Individual workout display
│   │   │   ├── WorkoutCard.css       # Workout card styles
│   │   │   ├── WeeklyView.tsx        # Week overview component
│   │   │   └── WeeklyView.css        # Weekly view styles
│   │   │
│   │   ├── App.tsx                   # Main application component
│   │   ├── App.css                   # App-level styles
│   │   ├── main.tsx                  # React entry point
│   │   └── index.css                 # Global styles & theme
│   │
│   ├── index.html                    # HTML template
│   ├── vite.config.ts                # Vite configuration
│   ├── tsconfig.json                 # TypeScript config
│   ├── package.json                  # Dependencies
│   └── Dockerfile                    # Docker container config
│
├── 🖥️  SERVER (Express Backend)
│   ├── src/
│   │   ├── database.ts               # PostgreSQL connection & tables
│   │   ├── index.ts                  # Express app & API routes
│   │   └── seed.ts                   # Database seeding script
│   │
│   ├── tsconfig.json                 # TypeScript config
│   ├── package.json                  # Dependencies
│   └── Dockerfile                    # Docker container config
│
├── 📖 DOCUMENTATION
│   ├── README.md                     # Main project README
│   ├── GET_STARTED.md                # Quick start guide (5 min)
│   ├── SETUP.md                      # Detailed setup instructions
│   ├── DEPLOYMENT.md                 # Deployment guides
│   ├── PROJECT_OVERVIEW.md           # Technical architecture
│   └── FILE_STRUCTURE.md             # This file
│
├── 🚀 DEPLOYMENT
│   ├── docker-compose.yml            # Docker Compose setup
│   ├── vercel.json                   # Vercel config
│   └── start.sh                      # Quick start script
│
└── 📦 ROOT
    ├── .gitignore                    # Git ignore rules
    └── package.json                  # Root package scripts
```

## 🔍 File Descriptions

### Frontend Files

**Components**
- `WorkoutCard.tsx` - Displays detailed workout information for a single day
- `WeeklyView.tsx` - Shows overview of all 7 days in a grid layout

**Main Files**
- `App.tsx` - Main app with routing, state management, and view toggle
- `main.tsx` - React app initialization and rendering
- `index.html` - HTML entry point with root div

**Styles**
- `index.css` - Global styles, CSS variables, color theme
- `App.css` - Header, navigation, day selector styles
- Component `.css` files - Component-specific styles

**Config**
- `vite.config.ts` - Vite build config with proxy for API
- `tsconfig.json` - TypeScript compiler options
- `package.json` - React, TypeScript, Vite dependencies

### Backend Files

**Source**
- `database.ts` - PostgreSQL pool, connection, table creation
- `index.ts` - Express server, CORS, API endpoints
- `seed.ts` - Workout data and seeding logic

**Config**
- `tsconfig.json` - TypeScript config for Node.js
- `package.json` - Express, pg, dotenv dependencies
- `.env` - Database URL and port (create manually)

### Documentation

- `README.md` - Project overview, features, quick start
- `GET_STARTED.md` - Fastest way to get running (5 min)
- `SETUP.md` - Step-by-step setup with troubleshooting
- `DEPLOYMENT.md` - Deploy to Vercel, Railway, Render, Docker
- `PROJECT_OVERVIEW.md` - Architecture, tech stack, design

### Deployment

- `docker-compose.yml` - Run entire stack with Docker
- `vercel.json` - Vercel frontend deployment config
- `start.sh` - Automated startup script

## 📊 Lines of Code

| Component | Files | Purpose |
|-----------|-------|---------|
| Frontend | 8 | React UI components and styling |
| Backend | 3 | API server and database |
| Docs | 5 | Comprehensive guides |
| Config | 10 | TypeScript, build, deploy configs |
| **Total** | **26** | Complete full-stack app |

## 🎯 Key Files to Customize

### To Change Workouts
```
server/src/seed.ts
```

### To Change Styling
```
client/src/index.css         (theme colors)
client/src/App.css           (layout)
client/src/components/*.css  (components)
```

### To Add Features
```
client/src/components/       (new UI components)
server/src/index.ts          (new API endpoints)
client/src/App.tsx           (new pages/views)
```

### To Configure Deployment
```
vercel.json                  (Vercel settings)
docker-compose.yml           (Docker setup)
server/.env                  (environment variables)
```

## 🔗 Import Relationships

```
main.tsx
  └── App.tsx
        ├── WorkoutCard.tsx
        └── WeeklyView.tsx

index.ts (server)
  └── database.ts

seed.ts
  └── database.ts
```

## 🌐 API Flow

```
Client (localhost:5173)
  └── Vite Proxy (/api)
        └── Express Server (localhost:3000)
              └── PostgreSQL (localhost:5432)
```

## 📦 Dependencies Summary

### Client
- `react` & `react-dom` - UI library
- `typescript` - Type safety
- `vite` - Build tool
- `@vitejs/plugin-react` - React support

### Server
- `express` - Web framework
- `pg` - PostgreSQL client
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `tsx` - TypeScript execution
- `typescript` - Type safety

---

💡 **Tip**: Start with `GET_STARTED.md` for the quickest setup!

