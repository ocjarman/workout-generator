import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, createTables } from './database.js';
import { checkJwt, optionalAuth } from './auth.js';
import { findOrCreateUser, getUserByAuth0Id } from './userService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from your frontend
app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    'https://workout-generator-997qleozy-olivia-jarmans-projects.vercel.app', // Vercel preview
    /https:\/\/.*\.vercel\.app$/ // Allow any Vercel deployments
  ],
  credentials: true
}));
app.use(express.json());

// Initialize database tables and seed if empty
async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    await createTables();
    
    // Check if database is empty
    console.log('🔍 Checking if database needs seeding...');
    const result = await pool.query('SELECT COUNT(*) FROM workouts');
    const count = parseInt(result.rows[0].count);
    console.log(`📊 Found ${count} workouts in database`);
    
    if (count === 0) {
      console.log('🌱 Database is empty. Seeding with workout data...');
      
      // Import workout data
      const workouts = [
        {
          day_of_week: 'Monday',
          day_number: 1,
          workout_type: 'Lower Body Strength + HIIT',
          duration: 60,
          exercises: {
            strength: [
              { name: 'Squats', sets: 4, reps: '8-10', rest: '90s' },
              { name: 'Romanian Deadlifts', sets: 4, reps: '10-12', rest: '90s' },
              { name: 'Leg Press', sets: 3, reps: '12-15', rest: '60s' },
              { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: '60s' },
              { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60s' }
            ],
            hiit: [
              { name: 'Jump Squats', duration: '30s work, 30s rest', rounds: 8 },
              { name: 'Mountain Climbers', duration: '30s work, 30s rest', rounds: 8 },
              { name: 'Burpees', duration: '30s work, 30s rest', rounds: 4 }
            ]
          },
          notes: 'Focus on form. Warm up 5-10 minutes before starting.'
        },
        {
          day_of_week: 'Tuesday',
          day_number: 2,
          workout_type: 'Upper Body Strength + Core',
          duration: 55,
          exercises: {
            strength: [
              { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90s' },
              { name: 'Bent Over Rows', sets: 4, reps: '10-12', rest: '90s' },
              { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '60s' },
              { name: 'Pull-ups/Lat Pulldown', sets: 3, reps: '8-12', rest: '60s' },
              { name: 'Dumbbell Flyes', sets: 3, reps: '12-15', rest: '60s' }
            ],
            core: [
              { name: 'Plank', sets: 3, duration: '45-60s', rest: '30s' },
              { name: 'Russian Twists', sets: 3, reps: '20 each side', rest: '30s' },
              { name: 'Dead Bug', sets: 3, reps: '12 each side', rest: '30s' },
              { name: 'Bicycle Crunches', sets: 3, reps: '20 each side', rest: '30s' }
            ]
          },
          notes: 'Keep core engaged throughout all exercises.'
        },
        {
          day_of_week: 'Wednesday',
          day_number: 3,
          workout_type: 'Steady State Cardio',
          duration: 45,
          exercises: {
            cardio: [
              { name: 'Running/Jogging', duration: '30 minutes', intensity: 'moderate (60-70% max HR)' },
              { name: 'Elliptical', duration: '30 minutes', intensity: 'moderate' },
              { name: 'Cycling', duration: '30 minutes', intensity: 'moderate' }
            ],
            cooldown: [
              { name: 'Walking', duration: '5 minutes' },
              { name: 'Static Stretching', duration: '10 minutes' }
            ]
          },
          notes: 'Choose one cardio option. Maintain conversational pace.'
        },
        {
          day_of_week: 'Thursday',
          day_number: 4,
          workout_type: 'Full Body Circuit',
          duration: 50,
          exercises: {
            circuit: [
              { name: 'Push-ups', reps: '15-20', rest: '30s' },
              { name: 'Goblet Squats', reps: '15-20', rest: '30s' },
              { name: 'Dumbbell Rows', reps: '12-15 each arm', rest: '30s' },
              { name: 'Overhead Press', reps: '12-15', rest: '30s' },
              { name: 'Kettlebell Swings', reps: '20', rest: '30s' },
              { name: 'Plank Hold', duration: '45-60s', rest: '60s' }
            ]
          },
          notes: 'Complete 4 rounds of the circuit. Rest 2 minutes between rounds.'
        },
        {
          day_of_week: 'Friday',
          day_number: 5,
          workout_type: 'Active Recovery',
          duration: 30,
          exercises: {
            activities: [
              { name: 'Yoga Flow', duration: '30 minutes', intensity: 'light' },
              { name: 'Swimming', duration: '30 minutes', intensity: 'easy' },
              { name: 'Walking', duration: '30-45 minutes', intensity: 'light' }
            ],
            stretching: [
              { name: 'Hip Flexor Stretch', duration: '30s each side' },
              { name: 'Hamstring Stretch', duration: '30s each side' },
              { name: 'Chest Opener', duration: '30s' },
              { name: 'Shoulder Rolls', duration: '1 minute' }
            ]
          },
          notes: 'Choose one activity. Focus on mobility and light movement.'
        },
        {
          day_of_week: 'Saturday',
          day_number: 6,
          workout_type: 'High Intensity Interval Training',
          duration: 40,
          exercises: {
            warmup: [
              { name: 'Jump Rope', duration: '3 minutes' },
              { name: 'Dynamic Stretching', duration: '5 minutes' }
            ],
            hiit: [
              { name: 'Sprints', duration: '20s work, 40s rest', rounds: 10 },
              { name: 'Box Jumps', duration: '20s work, 40s rest', rounds: 8 },
              { name: 'Battle Ropes', duration: '20s work, 40s rest', rounds: 8 }
            ],
            cooldown: [
              { name: 'Walking', duration: '5 minutes' },
              { name: 'Stretching', duration: '5 minutes' }
            ]
          },
          notes: 'Give maximum effort during work intervals. Rest as needed.'
        },
        {
          day_of_week: 'Sunday',
          day_number: 7,
          workout_type: 'Rest Day',
          duration: 0,
          exercises: {
            optional: [
              { name: 'Light Walking', duration: '20-30 minutes' },
              { name: 'Gentle Stretching', duration: '15 minutes' },
              { name: 'Foam Rolling', duration: '10-15 minutes' }
            ]
          },
          notes: 'Complete rest or very light activity. Focus on recovery and mobility.'
        }
      ];
      
      // Insert workout data
      for (const workout of workouts) {
        await pool.query(
          `INSERT INTO workouts (day_of_week, day_number, workout_type, exercises, duration, notes)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            workout.day_of_week,
            workout.day_number,
            workout.workout_type,
            JSON.stringify(workout.exercises),
            workout.duration,
            workout.notes
          ]
        );
      }
      
      console.log('✅ Database seeded successfully with workout data!');
    } else {
      console.log(`✅ Database already contains ${count} workouts`);
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
  }
}

console.log('🚀 Starting database initialization...');
initializeDatabase().then(() => {
  console.log('✅ Database initialization complete');
}).catch(err => {
  console.error('❌ Database initialization failed:', err);
});

// Get all workouts - one random workout per day
app.get('/api/workouts', async (req, res) => {
  try {
    // Get a random workout for each day of the week
    const result = await pool.query(`
      WITH ranked_workouts AS (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY day_of_week ORDER BY RANDOM()) as rn
        FROM workouts
      )
      SELECT id, day_of_week, day_number, workout_type, exercises, duration, notes, created_at
      FROM ranked_workouts
      WHERE rn = 1
      ORDER BY day_number
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// Get workout by day - randomly select from available workouts for that day
app.get('/api/workouts/:day', async (req, res) => {
  const { day } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM workouts WHERE LOWER(day_of_week) = LOWER($1) ORDER BY RANDOM() LIMIT 1',
      [day]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workout not found for this day' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ error: 'Failed to fetch workout' });
  }
});

// Get today's workout - randomly select from available workouts for today
app.get('/api/workouts/today/current', async (req, res) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  
  try {
    const result = await pool.query(
      'SELECT * FROM workouts WHERE day_of_week = $1 ORDER BY RANDOM() LIMIT 1',
      [today]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No workout found for today' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching today\'s workout:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s workout' });
  }
});

// User endpoints
// Simple endpoint to save user without JWT authentication
app.post('/api/users/save', async (req, res) => {
  console.log('📨 Received POST /api/users/save request');
  
  try {
    const { auth0_id, email, name, picture } = req.body;

    console.log('User data received:', { auth0_id, email, name });

    if (!auth0_id || !email) {
      console.error('❌ Missing auth0_id or email');
      return res.status(400).json({ error: 'Missing required user information' });
    }

    const user = await findOrCreateUser(auth0_id, email, name, picture);
    console.log('✅ User saved successfully:', user.id, user.email);
    res.json(user);
  } catch (error) {
    console.error('❌ Error saving user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

app.post('/api/users/me', async (req, res) => {
  console.log('📨 Received POST /api/users/me request');
  
  const authHeader = req.headers.authorization;
  console.log('Authorization header present:', !!authHeader);
  
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 50) + '...');
    const parts = token.split('.');
    console.log('Token parts:', parts.length, '(should be 3 for JWT)');
  }
  
  // Apply JWT verification
  return checkJwt(req, res, async (err) => {
    if (err) {
      console.error('❌ JWT verification failed:', err.message);
      console.error('Error details:', err);
      return res.status(401).json({ 
        error: 'Authentication failed', 
        message: err.message,
        hint: 'Make sure VITE_AUTH0_AUDIENCE is set correctly in your client .env file'
      });
    }
    
    try {
      const auth0Id = req.auth?.payload.sub;
      const { email, name, picture } = req.body;

      console.log('Auth0 ID:', auth0Id);
      console.log('User email:', email);

      if (!auth0Id || !email) {
        console.error('❌ Missing auth0Id or email');
        return res.status(400).json({ error: 'Missing required user information' });
      }

      const user = await findOrCreateUser(auth0Id, email, name, picture);
      console.log('✅ User synced successfully:', user.id, user.email);
      res.json(user);
    } catch (error) {
      console.error('❌ Error creating/updating user:', error);
      res.status(500).json({ error: 'Failed to create or update user' });
    }
  });
});

app.get('/api/users/me', checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth?.payload.sub;

    if (!auth0Id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await getUserByAuth0Id(auth0Id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Workout progress endpoints
// Simple endpoint to save workout progress without JWT
app.post('/api/workout-progress/save', async (req, res) => {
  console.log('📨 Received POST /api/workout-progress/save request');
  
  try {
    const { auth0_id, workout_id, day_of_week, workout_type, completed_exercises, start_time, end_time, total_duration, completed } = req.body;

    console.log('Workout progress data received:', { auth0_id, workout_id, day_of_week, completed });

    if (!auth0_id) {
      console.error('❌ Missing auth0_id');
      return res.status(400).json({ error: 'Missing auth0_id' });
    }

    // Get user from auth0_id
    const user = await getUserByAuth0Id(auth0_id);
    
    if (!user) {
      console.error('❌ User not found for auth0_id:', auth0_id);
      return res.status(404).json({ error: 'User not found. Please save your profile first.' });
    }

    const result = await pool.query(
      `INSERT INTO workout_progress 
       (user_id, workout_id, completed_exercises, start_time, end_time, total_duration, completed)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user.id, workout_id, JSON.stringify(completed_exercises), start_time, end_time, total_duration, completed]
    );

    console.log('✅ Workout progress saved successfully:', result.rows[0].id);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error saving workout progress:', error);
    res.status(500).json({ error: 'Failed to save workout progress' });
  }
});

// Get workout history for a user (no auth required, just pass auth0_id)
app.post('/api/workout-progress/history', async (req, res) => {
  console.log('📨 Received POST /api/workout-progress/history request');
  
  try {
    const { auth0_id } = req.body;

    if (!auth0_id) {
      return res.status(400).json({ error: 'Missing auth0_id' });
    }

    const user = await getUserByAuth0Id(auth0_id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const limit = 30; // Last 30 workouts

    const result = await pool.query(
      `SELECT wp.*, w.day_of_week, w.workout_type 
       FROM workout_progress wp
       JOIN workouts w ON wp.workout_id = w.id
       WHERE wp.user_id = $1
       ORDER BY wp.workout_date DESC, wp.created_at DESC
       LIMIT $2`,
      [user.id, limit]
    );

    console.log(`✅ Found ${result.rows.length} workout history records`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching workout history:', error);
    res.status(500).json({ error: 'Failed to fetch workout history' });
  }
});

app.post('/api/workout-progress', checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth?.payload.sub;
    
    if (!auth0Id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await getUserByAuth0Id(auth0Id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { workout_id, completed_exercises, start_time, end_time, total_duration, completed } = req.body;

    const result = await pool.query(
      `INSERT INTO workout_progress 
       (user_id, workout_id, completed_exercises, start_time, end_time, total_duration, completed)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, workout_id, workout_date)
       DO UPDATE SET 
         completed_exercises = $3,
         end_time = $5,
         total_duration = $6,
         completed = $7
       RETURNING *`,
      [user.id, workout_id, JSON.stringify(completed_exercises), start_time, end_time, total_duration, completed]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving workout progress:', error);
    res.status(500).json({ error: 'Failed to save workout progress' });
  }
});

app.get('/api/workout-progress/today', checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth?.payload.sub;
    
    if (!auth0Id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await getUserByAuth0Id(auth0Id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await pool.query(
      `SELECT * FROM workout_progress 
       WHERE user_id = $1 AND workout_date = CURRENT_DATE
       ORDER BY created_at DESC`,
      [user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching workout progress:', error);
    res.status(500).json({ error: 'Failed to fetch workout progress' });
  }
});

app.get('/api/workout-progress/history', checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth?.payload.sub;
    
    if (!auth0Id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await getUserByAuth0Id(auth0Id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const limit = parseInt(req.query.limit as string) || 30;

    const result = await pool.query(
      `SELECT wp.*, w.day_of_week, w.workout_type 
       FROM workout_progress wp
       JOIN workouts w ON wp.workout_id = w.id
       WHERE wp.user_id = $1
       ORDER BY wp.workout_date DESC
       LIMIT $2`,
      [user.id, limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching workout history:', error);
    res.status(500).json({ error: 'Failed to fetch workout history' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

