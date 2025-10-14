import React from 'react';
import './WorkoutCard.css';

interface WorkoutProps {
  workout: {
    day_of_week: string;
    workout_type: string;
    exercises: any;
    duration: number;
    notes: string;
  };
}

const WorkoutCard: React.FC<WorkoutProps> = ({ workout }) => {
  const renderExercises = () => {
    const exercises = workout.exercises;
    const sections = [];

    // Render different exercise types
    Object.keys(exercises).forEach((category) => {
      const categoryExercises = exercises[category];
      
      sections.push(
        <div key={category} className="exercise-category">
          <h3 className="category-title">{category.toUpperCase()}</h3>
          <div className="exercise-list">
            {categoryExercises.map((exercise: any, index: number) => (
              <div key={index} className="exercise-item">
                <div className="exercise-name">{exercise.name}</div>
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
            ))}
          </div>
        </div>
      );
    });

    return sections;
  };

  return (
    <div className="workout-card">
      <div className="workout-header">
        <h2>{workout.day_of_week}</h2>
        <div className="workout-meta">
          <span className="workout-type">{workout.workout_type}</span>
          <span className="workout-duration">⏱️ {workout.duration} min</span>
        </div>
      </div>

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

