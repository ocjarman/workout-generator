import React from "react";
import "./workout-history.css";

interface WorkoutHistoryProps {
  history: HistoryItem[];
}

interface HistoryItem {
  id: number;
  workout_date: string;
  day_of_week: string;
  workout_type: string;
  total_duration: number;
  completed: boolean;
  completed_exercises: any;
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ history }) => {
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const getCompletedExercisesCount = (completedExercises: any) => {
    if (!completedExercises || typeof completedExercises !== "object") {
      return 0;
    }
    return Object.keys(completedExercises).length;
  };

  if (history.length === 0) {
    return (
      <div className="history-empty">
        <div className="empty-icon">📊</div>
        <h3>No workout history yet</h3>
        <p>Complete a workout to see it here!</p>
      </div>
    );
  }

  return (
    <div className="workout-history">
      <h2 className="history-title">Your Workout History</h2>
      <div className="history-grid">
        {history.map((item) => (
          <div key={item.id} className="history-card">
            <div className="history-card-header">
              <div className="history-date">
                {formatDate(item.workout_date)}
              </div>
              <div className="history-day">{item.day_of_week}</div>
            </div>
            <div className="history-card-body">
              <div className="history-type">{item.workout_type}</div>
              <div className="history-stats">
                <div className="history-stat">
                  <span className="stat-icon">⏱️</span>
                  <span className="stat-text">
                    {formatDuration(item.total_duration)}
                  </span>
                </div>
                <div className="history-stat">
                  <span className="stat-icon">✅</span>
                  <span className="stat-text">
                    {getCompletedExercisesCount(item.completed_exercises)}{" "}
                    exercises
                  </span>
                </div>
              </div>
            </div>
            {item.completed && (
              <div className="history-badge">
                <span className="badge-icon">🎉</span>
                <span>Completed</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutHistory;
