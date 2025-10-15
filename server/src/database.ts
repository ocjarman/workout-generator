import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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

