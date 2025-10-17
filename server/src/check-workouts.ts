import { pool } from './database.js';

async function checkWorkouts() {
  const client = await pool.connect();
  
  try {
    // Total count
    const countResult = await client.query('SELECT COUNT(*) FROM workouts');
    const total = parseInt(countResult.rows[0].count);
    
    console.log('📊 WORKOUT DATABASE SUMMARY');
    console.log('============================');
    console.log(`Total workouts: ${total}`);
    console.log('');
    
    // Count by day
    const byDayResult = await client.query(`
      SELECT day_of_week, COUNT(*) as count 
      FROM workouts 
      GROUP BY day_of_week 
      ORDER BY 
        CASE day_of_week 
          WHEN 'Monday' THEN 1 
          WHEN 'Tuesday' THEN 2 
          WHEN 'Wednesday' THEN 3 
          WHEN 'Thursday' THEN 4 
          WHEN 'Friday' THEN 5 
          WHEN 'Saturday' THEN 6 
          WHEN 'Sunday' THEN 7 
        END
    `);
    
    console.log('Breakdown by day:');
    byDayResult.rows.forEach(row => {
      console.log(`  ${row.day_of_week.padEnd(10)} - ${row.count} variations`);
    });
    console.log('');
    
    // Workout types
    const typesResult = await client.query(`
      SELECT workout_type, COUNT(*) as count 
      FROM workouts 
      GROUP BY workout_type 
      ORDER BY count DESC
    `);
    
    console.log('Workout types:');
    typesResult.rows.forEach(row => {
      console.log(`  ${row.workout_type} - ${row.count}`);
    });
    
  } catch (error) {
    console.error('Error checking workouts:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

checkWorkouts();

