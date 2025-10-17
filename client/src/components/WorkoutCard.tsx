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
}

interface ExerciseCompletion {
  [key: string]: number; // category-index: completedSets
}

const WorkoutCard: React.FC<WorkoutProps> = ({ workout, workoutStarted, workoutStartTime, auth0Id, onWorkoutComplete }) => {
  const [completedSets, setCompletedSets] = useState<ExerciseCompletion>({});
  const [showCompletion, setShowCompletion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  // Check if all exercises are complete
  useEffect(() => {
    if (workoutStarted && getCompletedExercises() === getTotalExercises() && getTotalExercises() > 0) {
      setShowCompletion(true);
    }
  }, [completedSets, workoutStarted]);

  // Reset completion when workout changes or is reset
  useEffect(() => {
    if (!workoutStarted) {
      setCompletedSets({});
      setShowCompletion(false);
    }
  }, [workoutStarted, workout.day_of_week]);

  const handleExerciseClick = (category: string, index: number, exercise: any) => {
    if (!workoutStarted) {
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
                  className={`exercise-item ${workoutStarted ? 'clickable' : ''} ${isComplete ? 'completed' : ''} ${isAlternative ? 'alternative' : ''}`}
                  onClick={() => handleExerciseClick(category, index, exercise)}
                >
                  <div className="exercise-header-row">
                    <div className="exercise-name">
                      {isAlternative && <span className="alternative-dot">○</span>}
                      {exercise.name}
                    </div>
                    {workoutStarted && (
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
        });
        
        if (response.ok) {
          console.log('✅ Workout progress saved!');
          toast.success('Workout saved to your history! 🎉');
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
    onWorkoutComplete();
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
            onClick={handleFinishWorkout}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Finish Workout'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-card">
      {workoutStarted && (
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
      )}

      <div className="workout-header">
        <h2>{workout.day_of_week}</h2>
        <div className="workout-meta">
          <span className="workout-type">{workout.workout_type}</span>
          <span className="workout-duration">⏱️ {workout.duration} min</span>
        </div>
      </div>

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

