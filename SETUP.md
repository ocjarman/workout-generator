# Quick Setup Guide

## Prerequisites
- Node.js v20.11.0 or higher
- PostgreSQL 14 or higher

## Step-by-Step Setup

### 1. Database Setup

First, make sure PostgreSQL is installed and running:

```bash
# Check if PostgreSQL is running
pg_isready

# If not installed, install via Homebrew (macOS)
brew install postgresql@14
brew services start postgresql@14
```

Create the database:

```bash
createdb workout_generator
```

### 2. Configure Environment Variables

The server needs a `.env` file. Create one:

```bash
cd server
cat > .env << EOL
DATABASE_URL=postgresql://localhost:5432/workout_generator
PORT=3000
EOL
```

**Note:** Adjust the DATABASE_URL if you have a username/password:
```
DATABASE_URL=postgresql://username:password@localhost:5432/workout_generator
```

### 3. Install Dependencies

Both client and server dependencies are already installed! But if you need to reinstall:

```bash
# From root directory
cd client && npm install
cd ../server && npm install
```

### 4. Seed the Database

Populate the database with workout data:

```bash
cd server
npm run seed
```

You should see: "Database seeded successfully!"

### 5. Run the Application

**Terminal 1 - Start the server:**
```bash
cd server
npm run dev
```

Server will run on http://localhost:3000

**Terminal 2 - Start the client:**
```bash
cd client
npm run dev
```

Client will run on http://localhost:5173

### 6. Open Your Browser

Navigate to: http://localhost:5173

You should see your workout generator! 🎉

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running: `brew services start postgresql@14`
- Check your DATABASE_URL in server/.env
- Verify database exists: `psql -l | grep workout_generator`

### Port Already in Use
- Client (5173): Change in `client/vite.config.ts`
- Server (3000): Change in `server/.env`

### Module Not Found Errors
- Run `npm install` in both client and server directories
- Delete node_modules and package-lock.json, then reinstall

### TypeScript Errors
- Ensure you're using Node.js v20.11.0 or higher
- Run `npm run build` to check for compilation errors

## Next Steps

1. ✅ Customize workouts in `server/src/seed.ts`
2. ✅ Deploy to hosting platform (see DEPLOYMENT.md)
3. ✅ Embed in your portfolio

## Quick Commands Reference

```bash
# Install all dependencies
npm run install:all

# Start development
npm run dev:server  # Terminal 1
npm run dev:client  # Terminal 2

# Build for production
npm run build:server
npm run build:client

# Reseed database
npm run seed
```

Enjoy your workout generator! 💪

