import { pool, createTables } from './database.js';

const workouts = [
  // MONDAY VARIATIONS - Lower Body Strength + HIIT
  {
    day_of_week: 'Monday',
    day_number: 1,
    workout_type: 'Lower Body Strength + HIIT',
    duration: 60,
    exercises: {
      strength: [
        { name: 'Squats', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Romanian Deadlifts', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'Leg Press', sets: 3, reps: '12-15', rest: '60s' },
        { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: '60s' },
        { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60s' }
      ],
      hiit: [
        { name: 'Jump Squats', duration: '30s work, 30s rest', rounds: 8 },
        { name: 'Mountain Climbers', duration: '30s work, 30s rest', rounds: 8 },
        { name: 'Burpees', duration: '30s work, 30s rest', rounds: 4 }
      ]
    },
    notes: 'Focus on form. Warm up 5-10 minutes before starting.'
  },
  {
    day_of_week: 'Monday',
    day_number: 1,
    workout_type: 'Lower Body Strength + HIIT',
    duration: 60,
    exercises: {
      strength: [
        { name: 'Front Squats', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Conventional Deadlifts', sets: 4, reps: '6-8', rest: '120s' },
        { name: 'Hack Squats', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Step-Ups', sets: 3, reps: '10 each leg', rest: '60s' },
        { name: 'Seated Leg Curls', sets: 3, reps: '12-15', rest: '60s' }
      ],
      hiit: [
        { name: 'Box Jumps', duration: '30s work, 30s rest', rounds: 8 },
        { name: 'Sprint in Place', duration: '30s work, 30s rest', rounds: 8 },
        { name: 'Jump Lunges', duration: '30s work, 30s rest', rounds: 4 }
      ]
    },
    notes: 'Focus on explosive power. Keep HIIT intensity high.'
  },
  {
    day_of_week: 'Monday',
    day_number: 1,
    workout_type: 'Lower Body Strength + HIIT',
    duration: 60,
    exercises: {
      strength: [
        { name: 'Goblet Squats', sets: 4, reps: '12-15', rest: '60s' },
        { name: 'Single-Leg Romanian Deadlifts', sets: 4, reps: '10 each leg', rest: '90s' },
        { name: 'Leg Extensions', sets: 3, reps: '15-20', rest: '45s' },
        { name: 'Reverse Lunges', sets: 3, reps: '12 each leg', rest: '60s' },
        { name: 'Standing Leg Curls', sets: 3, reps: '12-15 each leg', rest: '60s' }
      ],
      hiit: [
        { name: 'Squat Jumps', duration: '30s work, 30s rest', rounds: 8 },
        { name: 'High Knees', duration: '30s work, 30s rest', rounds: 8 },
        { name: 'Plank Jacks', duration: '30s work, 30s rest', rounds: 4 }
      ]
    },
    notes: 'Focus on unilateral leg strength. Control the tempo.'
  },
  {
    day_of_week: 'Monday',
    day_number: 1,
    workout_type: 'Lower Body Strength + HIIT',
    duration: 60,
    exercises: {
      strength: [
        { name: 'Pause Squats', sets: 4, reps: '6-8', rest: '120s' },
        { name: 'Stiff-Leg Deadlifts', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'Smith Machine Squats', sets: 3, reps: '12-15', rest: '60s' },
        { name: 'Bulgarian Split Squats', sets: 3, reps: '10 each leg', rest: '75s' },
        { name: 'Lying Leg Curls', sets: 3, reps: '12-15', rest: '60s' }
      ],
      hiit: [
        { name: 'Kettlebell Swings', duration: '30s work, 30s rest', rounds: 8 },
        { name: 'Burpee Box Step-Ups', duration: '30s work, 30s rest', rounds: 6 },
        { name: 'Mountain Climbers', duration: '30s work, 30s rest', rounds: 6 }
      ]
    },
    notes: 'Pause at the bottom of squats for 2 seconds. Control eccentric movements.'
  },
  // TUESDAY VARIATIONS - Upper Body Strength + Core
  {
    day_of_week: 'Tuesday',
    day_number: 2,
    workout_type: 'Upper Body Strength + Core',
    duration: 55,
    exercises: {
      strength: [
        { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Bent Over Rows', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Pull-ups/Lat Pulldown', sets: 3, reps: '8-12', rest: '60s' },
        { name: 'Dumbbell Flyes', sets: 3, reps: '12-15', rest: '60s' }
      ],
      core: [
        { name: 'Plank', sets: 3, duration: '45-60s', rest: '30s' },
        { name: 'Russian Twists', sets: 3, reps: '20 each side', rest: '30s' },
        { name: 'Dead Bug', sets: 3, reps: '12 each side', rest: '30s' },
        { name: 'Bicycle Crunches', sets: 3, reps: '20 each side', rest: '30s' }
      ]
    },
    notes: 'Keep core engaged throughout all exercises.'
  },
  {
    day_of_week: 'Tuesday',
    day_number: 2,
    workout_type: 'Upper Body Strength + Core',
    duration: 55,
    exercises: {
      strength: [
        { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'T-Bar Rows', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'Dumbbell Lateral Raises', sets: 3, reps: '12-15', rest: '60s' },
        { name: 'Cable Face Pulls', sets: 3, reps: '15-20', rest: '45s' },
        { name: 'Push-ups (Weighted)', sets: 3, reps: '12-15', rest: '60s' }
      ],
      core: [
        { name: 'Side Plank', sets: 3, duration: '30-45s each side', rest: '30s' },
        { name: 'Cable Woodchops', sets: 3, reps: '15 each side', rest: '30s' },
        { name: 'Hanging Knee Raises', sets: 3, reps: '12-15', rest: '30s' },
        { name: 'Ab Wheel Rollouts', sets: 3, reps: '10-12', rest: '30s' }
      ]
    },
    notes: 'Focus on shoulder stability and rotational core strength.'
  },
  {
    day_of_week: 'Tuesday',
    day_number: 2,
    workout_type: 'Upper Body Strength + Core',
    duration: 55,
    exercises: {
      strength: [
        { name: 'Dumbbell Chest Press', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'Single-Arm Dumbbell Row', sets: 4, reps: '10 each arm', rest: '75s' },
        { name: 'Arnold Press', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Assisted Pull-ups/Chin-ups', sets: 3, reps: '8-12', rest: '60s' },
        { name: 'Cable Crossovers', sets: 3, reps: '12-15', rest: '60s' }
      ],
      core: [
        { name: 'Hollow Body Hold', sets: 3, duration: '30-45s', rest: '30s' },
        { name: 'V-Ups', sets: 3, reps: '12-15', rest: '30s' },
        { name: 'Bird Dog', sets: 3, reps: '10 each side', rest: '30s' },
        { name: 'Mountain Climbers', sets: 3, duration: '30s', rest: '30s' }
      ]
    },
    notes: 'Control the negative portion of each rep. Maintain neutral spine during core work.'
  },
  {
    day_of_week: 'Tuesday',
    day_number: 2,
    workout_type: 'Upper Body Strength + Core',
    duration: 55,
    exercises: {
      strength: [
        { name: 'Close-Grip Bench Press', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Pendlay Rows', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Seated Dumbbell Shoulder Press', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Wide-Grip Lat Pulldown', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Incline Dumbbell Flyes', sets: 3, reps: '12-15', rest: '60s' }
      ],
      core: [
        { name: 'Plank to Down Dog', sets: 3, reps: '12-15', rest: '30s' },
        { name: 'Pallof Press', sets: 3, reps: '12 each side', rest: '30s' },
        { name: 'Reverse Crunches', sets: 3, reps: '15-20', rest: '30s' },
        { name: 'Toe Touches', sets: 3, reps: '15-20', rest: '30s' }
      ]
    },
    notes: 'Focus on pulling scapula together during rows. Anti-rotation work with Pallof Press.'
  },
  // WEDNESDAY VARIATIONS - Steady State Cardio
  {
    day_of_week: 'Wednesday',
    day_number: 3,
    workout_type: 'Steady State Cardio',
    duration: 45,
    exercises: {
      cardio: [
        { 
          name: 'Walking (Outdoor/Treadmill)', 
          duration: '30-45 minutes',
          intensity: 'Moderate pace, able to hold conversation',
          incline: '0-3% if on treadmill'
        },
        { 
          name: 'Peloton Ride (Alternative)', 
          duration: '30-45 minutes',
          type: 'Low Impact or Scenic Ride',
          intensity: 'Zone 2 heart rate'
        }
      ]
    },
    notes: 'Recovery day - keep intensity moderate. Goal is movement, not exhaustion.'
  },
  {
    day_of_week: 'Wednesday',
    day_number: 3,
    workout_type: 'Steady State Cardio',
    duration: 45,
    exercises: {
      cardio: [
        { 
          name: 'Elliptical', 
          duration: '35-45 minutes',
          intensity: 'Moderate - Zone 2-3 heart rate',
          resistance: 'Medium resistance level'
        },
        { 
          name: 'Swimming (Alternative)', 
          duration: '30-40 minutes',
          type: 'Easy laps - freestyle or breaststroke',
          intensity: 'Comfortable, steady pace'
        }
      ]
    },
    notes: 'Low impact options great for joint recovery. Keep heart rate steady.'
  },
  {
    day_of_week: 'Wednesday',
    day_number: 3,
    workout_type: 'Steady State Cardio',
    duration: 45,
    exercises: {
      cardio: [
        { 
          name: 'Cycling (Outdoor/Stationary)', 
          duration: '40-50 minutes',
          intensity: 'Zone 2 - conversational pace',
          terrain: 'Flat to rolling hills'
        },
        { 
          name: 'Rowing Machine (Alternative)', 
          duration: '30-35 minutes',
          intensity: 'Steady, moderate effort',
          stroke_rate: '20-24 strokes per minute'
        }
      ]
    },
    notes: 'Focus on maintaining steady rhythm. Great for active recovery.'
  },
  {
    day_of_week: 'Wednesday',
    day_number: 3,
    workout_type: 'Steady State Cardio',
    duration: 45,
    exercises: {
      cardio: [
        { 
          name: 'Incline Walking', 
          duration: '30-40 minutes',
          intensity: 'Moderate pace with 5-8% incline',
          speed: '3.0-3.8 mph'
        },
        { 
          name: 'Stair Climber (Alternative)', 
          duration: '25-35 minutes',
          intensity: 'Steady, moderate pace',
          level: 'Medium resistance'
        }
      ]
    },
    notes: 'Hill work great for glute activation while staying low intensity.'
  },
  // THURSDAY VARIATIONS - Lower Body Strength + Glute Focus
  {
    day_of_week: 'Thursday',
    day_number: 4,
    workout_type: 'Lower Body Strength + Glute Focus',
    duration: 55,
    exercises: {
      strength: [
        { name: 'Hip Thrusts', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'Bulgarian Split Squats', sets: 3, reps: '12 each leg', rest: '60s' },
        { name: 'Sumo Deadlifts', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Cable Kickbacks', sets: 3, reps: '15 each leg', rest: '45s' },
        { name: 'Glute Bridge (weighted)', sets: 3, reps: '15-20', rest: '60s' }
      ],
      accessory: [
        { name: 'Fire Hydrants', sets: 3, reps: '20 each side', rest: '30s' },
        { name: 'Clamshells', sets: 3, reps: '20 each side', rest: '30s' },
        { name: 'Single Leg Glute Bridge', sets: 3, reps: '12 each leg', rest: '45s' }
      ]
    },
    notes: 'Really focus on glute activation. Use mind-muscle connection.'
  },
  {
    day_of_week: 'Thursday',
    day_number: 4,
    workout_type: 'Lower Body Strength + Glute Focus',
    duration: 55,
    exercises: {
      strength: [
        { name: 'Barbell Glute Bridge', sets: 4, reps: '12-15', rest: '90s' },
        { name: 'Walking Lunges', sets: 3, reps: '15 each leg', rest: '60s' },
        { name: 'Romanian Deadlifts', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'Smith Machine Hip Thrusts', sets: 3, reps: '12-15', rest: '90s' },
        { name: 'Leg Press (feet high and wide)', sets: 3, reps: '15-20', rest: '60s' }
      ],
      accessory: [
        { name: 'Banded Glute Kickbacks', sets: 3, reps: '20 each leg', rest: '30s' },
        { name: 'Frog Pumps', sets: 3, reps: '25-30', rest: '30s' },
        { name: 'Lateral Band Walks', sets: 3, reps: '15 each direction', rest: '30s' }
      ]
    },
    notes: 'Squeeze glutes at the top of each rep. Slow and controlled movements.'
  },
  {
    day_of_week: 'Thursday',
    day_number: 4,
    workout_type: 'Lower Body Strength + Glute Focus',
    duration: 55,
    exercises: {
      strength: [
        { name: 'Elevated Glute Bridge', sets: 4, reps: '12-15', rest: '90s' },
        { name: 'Reverse Lunges', sets: 3, reps: '12 each leg', rest: '60s' },
        { name: 'Single-Leg Deadlifts', sets: 4, reps: '10 each leg', rest: '75s' },
        { name: 'Cable Pull-Throughs', sets: 3, reps: '15-20', rest: '45s' },
        { name: 'Goblet Sumo Squats', sets: 3, reps: '15-20', rest: '60s' }
      ],
      accessory: [
        { name: 'Monster Walks', sets: 3, reps: '20 steps', rest: '30s' },
        { name: 'Donkey Kicks', sets: 3, reps: '20 each leg', rest: '30s' },
        { name: 'Glute Abduction Machine', sets: 3, reps: '15-20', rest: '30s' }
      ]
    },
    notes: 'Focus on hip extension and glute engagement. Keep tension on glutes throughout.'
  },
  {
    day_of_week: 'Thursday',
    day_number: 4,
    workout_type: 'Lower Body Strength + Glute Focus',
    duration: 55,
    exercises: {
      strength: [
        { name: 'Pause Hip Thrusts', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'Single-Leg Bulgarian Split Squats', sets: 3, reps: '10 each leg', rest: '75s' },
        { name: 'Trap Bar Deadlifts', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Deficit Reverse Lunges', sets: 3, reps: '12 each leg', rest: '60s' },
        { name: 'B-Stance Hip Thrusts', sets: 3, reps: '12 each side', rest: '60s' }
      ],
      accessory: [
        { name: 'Banded Clamshells', sets: 3, reps: '25 each side', rest: '30s' },
        { name: 'Single Leg Hip Thrusts', sets: 3, reps: '10 each leg', rest: '45s' },
        { name: 'Glute Kickbacks on Bench', sets: 3, reps: '15 each leg', rest: '30s' }
      ]
    },
    notes: 'Pause at peak contraction for 2 seconds. Maximum glute engagement.'
  },
  // FRIDAY VARIATIONS - Upper Body Strength + HIIT
  {
    day_of_week: 'Friday',
    day_number: 5,
    workout_type: 'Upper Body Strength + HIIT',
    duration: 60,
    exercises: {
      strength: [
        { name: 'Incline Dumbbell Press', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Cable Rows', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'Arnold Press', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '45s' },
        { name: 'Tricep Dips', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: '45s' }
      ],
      hiit: [
        { name: 'Battle Ropes', duration: '30s work, 30s rest', rounds: 6 },
        { name: 'Push-up to T', duration: '30s work, 30s rest', rounds: 6 },
        { name: 'High Knees', duration: '30s work, 30s rest', rounds: 4 }
      ]
    },
    notes: 'End the week strong! Focus on explosive movements during HIIT.'
  },
  {
    day_of_week: 'Friday',
    day_number: 5,
    workout_type: 'Upper Body Strength + HIIT',
    duration: 60,
    exercises: {
      strength: [
        { name: 'Flat Dumbbell Press', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'Inverted Rows', sets: 4, reps: '12-15', rest: '60s' },
        { name: 'Military Press', sets: 3, reps: '8-10', rest: '90s' },
        { name: 'Rear Delt Flyes', sets: 3, reps: '15-20', rest: '45s' },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: '60s' },
        { name: 'Hammer Curls', sets: 3, reps: '12-15', rest: '45s' }
      ],
      hiit: [
        { name: 'Med Ball Slams', duration: '30s work, 30s rest', rounds: 6 },
        { name: 'Burpees', duration: '30s work, 30s rest', rounds: 6 },
        { name: 'Jumping Jacks', duration: '30s work, 30s rest', rounds: 4 }
      ]
    },
    notes: 'Focus on time under tension. Finish strong with explosive HIIT.'
  },
  {
    day_of_week: 'Friday',
    day_number: 5,
    workout_type: 'Upper Body Strength + HIIT',
    duration: 60,
    exercises: {
      strength: [
        { name: 'Decline Barbell Press', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Chest-Supported Row', sets: 4, reps: '10-12', rest: '90s' },
        { name: 'Dumbbell Push Press', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Cable Face Pulls', sets: 3, reps: '15-20', rest: '45s' },
        { name: 'Close-Grip Push-ups', sets: 3, reps: '12-15', rest: '60s' },
        { name: 'Cable Bicep Curls', sets: 3, reps: '12-15', rest: '45s' }
      ],
      hiit: [
        { name: 'Kettlebell Swings', duration: '30s work, 30s rest', rounds: 8 },
        { name: 'Plank to Push-up', duration: '30s work, 30s rest', rounds: 6 },
        { name: 'Mountain Climbers', duration: '30s work, 30s rest', rounds: 4 }
      ]
    },
    notes: 'Full range of motion on all exercises. Maximum effort on HIIT finisher.'
  },
  {
    day_of_week: 'Friday',
    day_number: 5,
    workout_type: 'Upper Body Strength + HIIT',
    duration: 60,
    exercises: {
      strength: [
        { name: 'Push-ups (Weighted)', sets: 4, reps: '15-20', rest: '60s' },
        { name: 'Renegade Rows', sets: 4, reps: '10 each arm', rest: '90s' },
        { name: 'Landmine Press', sets: 3, reps: '10-12 each arm', rest: '60s' },
        { name: 'Band Pull-Aparts', sets: 3, reps: '20-25', rest: '30s' },
        { name: 'Diamond Push-ups', sets: 3, reps: '12-15', rest: '60s' },
        { name: 'Concentration Curls', sets: 3, reps: '12-15 each arm', rest: '45s' }
      ],
      hiit: [
        { name: 'Box Jumps', duration: '30s work, 30s rest', rounds: 6 },
        { name: 'Sprawls', duration: '30s work, 30s rest', rounds: 6 },
        { name: 'Skater Hops', duration: '30s work, 30s rest', rounds: 4 }
      ]
    },
    notes: 'Functional upper body movements. Keep core tight during all exercises.'
  },
  // SATURDAY VARIATIONS - Long Run
  {
    day_of_week: 'Saturday',
    day_number: 6,
    workout_type: 'Long Run',
    duration: 40,
    exercises: {
      running: [
        { 
          name: 'Outdoor/Treadmill Run',
          distance: '4-5 miles',
          pace: 'Comfortable, conversational pace',
          notes: 'Start with 5 min easy jog warmup'
        }
      ],
      stretching: [
        { name: 'Hip Flexor Stretch', duration: '30s each side' },
        { name: 'Quad Stretch', duration: '30s each side' },
        { name: 'Hamstring Stretch', duration: '30s each side' },
        { name: 'Calf Stretch', duration: '30s each side' }
      ]
    },
    notes: 'Hydrate well. Cool down with 5 min walk and stretching.'
  },
  {
    day_of_week: 'Saturday',
    day_number: 6,
    workout_type: 'Long Run',
    duration: 50,
    exercises: {
      running: [
        { 
          name: 'Trail Run',
          distance: '5-6 miles',
          pace: 'Easy to moderate - adjust for terrain',
          notes: 'Variable terrain for added challenge'
        }
      ],
      stretching: [
        { name: 'IT Band Stretch', duration: '30s each side' },
        { name: 'Pigeon Pose', duration: '45s each side' },
        { name: 'Standing Quad Stretch', duration: '30s each side' },
        { name: 'Downward Dog', duration: '45s' }
      ]
    },
    notes: 'Trail running builds stability. Focus on foot placement and enjoy nature.'
  },
  {
    day_of_week: 'Saturday',
    day_number: 6,
    workout_type: 'Long Run',
    duration: 45,
    exercises: {
      running: [
        { 
          name: 'Progressive Run',
          distance: '4-5 miles',
          pace: 'Start easy, build to moderate in final mile',
          notes: 'Negative split - second half faster than first'
        }
      ],
      stretching: [
        { name: 'Figure Four Stretch', duration: '30s each side' },
        { name: 'Seated Hamstring Stretch', duration: '45s each side' },
        { name: 'Calf Raises into Stretch', duration: '10 reps + 30s hold' },
        { name: 'Butterfly Stretch', duration: '45s' }
      ]
    },
    notes: 'Build pace gradually. Listen to your body and finish strong.'
  },
  {
    day_of_week: 'Saturday',
    day_number: 6,
    workout_type: 'Long Run',
    duration: 55,
    exercises: {
      running: [
        { 
          name: 'Interval Long Run',
          distance: '5-6 miles',
          pace: 'Easy pace with 4x 1-minute pickups',
          notes: 'Faster pickups at miles 2, 3, 4, and 5'
        }
      ],
      stretching: [
        { name: 'Lizard Pose', duration: '30s each side' },
        { name: 'Low Lunge with Quad Pull', duration: '30s each side' },
        { name: 'Seated Forward Fold', duration: '45s' },
        { name: 'Ankle Circles', duration: '20 circles each direction' }
      ]
    },
    notes: 'Pickups should be comfortably hard, not all-out. Recover fully between.'
  },
  // SUNDAY VARIATIONS - Rest Day / Active Recovery
  {
    day_of_week: 'Sunday',
    day_number: 0,
    workout_type: 'Rest Day / Active Recovery',
    duration: 30,
    exercises: {
      yoga: [
        { name: 'Gentle Yoga Flow', duration: '20-30 minutes', type: 'Yin or Restorative' },
        { name: 'Foam Rolling', duration: '10-15 minutes', focus: 'Full body' }
      ],
      optional: [
        { name: 'Light Walk', duration: '20-30 minutes' },
        { name: 'Meditation', duration: '10-15 minutes' }
      ]
    },
    notes: 'Complete rest or very light activity. Focus on recovery and mobility.'
  },
  {
    day_of_week: 'Sunday',
    day_number: 0,
    workout_type: 'Rest Day / Active Recovery',
    duration: 40,
    exercises: {
      mobility: [
        { name: 'Dynamic Stretching Routine', duration: '15 minutes', focus: 'Hip and shoulder mobility' },
        { name: 'Lacrosse Ball Rolling', duration: '15 minutes', focus: 'Glutes, IT band, shoulders' }
      ],
      optional: [
        { name: 'Nature Walk', duration: '30-40 minutes' },
        { name: 'Gentle Swimming', duration: '20-30 minutes' }
      ]
    },
    notes: 'Focus on areas that feel tight. Prioritize recovery for next week.'
  },
  {
    day_of_week: 'Sunday',
    day_number: 0,
    workout_type: 'Rest Day / Active Recovery',
    duration: 45,
    exercises: {
      yoga: [
        { name: 'Vinyasa Flow (Easy)', duration: '30 minutes', type: 'Focus on breath and flow' },
        { name: 'Savasana & Meditation', duration: '10-15 minutes', type: 'Deep relaxation' }
      ],
      optional: [
        { name: 'Epsom Salt Bath', duration: '20 minutes' },
        { name: 'Journaling', duration: '10-15 minutes' }
      ]
    },
    notes: 'Mind-body connection. Reflect on the week and prepare mentally for the next.'
  },
  {
    day_of_week: 'Sunday',
    day_number: 0,
    workout_type: 'Rest Day / Active Recovery',
    duration: 35,
    exercises: {
      recovery: [
        { name: 'Full Body Foam Rolling', duration: '20 minutes', focus: 'All major muscle groups' },
        { name: 'Static Stretching', duration: '15 minutes', focus: 'Hold stretches 45-60s' }
      ],
      optional: [
        { name: 'Bike Ride (Very Easy)', duration: '20-30 minutes' },
        { name: 'Breathing Exercises', duration: '10 minutes' }
      ]
    },
    notes: 'Complete recovery day. No intensity - just movement and release.'
  }
];

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    // Create tables first
    await createTables();
    
    // Clear existing data
    await client.query('DELETE FROM workouts');
    
    // Insert workout data
    for (const workout of workouts) {
      await client.query(
        `INSERT INTO workouts (day_of_week, day_number, workout_type, exercises, duration, notes)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          workout.day_of_week,
          workout.day_number,
          workout.workout_type,
          JSON.stringify(workout.exercises),
          workout.duration,
          workout.notes
        ]
      );
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();

