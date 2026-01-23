import React from "react";
import "./weekly-view.css";

interface Workout {
  id: number;
  day_of_week: string;
  day_number: number;
  workout_type: string;
  duration: number;
}

interface WeeklyViewProps {
  workouts: Workout[];
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ workouts }) => {
  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const sortedWorkouts = [...workouts].sort((a, b) => {
    return daysOrder.indexOf(a.day_of_week) - daysOrder.indexOf(b.day_of_week);
  });

  const getEmoji = (type: string) => {
    if (type.toLowerCase().includes("strength")) return "💪";
    if (type.toLowerCase().includes("cardio")) return "🏃";
    if (type.toLowerCase().includes("run")) return "🏃‍♀️";
    if (
      type.toLowerCase().includes("rest") ||
      type.toLowerCase().includes("yoga")
    )
      return "🧘‍♀️";
    return "🏋️";
  };

  return (
    <div className="weekly-view">
      <h2>Weekly Schedule Overview</h2>
      <div className="weekly-grid">
        {sortedWorkouts.map((workout) => (
          <div key={workout.id} className="weekly-day-card">
            <div className="day-header">
              <span className="day-name">{workout.day_of_week}</span>
              <span className="day-emoji">
                {getEmoji(workout.workout_type)}
              </span>
            </div>
            <div className="day-type">{workout.workout_type}</div>
            <div className="day-duration">⏱️ {workout.duration} min</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyView;
