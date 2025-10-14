import { pool, createTables } from './database.js';

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
        { 
          name: 'Walking (Outdoor/Treadmill)', 
          duration: '30-45 minutes',
          intensity: 'Moderate pace, able to hold conversation',
          incline: '0-3% if on treadmill'
        },
        { 
          name: 'Peloton Ride (Alternative)', 
          duration: '30-45 minutes',
          type: 'Low Impact or Scenic Ride',
          intensity: 'Zone 2 heart rate'
        }
      ]
    },
    notes: 'Recovery day - keep intensity moderate. Goal is movement, not exhaustion.'
  },
  {
    day_of_week: 'Thursday',
    day_number: 4,
    workout_type: 'Lower Body Strength + Glute Focus',
    duration: 55,
    exercises: {
      strength: [
        { name: 'Hip Thrusts', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'Bulgarian Split Squats', sets: 3, reps: '12 each leg', rest: '60s' },
        { name: 'Sumo Deadlifts', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Cable Kickbacks', sets: 3, reps: '15 each leg', rest: '45s' },
        { name: 'Glute Bridge (weighted)', sets: 3, reps: '15-20', rest: '60s' }
      ],
      accessory: [
        { name: 'Fire Hydrants', sets: 3, reps: '20 each side', rest: '30s' },
        { name: 'Clamshells', sets: 3, reps: '20 each side', rest: '30s' },
        { name: 'Single Leg Glute Bridge', sets: 3, reps: '12 each leg', rest: '45s' }
      ]
    },
    notes: 'Really focus on glute activation. Use mind-muscle connection.'
  },
  {
    day_of_week: 'Friday',
    day_number: 5,
    workout_type: 'Upper Body Strength + HIIT',
    duration: 60,
    exercises: {
      strength: [
        { name: 'Incline Dumbbell Press', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Cable Rows', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'Arnold Press', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '45s' },
        { name: 'Tricep Dips', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: '45s' }
      ],
      hiit: [
        { name: 'Battle Ropes', duration: '30s work, 30s rest', rounds: 6 },
        { name: 'Push-up to T', duration: '30s work, 30s rest', rounds: 6 },
        { name: 'High Knees', duration: '30s work, 30s rest', rounds: 4 }
      ]
    },
    notes: 'End the week strong! Focus on explosive movements during HIIT.'
  },
  {
    day_of_week: 'Saturday',
    day_number: 6,
    workout_type: 'Long Run',
    duration: 40,
    exercises: {
      running: [
        { 
          name: 'Outdoor/Treadmill Run',
          distance: '4-5 miles',
          pace: 'Comfortable, conversational pace',
          notes: 'Start with 5 min easy jog warmup'
        }
      ],
      stretching: [
        { name: 'Hip Flexor Stretch', duration: '30s each side' },
        { name: 'Quad Stretch', duration: '30s each side' },
        { name: 'Hamstring Stretch', duration: '30s each side' },
        { name: 'Calf Stretch', duration: '30s each side' }
      ]
    },
    notes: 'Hydrate well. Cool down with 5 min walk and stretching.'
  },
  {
    day_of_week: 'Sunday',
    day_number: 0,
    workout_type: 'Rest Day / Active Recovery',
    duration: 30,
    exercises: {
      yoga: [
        { name: 'Gentle Yoga Flow', duration: '20-30 minutes', type: 'Yin or Restorative' },
        { name: 'Foam Rolling', duration: '10-15 minutes', focus: 'Full body' }
      ],
      optional: [
        { name: 'Light Walk', duration: '20-30 minutes' },
        { name: 'Meditation', duration: '10-15 minutes' }
      ]
    },
    notes: 'Complete rest or very light activity. Focus on recovery and mobility.'
  }
];

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    // Create tables first
    await createTables();
    
    // Clear existing data
    await client.query('DELETE FROM workouts');
    
    // Insert workout data
    for (const workout of workouts) {
      await client.query(
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
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();

