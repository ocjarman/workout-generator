import { useState, useEffect } from 'react'
import './App.css'
import WorkoutCard from './components/WorkoutCard'
import WeeklyView from './components/WeeklyView'

interface Workout {
  id: number;
  day_of_week: string;
  day_number: number;
  workout_type: string;
  exercises: any;
  duration: number;
  notes: string;
}

function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'today' | 'weekly'>('today');

  useEffect(() => {
    fetchWorkouts();
    setTodaysDay();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/workouts`);
      const data = await response.json();
      setWorkouts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setLoading(false);
    }
  };

  const setTodaysDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    setSelectedDay(today);
  };

  const selectedWorkout = workouts.find(w => w.day_of_week === selectedDay);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your workouts...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>💪 Weekly Workout Generator</h1>
        <p className="subtitle">Your personalized fitness schedule</p>
      </header>

      <div className="view-toggle">
        <button 
          className={view === 'today' ? 'active' : ''} 
          onClick={() => setView('today')}
        >
          Today's Workout
        </button>
        <button 
          className={view === 'weekly' ? 'active' : ''} 
          onClick={() => setView('weekly')}
        >
          Weekly Schedule
        </button>
      </div>

      {view === 'today' ? (
        <>
          <div className="day-selector">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <button
                key={day}
                className={selectedDay === day ? 'active' : ''}
                onClick={() => setSelectedDay(day)}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          {selectedWorkout && <WorkoutCard workout={selectedWorkout} />}
        </>
      ) : (
        <WeeklyView workouts={workouts} />
      )}
    </div>
  )
}

export default App

