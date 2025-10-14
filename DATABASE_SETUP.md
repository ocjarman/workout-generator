# 🗄️ Database Setup Guide

Complete guide for setting up PostgreSQL for the Workout Generator.

## 📋 Prerequisites

- PostgreSQL 14 or higher installed
- Terminal/command line access

## 🚀 Quick Setup (macOS)

### Step 1: Install PostgreSQL (if not installed)

```bash
# Install via Homebrew
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Verify installation
psql --version
```

### Step 2: Create Database

```bash
createdb workout_generator
```

### Step 3: Verify Database Creation

```bash
# List all databases
psql -l

# You should see 'workout_generator' in the list
```

### Step 4: Configure Server

Create `.env` file in `server/` directory:

```bash
cd server
cat > .env << 'EOF'
DATABASE_URL=postgresql://localhost:5432/workout_generator
PORT=3000
EOF
```

### Step 5: Seed Database

```bash
npm run seed
```

**Expected output:**
```
Tables created successfully
Database seeded successfully!
```

## 🔍 Database Schema

### Workouts Table

```sql
CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  day_of_week VARCHAR(20) NOT NULL,
  day_number INTEGER NOT NULL,
  workout_type VARCHAR(100) NOT NULL,
  exercises JSONB NOT NULL,
  duration INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sample Data

The database contains 7 workout records (one for each day):

| id | day_of_week | workout_type | duration |
|----|-------------|-------------|----------|
| 1 | Monday | Lower Body Strength + HIIT | 60 |
| 2 | Tuesday | Upper Body Strength + Core | 55 |
| 3 | Wednesday | Steady State Cardio | 45 |
| 4 | Thursday | Lower Body Strength + Glute Focus | 55 |
| 5 | Friday | Upper Body Strength + HIIT | 60 |
| 6 | Saturday | Long Run | 40 |
| 7 | Sunday | Rest Day / Active Recovery | 30 |

## 🔧 Advanced Configuration

### Custom Database Connection

If you have a username and password:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/workout_generator
```

### Remote Database

For hosted PostgreSQL (Railway, Render, etc.):

```env
DATABASE_URL=postgresql://user:pass@host.com:5432/dbname?sslmode=require
```

### Multiple Environments

```bash
# Development
DATABASE_URL=postgresql://localhost:5432/workout_generator_dev

# Production
DATABASE_URL=postgresql://user:pass@production-host.com:5432/workout_generator
```

## 🛠️ Useful Commands

### Connect to Database

```bash
psql workout_generator
```

### View All Workouts

```sql
SELECT id, day_of_week, workout_type, duration FROM workouts;
```

### View Specific Day

```sql
SELECT * FROM workouts WHERE day_of_week = 'Monday';
```

### Count Workouts

```sql
SELECT COUNT(*) FROM workouts;
```

### Reset Database

```bash
# Drop and recreate
dropdb workout_generator
createdb workout_generator

# Reseed
cd server
npm run seed
```

### Backup Database

```bash
pg_dump workout_generator > backup.sql
```

### Restore Database

```bash
psql workout_generator < backup.sql
```

## 🐛 Troubleshooting

### Error: "database does not exist"

```bash
createdb workout_generator
```

### Error: "could not connect to server"

```bash
# Check if PostgreSQL is running
brew services list

# Start PostgreSQL
brew services start postgresql@14

# Or restart
brew services restart postgresql@14
```

### Error: "role does not exist"

```bash
# Create PostgreSQL user
createuser -s postgres
```

### Error: "password authentication failed"

Update your DATABASE_URL in `.env`:

```env
# No password (default for local)
DATABASE_URL=postgresql://localhost:5432/workout_generator

# With password
DATABASE_URL=postgresql://yourusername:yourpassword@localhost:5432/workout_generator
```

### Error: "port 5432 already in use"

```bash
# Find process using port 5432
lsof -i :5432

# Kill the process
kill -9 <PID>

# Or use a different port in .env
DATABASE_URL=postgresql://localhost:5433/workout_generator
```

### Check Connection

```bash
# Test connection
pg_isready -d workout_generator

# Expected output: 
# /tmp:5432 - accepting connections
```

## 🔐 Security Best Practices

### Development

- Use local database without password (default)
- Add `.env` to `.gitignore` ✅ (already done)

### Production

- Use strong passwords
- Enable SSL: `?sslmode=require`
- Use environment variables (never hardcode)
- Limit database user permissions
- Regular backups

## 📊 Monitoring

### Check Database Size

```sql
SELECT pg_size_pretty(pg_database_size('workout_generator'));
```

### Active Connections

```sql
SELECT count(*) FROM pg_stat_activity WHERE datname = 'workout_generator';
```

### Table Info

```sql
\dt+ workouts
```

## 🔄 Migration Guide (Future Updates)

When adding new fields to the database:

1. Create migration file
2. Update `database.ts` schema
3. Update `seed.ts` with new fields
4. Run migration on production

Example:

```sql
ALTER TABLE workouts ADD COLUMN difficulty VARCHAR(20);
```

## 🌐 Cloud Database Setup

### Railway

1. Create PostgreSQL database
2. Copy DATABASE_URL from Railway
3. Update server `.env`
4. Deploy and run seed command in Railway terminal

### Render

1. Create PostgreSQL database
2. Copy Internal/External URL
3. Update `.env` with connection string
4. Seed via Render shell

### Heroku

```bash
heroku addons:create heroku-postgresql:hobby-dev
heroku config:get DATABASE_URL
```

## ✅ Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created (`workout_generator`)
- [ ] `.env` file configured in `server/`
- [ ] Database seeded successfully
- [ ] Can connect: `psql workout_generator`
- [ ] 7 workout records exist

## 📞 Need Help?

If you're still having issues:

1. Check PostgreSQL logs: `tail -f /usr/local/var/log/postgresql@14.log`
2. Verify `.env` file exists and is correct
3. Ensure DATABASE_URL matches your setup
4. Try connecting manually: `psql workout_generator`

---

🎉 Once setup is complete, your database is ready for the Workout Generator!

