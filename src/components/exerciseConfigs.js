export const EXERCISE_CONFIGS = {
  bicep_curl: { 
    start_state: 'down', 
    up_angle: 50, 
    down_angle: 160,
    instructions: 'Keep elbows close to body, curl slowly up and down',
    muscles: 'Biceps, Forearms',
    caloriesPerUnit: 0.5,
    defaultReps: 10,
    defaultSets: 3
  },
  squat: { 
    start_state: 'up', 
    up_angle: 160, 
    down_angle: 80,
    instructions: 'Keep chest up, push through heels, knees over toes',
    muscles: 'Quads, Glutes, Hamstrings',
    caloriesPerUnit: 0.5,
    defaultReps: 10,
    defaultSets: 3
  },
  push_up: { 
    start_state: 'up', 
    up_angle: 170, 
    down_angle: 90,
    instructions: 'Maintain straight body line, lower chest to floor',
    muscles: 'Chest, Shoulders, Triceps',
    caloriesPerUnit: 0.5,
    defaultReps: 10,
    defaultSets: 3
  },
  shoulder_press: { 
    start_state: 'down', 
    up_angle: 60, 
    down_angle: 150,
    instructions: 'Press straight up, avoid arching back',
    muscles: 'Shoulders, Triceps',
    caloriesPerUnit: 0.5,
    defaultReps: 10,
    defaultSets: 3
  },
  plank: {
    start_state: 'neutral',
    instructions: 'Keep body straight, engage core',
    muscles: 'Core, Shoulders',
    caloriesPerUnit: 0.5,
    defaultReps: 10,
    defaultSets: 3
  },
  pull_up: {
    start_state: 'down',
    up_angle: 30,
    down_angle: 160,
    instructions: 'Pull your chin over the bar, control the descent',
    muscles: 'Back, Biceps',
    caloriesPerUnit: 0.5,
    defaultReps: 10,
    defaultSets: 3
  },
  lunge: {
    start_state: 'up',
    up_angle: 180,
    down_angle: 90,
    instructions: 'Keep torso upright, lower until back knee nearly touches ground',
    muscles: 'Quads, Glutes, Hamstrings',
    caloriesPerUnit: 0.5,
    defaultReps: 10,
    defaultSets: 3
  },
  jumping_jacks: {
    start_state: 'neutral',
    instructions: 'Jump while spreading legs and raising arms',
    muscles: 'Full body cardio',
    caloriesPerUnit: 0.5,
    defaultReps: 10,
    defaultSets: 3
  },
  burpees: {
    start_state: 'neutral',
    instructions: 'Squat down, kick back to plank, return to squat and jump',
    muscles: 'Full body explosive',
    caloriesPerUnit: 0.5,
    defaultReps: 10,
    defaultSets: 3
  },
  mountain_climbers: {
    start_state: 'neutral',
    instructions: 'Alternate bringing knees to chest while in plank position',
    muscles: 'Core, Cardio',
    caloriesPerUnit: 0.5,
    defaultReps: 10,
    defaultSets: 3
  },
  default: {
    start_state: 'neutral',
    up_angle: 60,
    down_angle: 120,
    instructions: 'Perform exercise with proper form',
    muscles: 'Multiple muscles',
    caloriesPerUnit: 0.5,
    defaultReps: 10,
    defaultSets: 3
  }

};

export const STATE_COLORS = {
  up: '#00ff00',
  down: '#ff0000',
  neutral: '#00ffff'
};
