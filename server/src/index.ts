import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, createTables } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from your frontend (update with your Vercel URL after deploying frontend)
app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    'https://your-frontend.vercel.app' // Update this after deploying frontend
  ],
  credentials: true
}));
app.use(express.json());

// Initialize database tables and seed if empty
async function initializeDatabase() {
  try {
    await createTables();
    
    // Check if database is empty
    const result = await pool.query('SELECT COUNT(*) FROM workouts');
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      console.log('Database is empty. Seeding with workout data...');
      
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
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();

// Get all workouts
app.get('/api/workouts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM workouts ORDER BY day_number');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// Get workout by day
app.get('/api/workouts/:day', async (req, res) => {
  const { day } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM workouts WHERE LOWER(day_of_week) = LOWER($1)',
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

// Get today's workout
app.get('/api/workouts/today/current', async (req, res) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  
  try {
    const result = await pool.query(
      'SELECT * FROM workouts WHERE day_of_week = $1',
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

