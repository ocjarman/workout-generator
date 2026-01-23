import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Validate DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please set DATABASE_URL in your Render environment variables.');
  process.exit(1);
}

// Log database connection info (without sensitive data)
const dbUrl = process.env.DATABASE_URL;
const dbUrlObj = new URL(dbUrl);
console.log('🔌 Database connection info:');
console.log(`   Host: ${dbUrlObj.hostname}`);
console.log(`   Port: ${dbUrlObj.port || '5432'}`);
console.log(`   Database: ${dbUrlObj.pathname.slice(1)}`);
console.log(`   SSL: ${dbUrl.includes('localhost') ? 'disabled' : 'enabled'}`);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') 
    ? false 
    : {
        rejectUnauthorized: false
      },
  // Add connection timeout and retry settings
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 30000, // 30 seconds
  max: 20, // Maximum number of clients in the pool
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle database client:', err);
  console.error('Error details:', {
    code: err.code,
    errno: (err as any).errno,
    syscall: (err as any).syscall,
    hostname: (err as any).hostname,
  });
});

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection test failed:', err);
    console.error('Error details:', {
      code: err.code,
      errno: (err as any).errno,
      syscall: (err as any).syscall,
      hostname: (err as any).hostname,
    });
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Verify DATABASE_URL is set correctly in Render environment variables');
    console.error('2. Ensure the PostgreSQL database is linked to your web service');
    console.error('3. Check that the database is running and accessible');
    console.error('4. If using Render, make sure you\'re using the Internal Database URL (not External)');
  } else {
    console.log('✅ Database connection test successful');
    console.log(`   Server time: ${res.rows[0].now}`);
  }
});

export const createTables = async () => {
  const client = await pool.connect();
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        auth0_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        picture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create workouts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS workouts (
        id SERIAL PRIMARY KEY,
        day_of_week VARCHAR(20) NOT NULL,
        day_number INTEGER NOT NULL,
        workout_type VARCHAR(100) NOT NULL,
        exercises JSONB NOT NULL,
        duration INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create workout_progress table to track user workout sessions
    await client.query(`
      CREATE TABLE IF NOT EXISTS workout_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
        completed_exercises JSONB NOT NULL DEFAULT '{}',
        workout_date DATE DEFAULT CURRENT_DATE,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        total_duration INTEGER,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, workout_id, workout_date)
      )
    `);

    // Create index for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_workout_progress_user_date 
      ON workout_progress(user_id, workout_date)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_auth0_id 
      ON users(auth0_id)
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

