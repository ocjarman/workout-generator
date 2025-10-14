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

// Initialize database tables
createTables().catch(console.error);

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

