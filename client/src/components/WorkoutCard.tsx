import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './WorkoutCard.css';

interface WorkoutProps {
  workout: {
    id: number;
    day_of_week: string;
    workout_type: string;
    exercises: any;
    duration: number;
    notes: string;
  };
  workoutStarted: boolean;
  workoutStartTime: number | null;
  auth0Id?: string;
  onWorkoutComplete: () => void;
  onHasExistingProgress?: (hasProgress: boolean) => void;
}

interface ExerciseCompletion {
  [key: string]: number; // category-index: completedSets
}

const WorkoutCard: React.FC<WorkoutProps> = ({ workout, workoutStarted, workoutStartTime, auth0Id, onWorkoutComplete, onHasExistingProgress }) => {
  const [completedSets, setCompletedSets] = useState<ExerciseCompletion>({});
  const [showCompletion, setShowCompletion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [hasExistingProgress, setHasExistingProgress] = useState(false);
  const [dayCompleted, setDayCompleted] = useState(false);
  const [hasCompletedWorkoutForDay, setHasCompletedWorkoutForDay] = useState(false);

  // Check if a category contains alternative exercises
  const isAlternativeCategory = (category: string) => {
    const alternativeKeywords = ['choose one', 'pick one', 'select one', 'or', 'option'];
    const categoryLower = category.toLowerCase();
    const notesLower = workout.notes?.toLowerCase() || '';
    
    // Check if notes mention choosing from this category
    const hasChooseOne = alternativeKeywords.some(keyword => 
      notesLower.includes(keyword) && notesLower.includes(categoryLower)
    );
    
    // Common alternative categories
    const alternativeCategories = ['cardio', 'activities', 'optional'];
    const isAlternativeCat = alternativeCategories.includes(categoryLower);
    
    return hasChooseOne || isAlternativeCat;
  };

  // Calculate total exercises and completed (counting alternatives as 1)
  const getTotalExercises = () => {
    let total = 0;
    Object.keys(workout.exercises).forEach((category) => {
      if (isAlternativeCategory(category)) {
        total += 1; // Only count as 1 exercise for alternatives
      } else {
        total += workout.exercises[category].length;
      }
    });
    return total;
  };

  const getCompletedExercises = () => {
    let completed = 0;
    const completedCategories = new Set<string>();
    
    Object.keys(completedSets).forEach((key) => {
      const [category, indexStr] = key.split('-');
      const index = parseInt(indexStr);
      const exercise = workout.exercises[category]?.[index];
      
      if (!exercise) return;
      
      const totalSets = getExerciseTotalSets(exercise);
      const completedSetsForExercise = completedSets[key];
      
      // Only count if ALL sets are complete
      if (completedSetsForExercise >= totalSets) {
        if (isAlternativeCategory(category)) {
          // Only count once per alternative category
          if (!completedCategories.has(category)) {
            completedCategories.add(category);
            completed += 1;
          }
        } else {
          completed += 1;
        }
      }
    });
    
    return completed;
  };

  // Check if user has completed ANY workout for the specific date of this day
  useEffect(() => {
    const checkDayCompletion = async () => {
      if (!auth0Id) {
        setDayCompleted(false);
        setHasCompletedWorkoutForDay(false);
        return;
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        // Calculate the actual date for this day of the week
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        const todayDayIndex = today.getDay();
        const targetDayIndex = days.indexOf(workout.day_of_week);
        
        // Calculate how many days to this day (can be negative for past days, positive for future)
        let daysDifference = targetDayIndex - todayDayIndex;
        
        // If it's Sunday and we're past Sunday this week, go to next Sunday
        if (targetDayIndex === 0 && daysDifference < 0) {
          daysDifference += 7;
        }
        
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysDifference);
        const targetDateString = targetDate.toISOString().split('T')[0];
        
        console.log(`🔍 Checking workout completion for ${workout.day_of_week} on date ${targetDateString}`);
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${API_URL}/api/workout-progress/check-day`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth0_id: auth0Id,
            workout_date: targetDateString,
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          setDayCompleted(data.hasCompletedWorkout);
          setHasCompletedWorkoutForDay(data.hasCompletedWorkout);
          if (data.hasCompletedWorkout) {
            console.log(`✅ User has already completed a workout on ${workout.day_of_week} (${targetDateString})`);
            onHasExistingProgress?.(true);
          }
        }
      } catch (error) {
        console.error('❌ Error checking day completion:', error);
        setDayCompleted(false);
        setHasCompletedWorkoutForDay(false);
      }
    };

    checkDayCompletion();
  }, [auth0Id, workout.day_of_week, onHasExistingProgress]);

  // Fetch existing workout progress when component loads or workout changes
  useEffect(() => {
    const fetchWorkoutProgress = async () => {
      if (!auth0Id || !workout.id) {
        setLoadingProgress(false);
        onHasExistingProgress?.(false);
        return;
      }

      try {
        setLoadingProgress(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${API_URL}/api/workout-progress/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth0_id: auth0Id,
            workout_id: workout.id,
            workout_date: today,
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const progressData = await response.json();
          
          if (progressData && progressData.completed_exercises) {
            console.log('📥 Loaded existing workout progress:', progressData);
            setCompletedSets(progressData.completed_exercises);
            setHasExistingProgress(true);
            onHasExistingProgress?.(true);
            
            // If all exercises are complete, show completion screen
            if (progressData.completed) {
              setShowCompletion(false); // Don't auto-show completion screen, let user review
            }
          } else {
            setCompletedSets({});
            setHasExistingProgress(false);
            onHasExistingProgress?.(false);
          }
        }
      } catch (error) {
        console.error('❌ Error fetching workout progress:', error);
        setCompletedSets({});
        setHasExistingProgress(false);
        onHasExistingProgress?.(false);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchWorkoutProgress();
  }, [auth0Id, workout.id, workout.day_of_week, onHasExistingProgress]);

  // Don't auto-show completion screen - only show after clicking "Finish Workout"
  // useEffect removed - completion screen only shown when user clicks finish

  // Reset completion when workout changes or is reset
  useEffect(() => {
    if (!workoutStarted && !hasExistingProgress) {
      setCompletedSets({});
      setShowCompletion(false);
    }
  }, [workoutStarted, workout.day_of_week, hasExistingProgress]);

  const handleExerciseClick = (category: string, index: number, exercise: any) => {
    // Allow clicking if workout is started OR if there's existing progress to review/modify
    if (!workoutStarted && !hasExistingProgress) {
      toast.error('Please tap "Start Workout" before tracking exercises!', {
        icon: '⚠️',
      });
      return;
    }
    
    const key = `${category}-${index}`;
    const totalSets = exercise.sets || exercise.rounds || 1;
    const currentCompleted = completedSets[key] || 0;
    const isAlternative = isAlternativeCategory(category);
    
    if (currentCompleted < totalSets) {
      const newCompletedSets = { ...completedSets };
      
      if (isAlternative) {
        // For alternatives: clear any other completed exercises in this category
        Object.keys(newCompletedSets).forEach((k) => {
          if (k.startsWith(`${category}-`) && k !== key) {
            delete newCompletedSets[k];
          }
        });
      }
      
      newCompletedSets[key] = currentCompleted + 1;
      setCompletedSets(newCompletedSets);
    } else {
      // Reset if already completed
      const newCompleted = { ...completedSets };
      delete newCompleted[key];
      setCompletedSets(newCompleted);
    }
  };

  const getExerciseTotalSets = (exercise: any) => {
    return exercise.sets || exercise.rounds || 1;
  };

  const isExerciseComplete = (category: string, index: number, exercise: any) => {
    const key = `${category}-${index}`;
    const completed = completedSets[key] || 0;
    const total = getExerciseTotalSets(exercise);
    return completed >= total;
  };

  const getExerciseProgress = (category: string, index: number, exercise: any) => {
    const key = `${category}-${index}`;
    const completed = completedSets[key] || 0;
    const total = getExerciseTotalSets(exercise);
    return `${completed}/${total}`;
  };

  const renderExercises = () => {
    const exercises = workout.exercises;
    const sections: React.JSX.Element[] = [];

    // Render different exercise types
    Object.keys(exercises).forEach((category) => {
      const categoryExercises = exercises[category];
      const isAlternative = isAlternativeCategory(category);
      
      sections.push(
        <div key={category} className={`exercise-category ${isAlternative ? 'alternatives' : ''}`}>
          <div className="category-title-row">
            <h3 className="category-title">{category.toUpperCase()}</h3>
            {isAlternative && <span className="alternative-badge">Choose One</span>}
          </div>
          <div className="exercise-list">
            {categoryExercises.map((exercise: any, index: number) => {
              const isComplete = isExerciseComplete(category, index, exercise);
              const progress = getExerciseProgress(category, index, exercise);
              
              return (
                <div 
                  key={index} 
                  className={`exercise-item ${(workoutStarted || hasExistingProgress) ? 'clickable' : ''} ${isComplete ? 'completed' : ''} ${isAlternative ? 'alternative' : ''}`}
                  onClick={() => handleExerciseClick(category, index, exercise)}
                >
                  <div className="exercise-header-row">
                    <div className="exercise-name">
                      {isAlternative && <span className="alternative-dot">○</span>}
                      {exercise.name}
                    </div>
                    {(workoutStarted || hasExistingProgress) && (
                      <div className="exercise-progress">
                        <span className="progress-text">{progress}</span>
                        {isComplete && <span className="check-mark">✓</span>}
                      </div>
                    )}
                  </div>
                  <div className="exercise-details">
                    {exercise.sets && <span>Sets: {exercise.sets}</span>}
                    {exercise.reps && <span>Reps: {exercise.reps}</span>}
                    {exercise.duration && <span>{exercise.duration}</span>}
                    {exercise.rest && <span>Rest: {exercise.rest}</span>}
                    {exercise.rounds && <span>Rounds: {exercise.rounds}</span>}
                    {exercise.distance && <span>Distance: {exercise.distance}</span>}
                    {exercise.pace && <span>Pace: {exercise.pace}</span>}
                    {exercise.intensity && <span>Intensity: {exercise.intensity}</span>}
                    {exercise.type && <span>Type: {exercise.type}</span>}
                    {exercise.incline && <span>Incline: {exercise.incline}</span>}
                    {exercise.focus && <span>Focus: {exercise.focus}</span>}
                    {exercise.notes && <span className="exercise-notes">{exercise.notes}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });

    return sections;
  };

  const handleFinishWorkout = async () => {
    setIsSaving(true);
    
    if (auth0Id && workoutStartTime) {
      try {
        const endTime = Date.now();
        const totalDuration = Math.floor((endTime - workoutStartTime) / 1000); // in seconds
        
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        console.log('💾 Saving workout progress...');
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${API_URL}/api/workout-progress/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth0_id: auth0Id,
            workout_id: workout.id,
            day_of_week: workout.day_of_week,
            workout_type: workout.workout_type,
            completed_exercises: completedSets,
            start_time: new Date(workoutStartTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            total_duration: totalDuration,
            completed: true,
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log('✅ Workout progress saved!');
          toast.success('Workout saved to your history! 🎉');
          setHasExistingProgress(true);
          setDayCompleted(true); // Mark day as completed
          onWorkoutComplete(); // Stop and hide the timer
          setShowCompletion(true); // Show completion screen after saving
        } else {
          const error = await response.text();
          console.error('❌ Failed to save workout:', error);
          if (error.includes('User not found')) {
            toast.error('Please save your profile first before tracking workouts');
          } else {
            toast.error('Could not save workout progress');
          }
        }
      } catch (error) {
        console.error('❌ Error saving workout:', error);
        toast.error('Could not save workout progress');
      }
    }
    
    setIsSaving(false);
    // Don't call onWorkoutComplete here - wait for user to click Done on completion screen
  };

  const handleResetWorkout = () => {
    console.log('🔄 Resetting workout UI state...');
    setCompletedSets({});
    setHasExistingProgress(false);
    setDayCompleted(false);
    onHasExistingProgress?.(false);
    setShowCompletion(false);
    onWorkoutComplete(); // Reset timer and workout state in parent
    toast.success('Workout reset! Start fresh.');
  };

  if (showCompletion) {
    return (
      <div className="completion-screen">
        <div className="completion-content">
          <div className="completion-icon">🎉</div>
          <h2 className="completion-title">Nice Job!</h2>
          <p className="completion-message">You've completed all exercises for today's workout!</p>
          <div className="completion-stats">
            <div className="stat">
              <span className="stat-value">{getTotalExercises()}</span>
              <span className="stat-label">Exercises Completed</span>
            </div>
          </div>
          <button 
            className="completion-btn" 
            onClick={() => {
              setShowCompletion(false);
              // Don't call onWorkoutComplete here since timer is already stopped
              // Keep dayCompleted true so user sees the "day completed" message
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (loadingProgress) {
    return (
      <div className="workout-card">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading workout progress...</p>
        </div>
      </div>
    );
  }

  // Calculate the target date for this day
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  const isToday = workout.day_of_week === today;
  
  const todayDate = new Date();
  const todayDayIndex = todayDate.getDay();
  const targetDayIndex = days.indexOf(workout.day_of_week);
  let daysDifference = targetDayIndex - todayDayIndex;
  
  // If it's Sunday and we're past Sunday this week, go to next Sunday
  if (targetDayIndex === 0 && daysDifference < 0) {
    daysDifference += 7;
  }
  
  const targetDate = new Date(todayDate);
  targetDate.setDate(todayDate.getDate() + daysDifference);
  const formattedDate = targetDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const isPastDay = daysDifference < 0;
  const isFutureDay = daysDifference > 0;

  // Show "day completed" message if user has already completed a workout today
  if (dayCompleted) {
    return (
      <div className="workout-card">
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <div style={{ 
            fontSize: '0.9rem', 
            color: 'var(--text-secondary)', 
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            {formattedDate}
          </div>
          <h2 className="gradient-text-primary" style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem'
          }}>
            Your workout for {workout.day_of_week} was completed. Nice job!
          </h2>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: '2rem',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            {isToday ? (
              <>
                You've already completed a workout today. Great job! 🎉
                <br />
                Come back tomorrow for your next workout.
              </>
            ) : (
              <>
                You completed this workout on its scheduled day. 🎉
                <br />
                Keep up the great work!
              </>
            )}
          </p>
          {isToday && (
            <button 
              onClick={handleResetWorkout}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              🔄 Do This Workout Again!
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // Show "future workout" message for future days
  if (isFutureDay) {
    return (
      <div className="workout-card">
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏰</div>
          <div style={{ 
            fontSize: '0.9rem', 
            color: 'var(--text-secondary)', 
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            {formattedDate}
          </div>
          <h2 className="gradient-text-primary" style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem'
          }}>
            Come back tomorrow to see this workout!
          </h2>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: '2rem',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            This workout is scheduled for {workout.day_of_week}. 
            <br />
            Focus on today's workout first! 💪
          </p>
        </div>
      </div>
    );
  }

  // Show "missed workout" message for past days with no completed workout
  if (isPastDay && !hasCompletedWorkoutForDay) {
    return (
      <div className="workout-card">
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😔</div>
          <div style={{ 
            fontSize: '0.9rem', 
            color: 'var(--text-secondary)', 
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            {formattedDate}
          </div>
          <h2 className="gradient-text-error" style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem'
          }}>
            Oh no! You missed the workout this day.
          </h2>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: '2rem',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            That's okay - hit today's workout and get back at it! 💪
            <br />
            Every day is a new opportunity to crush your goals.
          </p>
        </div>
      </div>
    );
  }

  const allExercisesComplete = getCompletedExercises() === getTotalExercises() && getTotalExercises() > 0;

  return (
    <div className="workout-card">
      {(workoutStarted || hasExistingProgress) && (
        <>
          <div className="progress-bar-container">
            <div className="progress-info">
              <span>Progress: {getCompletedExercises()} / {getTotalExercises()} exercises</span>
              <span>{Math.round((getCompletedExercises() / getTotalExercises()) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(getCompletedExercises() / getTotalExercises()) * 100}%` }}
              />
            </div>
          </div>

          {/* Action buttons below progress bar */}
          <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            {workoutStarted && allExercisesComplete && (
              <button 
                className="finish-workout-btn" 
                onClick={handleFinishWorkout}
                disabled={isSaving}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.5 : 1,
                  width: '100%',
                  maxWidth: '300px',
                }}
              >
                {isSaving ? '💾 Saving...' : '✅ Finish Workout'}
              </button>
            )}
            
            <button 
              className="reset-workout-btn" 
              onClick={handleResetWorkout}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '300px',
              }}
            >
              {hasExistingProgress && !workoutStarted ? '🔄 Do It Again' : '🔄 Reset Workout'}
            </button>
          </div>
        </>
      )}

      <div className="workout-header">
        <h2>{workout.day_of_week}</h2>
        <div className="workout-meta">
          <span className="workout-type">{workout.workout_type}</span>
          <span className="workout-duration">⏱️ {workout.duration} min</span>
        </div>
      </div>

      {hasExistingProgress && !workoutStarted && (
        <div className="workout-instructions" style={{ background: '#10b981', color: 'white' }}>
          <p>✅ You've already completed this workout for the day! Tap exercises to update.</p>
        </div>
      )}

      {workoutStarted && (
        <div className="workout-instructions">
          <p>💡 Tap each exercise after completing a set</p>
        </div>
      )}

      <div className="workout-body">
        {renderExercises()}
      </div>

      {workout.notes && (
        <div className="workout-notes">
          <strong>💡 Notes:</strong> {workout.notes}
        </div>
      )}
    </div>
  );
};

export default WorkoutCard;

