import { useState } from 'react';
import { EXERCISE_CONFIGS, STATE_COLORS } from './exerciseConfigs';

const ExerciseSelector = ({ exercises, onSelect }) => {
    const [customSettings, setCustomSettings] = useState({});
  
    const handleSettingChange = (exerciseId, field, value) => {
      setCustomSettings(prev => ({
        ...prev,
        [exerciseId]: {
          ...prev[exerciseId],
          [field]: parseInt(value) || 0
        }
      }));
    };
  
    return (
      <div className="exercise-selector">
        <h3>Select Individual Exercises</h3>
        <div className="exercise-grid">
          {exercises.map(exercise => {
            const settings = customSettings[exercise.id] || {};
            return (
              <div key={exercise.id} className="exercise-card">
                <h4>{exercise.name}</h4>
                <p>{EXERCISE_CONFIGS[exercise.id]?.muscles}</p>
                
                {exercise.reps ? (
                  <div className="custom-controls">
                    <label>
                      Reps:
                      <input
                        type="number"
                        value={settings.reps || 10}
                        onChange={(e) => handleSettingChange(exercise.id, 'reps', e.target.value)}
                        min="1"
                      />
                    </label>
                    <label>
                      Sets:
                      <input
                        type="number"
                        value={settings.sets || 3}
                        onChange={(e) => handleSettingChange(exercise.id, 'sets', e.target.value)}
                        min="1"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="custom-controls">
                    <label>
                      Duration (sec):
                      <input
                        type="number"
                        value={settings.duration || 30}
                        onChange={(e) => handleSettingChange(exercise.id, 'duration', e.target.value)}
                        min="10"
                      />
                    </label>
                  </div>
                )}
                
                <button onClick={() => onSelect({
                  ...exercise,
                  reps: exercise.reps ? settings.reps : undefined,
                  sets: exercise.reps ? settings.sets : undefined,
                  duration: exercise.duration ? settings.duration : undefined
                })}>
                  Add to Workout
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

export default ExerciseSelector;