import React, { useState, useEffect } from 'react';
import './WorkoutCard.css';

interface WorkoutProps {
  workout: {
    day_of_week: string;
    workout_type: string;
    exercises: any;
    duration: number;
    notes: string;
  };
  workoutStarted: boolean;
  onWorkoutComplete: () => void;
}

interface ExerciseCompletion {
  [key: string]: number; // category-index: completedSets
}

const WorkoutCard: React.FC<WorkoutProps> = ({ workout, workoutStarted, onWorkoutComplete }) => {
  const [completedSets, setCompletedSets] = useState<ExerciseCompletion>({});
  const [showCompletion, setShowCompletion] = useState(false);

  // Calculate total exercises and completed
  const getTotalExercises = () => {
    let total = 0;
    Object.keys(workout.exercises).forEach((category) => {
      total += workout.exercises[category].length;
    });
    return total;
  };

  const getCompletedExercises = () => {
    return Object.keys(completedSets).length;
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
    if (!workoutStarted) return;
    
    const key = `${category}-${index}`;
    const totalSets = exercise.sets || exercise.rounds || 1;
    const currentCompleted = completedSets[key] || 0;
    
    if (currentCompleted < totalSets) {
      setCompletedSets({
        ...completedSets,
        [key]: currentCompleted + 1
      });
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
      
      sections.push(
        <div key={category} className="exercise-category">
          <h3 className="category-title">{category.toUpperCase()}</h3>
          <div className="exercise-list">
            {categoryExercises.map((exercise: any, index: number) => {
              const isComplete = isExerciseComplete(category, index, exercise);
              const progress = getExerciseProgress(category, index, exercise);
              
              return (
                <div 
                  key={index} 
                  className={`exercise-item ${workoutStarted ? 'clickable' : ''} ${isComplete ? 'completed' : ''}`}
                  onClick={() => handleExerciseClick(category, index, exercise)}
                >
                  <div className="exercise-header-row">
                    <div className="exercise-name">{exercise.name}</div>
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
          <button className="completion-btn" onClick={onWorkoutComplete}>
            Finish Workout
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

