#!/bin/bash

# Workout Generator Startup Script
# This script helps you start the application easily

echo "🏋️  Starting Workout Generator..."
echo ""

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running!"
    echo "Starting PostgreSQL..."
    brew services start postgresql@14
    sleep 2
fi

# Check if database exists
if ! psql -lqt | cut -d \| -f 1 | grep -qw workout_generator; then
    echo "📦 Creating database..."
    createdb workout_generator
fi

# Check if server .env exists
if [ ! -f server/.env ]; then
    echo "⚙️  Creating server .env file..."
    cat > server/.env << EOL
DATABASE_URL=postgresql://localhost:5432/workout_generator
PORT=3000
EOL
fi

# Check if database is seeded
echo "🌱 Checking database..."
cd server
WORKOUT_COUNT=$(psql -d workout_generator -t -c "SELECT COUNT(*) FROM workouts" 2>/dev/null || echo "0")

if [ "$WORKOUT_COUNT" -lt "7" ]; then
    echo "Seeding database..."
    npm run seed
fi

# Start the servers
echo ""
echo "✅ Everything is ready!"
echo ""
echo "Starting servers..."
echo "📊 Server will run on http://localhost:3000"
echo "🎨 Client will run on http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Run both servers concurrently
trap 'kill 0' EXIT

# Start server in background
cd /Users/oliviafsa/workout-generator/server
npm run dev &

# Wait a moment for server to start
sleep 2

# Start client
cd /Users/oliviafsa/workout-generator/client
npm run dev

wait

