import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuth0 } from '@auth0/auth0-react'
import './App.css'
import WorkoutCard from './components/WorkoutCard'
import WeeklyView from './components/WeeklyView'
import WorkoutHistory from './components/WorkoutHistory'
import AuthButton from './components/AuthButton'

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
  const { isAuthenticated, isLoading: authLoading, user, error } = useAuth0();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'today' | 'weekly' | 'history'>('today');
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hasSyncedThisSession, setHasSyncedThisSession] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [hasExistingProgress, setHasExistingProgress] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Log authentication status and API URL for debugging
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
    
    console.log('Auth Status:', { isAuthenticated, authLoading, user, error });
    console.log('API URL:', API_URL);
    console.log('VITE_API_URL env var:', import.meta.env.VITE_API_URL || 'NOT SET - using localhost default');
    console.log('Is Production:', isProduction);
    
    // Warn if API URL is not set in production or if using localhost in production
    if (isProduction) {
      if (!import.meta.env.VITE_API_URL) {
        console.error('⚠️ WARNING: VITE_API_URL environment variable is not set in production!');
        setApiError('API URL not configured. Please set VITE_API_URL environment variable in Vercel settings.');
      } else if (API_URL.includes('localhost') || API_URL.includes('127.0.0.1')) {
        console.error('⚠️ WARNING: API URL is set to localhost in production!');
        setApiError(`Invalid API URL: ${API_URL}\n\nYou cannot use localhost in production. Please set VITE_API_URL to your production backend URL in Vercel settings.`);
      }
    }
  }, [isAuthenticated, authLoading, user, error]);

  useEffect(() => {
    fetchWorkouts();
    setTodaysDay();
  }, []);

  // Automatically save user to database after authentication
  useEffect(() => {
    const saveUserToDatabase = async () => {
      if (!isAuthenticated || !user || authLoading || hasSyncedThisSession) {
        return;
      }
      
      console.log('💾 Auto-saving user to database...');
      setHasSyncedThisSession(true);
      
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        console.log('📡 Sending user data to:', `${API_URL}/api/users/save`);
        console.log('📤 User data:', {
          auth0_id: user.sub,
          email: user.email,
          name: user.name,
          picture: user.picture
        });
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${API_URL}/api/users/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth0_id: user.sub,
            email: user.email,
            name: user.name,
            picture: user.picture,
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('✅ User saved successfully:', userData);
        } else {
          const errorData = await response.text();
          console.error('❌ Failed to save user:', response.status, errorData);
        }
      } catch (error: any) {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        console.error('❌ Error saving user:', error);
        console.error('API URL attempted:', `${API_URL}/api/users/save`);
        
        if (error.name === 'AbortError') {
          console.error('Request timed out - API may be unreachable');
        } else if (error.message?.includes('Failed to fetch')) {
          console.error('Failed to fetch - check API URL and CORS configuration');
        }
      }
    };

    saveUserToDatabase();
  }, [isAuthenticated, user, authLoading, hasSyncedThisSession]);

  // Fetch workout history
  const fetchWorkoutHistory = async () => {
    if (!user?.sub) {
      console.log('⏸️ No user to fetch history for');
      return;
    }

    setHistoryLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      console.log('📡 Fetching workout history...');
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_URL}/api/workout-progress/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth0_id: user.sub,
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Workout history fetched:', data.length, 'workouts');
        setWorkoutHistory(data);
      } else {
        const error = await response.text();
        console.error('❌ Failed to fetch history:', error);
        setWorkoutHistory([]);
      }
    } catch (error) {
      console.error('❌ Error fetching history:', error);
      setWorkoutHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: number | undefined;
    if (workoutStarted && workoutStartTime) {
      interval = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [workoutStarted, workoutStartTime]);

  const fetchWorkouts = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      console.log('🌐 Fetching workouts from:', `${API_URL}/api/workouts`);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_URL}/api/workouts`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch workouts: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setWorkouts(data);
      setLoading(false);
      setApiError(null); // Clear any previous errors
    } catch (error: any) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      console.error('❌ Error fetching workouts:', error);
      console.error('API URL attempted:', `${API_URL}/api/workouts`);
      
      // Set empty workouts array so app can still render
      setWorkouts([]);
      setLoading(false);
      
      // Set user-friendly error message
      if (error.name === 'AbortError') {
        setApiError(`Request timed out. The API at ${API_URL} is not responding. Please check your VITE_API_URL environment variable.`);
      } else if (error.message.includes('Failed to fetch')) {
        setApiError(`Cannot connect to API at ${API_URL}. Please verify:\n1. VITE_API_URL is set correctly in Vercel\n2. The backend server is running\n3. CORS is configured properly`);
      } else {
        setApiError(`Error loading workouts: ${error.message}`);
      }
    }
  };

  const setTodaysDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    setSelectedDay(today);
  };

  // Reset hasExistingProgress and workoutCompleted when selected day changes
  useEffect(() => {
    setHasExistingProgress(false);
    setWorkoutCompleted(false);
  }, [selectedDay]);

  const startWorkout = () => {
    setWorkoutStarted(true);
    setWorkoutStartTime(Date.now());
    setElapsedTime(0);
  };

  const handleWorkoutComplete = () => {
    setWorkoutStarted(false);
    setWorkoutStartTime(null);
    setElapsedTime(0);
    setWorkoutCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedWorkout = workouts.find(w => w.day_of_week === selectedDay);
  
  // Check if selected day is today
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  const isToday = selectedDay === today;

  // Show error if Auth0 has an error
  if (error) {
    const clearAuthData = () => {
      // Clear all Auth0 data from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.includes('auth0') || key.includes('@@auth0')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('auth0') || key.includes('@@auth0')) {
          sessionStorage.removeItem(key);
        }
      });
      
      // Reload the page
      window.location.href = '/';
    };

    return (
      <div className="loading-container">
        <div className="error-message">
          <h2>⚠️ Authentication Error</h2>
          <p>{error.message}</p>
          {error.message.includes('Invalid state') && (
            <div className="error-solution">
              <p><strong>This is usually caused by stale authentication data.</strong></p>
              <p>Click the button below to clear it and try again:</p>
            </div>
          )}
          <p className="error-hint">
            Check the browser console (F12) for more details
          </p>
          <div className="error-actions">
            <button onClick={clearAuthData} className="retry-btn primary">
              Clear Auth Data & Retry
            </button>
            <button onClick={() => window.location.reload()} className="retry-btn secondary">
              Just Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading screen while Auth0 is initializing
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <div className="login-content">
          <h1>💪 Weekly Workout Generator</h1>
          <p className="login-subtitle">Track your workouts with personalized progress tracking</p>
          <div className="login-features">
            <div className="feature">
              <span className="feature-icon">⏱️</span>
              <span>Live Workout Timer</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✅</span>
              <span>Track Completed Sets</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Save Your Progress</span>
            </div>
          </div>
          <AuthButton />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your workouts...</p>
      </div>
    );
  }

  // Show API error if present
  if (apiError) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return (
      <div className="app">
        <div className="loading-container">
          <div className="error-message">
            <h2>⚠️ API Connection Error</h2>
            <p style={{ whiteSpace: 'pre-line', marginBottom: '1rem' }}>{apiError}</p>
            <div className="error-solution">
              <p><strong>Current API URL:</strong> <code>{API_URL}</code></p>
              <p><strong>To fix this:</strong></p>
              <ol style={{ textAlign: 'left', display: 'inline-block' }}>
                <li>Go to your Vercel dashboard</li>
                <li>Navigate to Settings → Environment Variables</li>
                <li>Add or update <code>VITE_API_URL</code> with your backend URL</li>
                <li>Redeploy your application</li>
              </ol>
            </div>
            <p className="error-hint">
              Check the browser console (F12) for more details
            </p>
            <div className="error-actions">
              <button onClick={() => { setApiError(null); fetchWorkouts(); }} className="retry-btn primary">
                Retry Connection
              </button>
              <button onClick={() => window.location.reload()} className="retry-btn secondary">
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '2px solid #6366f1',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            padding: '1rem 1.5rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f1f5f9',
            },
          },
          error: {
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#f1f5f9',
            },
          },
        }}
      />
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>💪 Weekly Workout Generator</h1>
            {user && (
              <p className="welcome-message">Welcome back, {user.name || user.email}! 👋</p>
            )}
            <p className="subtitle">Your personalized fitness schedule</p>
          </div>
          <AuthButton />
        </div>
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
        <button 
          className={view === 'history' ? 'active' : ''} 
          onClick={() => {
            setView('history');
            fetchWorkoutHistory();
          }}
        >
          📊 History
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

          {selectedWorkout && (
            <>
              {!workoutStarted && !hasExistingProgress && !workoutCompleted && isToday ? (
                <div className="workout-start-container">
                  <button className="start-workout-btn" onClick={startWorkout}>
                    Start Workout
                  </button>
                  <p className="start-hint">Tap to begin timing your workout</p>
                </div>
              ) : workoutStarted ? (
                <div className="workout-timer">
                  <div className="timer-display">
                    <span className="timer-label">Workout Time:</span>
                    <span className="timer-value">{formatTime(elapsedTime)}</span>
                  </div>
                </div>
              ) : null}
              
              <WorkoutCard 
                workout={selectedWorkout} 
                workoutStarted={workoutStarted}
                workoutStartTime={workoutStartTime}
                auth0Id={user?.sub}
                onWorkoutComplete={handleWorkoutComplete}
                onHasExistingProgress={setHasExistingProgress}
              />
            </>
          )}
        </>
      ) : view === 'weekly' ? (
        <WeeklyView workouts={workouts} />
      ) : (
        historyLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your workout history...</p>
          </div>
        ) : (
          <WorkoutHistory history={workoutHistory} />
        )
      )}
    </div>
  )
}

export default App

