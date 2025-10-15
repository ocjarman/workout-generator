import { pool } from './database.js';

async function testDatabase() {
  try {
    // Count workouts per day
    const countResult = await pool.query(`
      SELECT day_of_week, COUNT(*) as count 
      FROM workouts 
      GROUP BY day_of_week 
      ORDER BY day_of_week
    `);
    
    console.log('\n📊 Workout variations per day:');
    console.log('================================');
    countResult.rows.forEach(row => {
      console.log(`${row.day_of_week}: ${row.count} variations`);
    });
    
    // Total workouts
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM workouts');
    console.log(`\n✅ Total workouts in database: ${totalResult.rows[0].total}`);
    
    // Test randomization - fetch Monday workouts 5 times
    console.log('\n🎲 Testing randomization for Monday (5 fetches):');
    console.log('================================================');
    for (let i = 0; i < 5; i++) {
      const result = await pool.query(`
        SELECT id, workout_type, exercises->>'strength' as strength_preview
        FROM workouts 
        WHERE day_of_week = 'Monday' 
        ORDER BY RANDOM() 
        LIMIT 1
      `);
      const workout = result.rows[0];
      const firstExercise = JSON.parse(workout.strength_preview || '[]')[0]?.name || 'N/A';
      console.log(`  Fetch ${i + 1}: ID ${workout.id} - First exercise: ${firstExercise}`);
    }
    
  } catch (error) {
    console.error('Error testing database:', error);
  } finally {
    await pool.end();
  }
}

testDatabase();

