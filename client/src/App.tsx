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
  const [syncStatus, setSyncStatus] = useState<string>('Not started');
  const [hasSyncedThisSession, setHasSyncedThisSession] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Log authentication status for debugging
  useEffect(() => {
    console.log('Auth Status:', { isAuthenticated, authLoading, user, error });
  }, [isAuthenticated, authLoading, user, error]);

  useEffect(() => {
    fetchWorkouts();
    setTodaysDay();
  }, []);

  // Simple function to save user to database
  const saveUserToDatabase = async () => {
    console.log('💾 Saving user to database...');
    setSyncStatus('Saving...');
    
    if (!isAuthenticated || !user) {
      console.log('⏸️ Not authenticated');
      setSyncStatus('Not authenticated');
      return;
    }
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      console.log('📡 Sending user data to:', `${API_URL}/api/users/save`);
      console.log('📤 User data:', {
        auth0_id: user.sub,
        email: user.email,
        name: user.name,
        picture: user.picture
      });
      
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
      });
      
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Failed to save user:', response.status, errorData);
        setSyncStatus(`ERROR: ${response.status} - ${errorData.substring(0, 50)}`);
      } else {
        const userData = await response.json();
        console.log('✅ User saved successfully:', userData);
        setSyncStatus(`✅ Saved! User ID: ${userData.id}`);
        setHasSyncedThisSession(true);
      }
    } catch (error: any) {
      console.error('❌ Error saving user:', error);
      setSyncStatus(`ERROR: ${error.message}`);
    }
  };

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
      const response = await fetch(`${API_URL}/api/workout-progress/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth0_id: user.sub,
        }),
      });
      
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

  // AUTO-SYNC DISABLED TO PREVENT INFINITE LOOPS
  // Use the manual "Test Sync User" button instead
  // 
  // To re-enable auto-sync in the future, uncomment this and wrap manualSyncUser in useCallback
  /*
  useEffect(() => {
    console.log('🔄 syncUser useEffect triggered', { isAuthenticated, authLoading, hasUser: !!user, hasSynced: hasSyncedThisSession });
    
    // Only sync once per session and only when fully authenticated
    if (!isAuthenticated || authLoading || !user || hasSyncedThisSession) {
      console.log('⏸️ Skipping auto-sync');
      return;
    }
    
    const syncUser = async () => {
      console.log('🔄 Auto-syncing user on login...');
      setHasSyncedThisSession(true);
      await manualSyncUser();
    };

    syncUser();
  }, [isAuthenticated, user, authLoading, hasSyncedThisSession]);
  */

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

  const startWorkout = () => {
    setWorkoutStarted(true);
    setWorkoutStartTime(Date.now());
    setElapsedTime(0);
  };

  const resetWorkout = () => {
    setWorkoutStarted(false);
    setWorkoutStartTime(null);
    setElapsedTime(0);
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
              <>
                <p className="welcome-message">Welcome back, {user.name || user.email}! 👋</p>
                <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>
                    Status: <strong>{syncStatus}</strong>
                  </p>
                  <button 
                    onClick={saveUserToDatabase}
                    style={{
                      padding: '8px 16px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}
                  >
                    💾 Save My Profile to Database
                  </button>
                </div>
              </>
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
              {!workoutStarted ? (
                <div className="workout-start-container">
                  <button className="start-workout-btn" onClick={startWorkout}>
                    Start Workout
                  </button>
                  <p className="start-hint">Tap to begin timing your workout</p>
                </div>
              ) : (
                <div className="workout-timer">
                  <div className="timer-display">
                    <span className="timer-label">Workout Time:</span>
                    <span className="timer-value">{formatTime(elapsedTime)}</span>
                  </div>
                </div>
              )}
              
              <WorkoutCard 
                workout={selectedWorkout} 
                workoutStarted={workoutStarted}
                workoutStartTime={workoutStartTime}
                auth0Id={user?.sub}
                onWorkoutComplete={resetWorkout}
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

