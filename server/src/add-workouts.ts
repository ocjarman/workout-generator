import { pool, createTables } from './database.js';

// Add new workouts WITHOUT deleting existing ones
const newWorkouts = [
  // Add your new workouts here
  // Example:
  // {
  //   day_of_week: 'Monday',
  //   day_number: 1,
  //   workout_type: 'Lower Body Strength + HIIT',
  //   duration: 60,
  //   exercises: {
  //     strength: [
  //       { name: 'Exercise Name', sets: 4, reps: '8-10', rest: '90s' },
  //     ],
  //   },
  //   notes: 'Your notes here'
  // },
];

async function addWorkouts() {
  const client = await pool.connect();
  
  try {
    // Ensure tables exist
    await createTables();
    
    if (newWorkouts.length === 0) {
      console.log('⚠️  No new workouts to add. Edit src/add-workouts.ts to add workouts.');
      return;
    }
    
    // Get current count
    const countResult = await client.query('SELECT COUNT(*) FROM workouts');
    const currentCount = parseInt(countResult.rows[0].count);
    console.log(`📊 Current workouts in database: ${currentCount}`);
    
    // Insert new workouts
    for (const workout of newWorkouts) {
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
    
    // Get new count
    const newCountResult = await client.query('SELECT COUNT(*) FROM workouts');
    const newCount = parseInt(newCountResult.rows[0].count);
    
    console.log(`✅ Added ${newWorkouts.length} workout(s)`);
    console.log(`📊 Total workouts now: ${newCount}`);
  } catch (error) {
    console.error('Error adding workouts:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addWorkouts();

