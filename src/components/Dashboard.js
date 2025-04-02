
import { EXERCISE_CONFIGS, STATE_COLORS } from './exerciseConfigs';
import { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { supabase } from '../supabaseClient';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Confetti from 'react-confetti';
import ReactPlayer from 'react-player';
import ExerciseSelector from './ExerciseSelector';
import CustomPoseDetector from './CustomPoseDetector';


// Workout plans with video demonstrations
const workoutCategories = {
  fullBody: {
    name: 'Full Body Workouts',
    plans: [
      {
        id: 'beginner_fullbody',
        name: 'Beginner Full Body',
        category: 'fullBody',
        description: 'Perfect for starters - builds foundational strength',
        exercises: [
          { id: 'squat', name: 'Bodyweight Squat', reps: 12, sets: 3, video: 'https://www.youtube.com/watch?v=aclHkVaku9U' },
          { id: 'push_up', name: 'Knee Push-ups', reps: 8, sets: 3, video: 'https://www.youtube.com/watch?v=eFOSh8vpd8I' },
          { id: 'plank', name: 'Plank', duration: 30, sets: 3 }
        ],
        duration: 20,
        difficulty: 'Beginner',
        calories: 180,
        icon: '🆕'
      },
      {
        id: 'intermediate_fullbody',
        name: 'Intermediate Full Body',
        category: 'fullBody',
        description: 'Challenging full body routine',
        exercises: [
          { id: 'squat', name: 'Squats', reps: 15, sets: 4, video: 'https://www.youtube.com/watch?v=aclHkVaku9U' },
          { id: 'push_up', name: 'Push-ups', reps: 12, sets: 4, video: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
          { id: 'pull_up', name: 'Assisted Pull-ups', reps: 6, sets: 3, video: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
          { id: 'plank', name: 'Plank', duration: 45, sets: 3 }
        ],
        duration: 30,
        difficulty: 'Intermediate',
        calories: 250,
        icon: '💪'
      }
    ]
  },
  pushPullLegs: {
    name: 'Push-Pull-Legs',
    plans: [
      {
        id: 'intermediate_ppl',
        name: 'PPL Split',
        category: 'pushPullLegs',
        description: 'Classic push, pull, legs split for balanced development',
        exercises: [
          // Push day exercises
          { id: 'push_up', name: 'Push-ups', reps: 12, sets: 4, video: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
          { id: 'shoulder_press', name: 'Shoulder Press', reps: 10, sets: 3, video: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
          // Pull day exercises
          { id: 'pull_up', name: 'Pull-ups', reps: 8, sets: 3, video: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
          // Leg day exercises
          { id: 'squat', name: 'Squats', reps: 12, sets: 3, video: 'https://www.youtube.com/watch?v=aclHkVaku9U' },
          { id: 'lunge', name: 'Lunges', reps: 10, sets: 3, video: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U' }
        ],
        duration: 45,
        difficulty: 'Intermediate',
        calories: 300,
        icon: '🏋️'
      },
      {
        id: 'advanced_ppl',
        name: 'Advanced PPL',
        category: 'pushPullLegs',
        description: 'Intensive push/pull/legs for advanced lifters',
        exercises: [
          { id: 'push_up', name: 'Weighted Push-ups', reps: 10, sets: 4, video: 'https://www.youtube.com/watch?v=G1dS8iLzS9A' },
          { id: 'pull_up', name: 'Weighted Pull-ups', reps: 6, sets: 4, video: 'https://www.youtube.com/watch?v=Hdc7Mw6BIEE' },
          { id: 'squat', name: 'Bulgarian Split Squats', reps: 10, sets: 3, video: 'https://www.youtube.com/watch?v=2C-uNgKwPLE' }
        ],
        duration: 50,
        difficulty: 'Advanced',
        calories: 350,
        icon: '🔥'
      }
    ]
  },
  upperLower: {
    name: 'Upper/Lower Split',
    plans: [
      {
        id: 'intermediate_upper_lower',
        name: 'Upper/Lower Split',
        category: 'upperLower',
        description: 'Balanced upper and lower body focus',
        exercises: [
          // Upper body exercises
          { id: 'push_up', name: 'Push-ups', reps: 15, sets: 4, video: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
          { id: 'bicep_curl', name: 'Bicep Curls', reps: 12, sets: 3, video: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' },
          // Lower body exercises
          { id: 'squat', name: 'Squats', reps: 15, sets: 4, video: 'https://www.youtube.com/watch?v=aclHkVaku9U' },
          { id: 'lunge', name: 'Lunges', reps: 12, sets: 3, video: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U' }
        ],
        duration: 50,
        difficulty: 'Intermediate',
        calories: 320,
        icon: '⚖️'
      },
      {
        id: 'advanced_upper_lower',
        name: 'Advanced Upper/Lower',
        category: 'upperLower',
        description: 'High intensity upper/lower split',
        exercises: [
          { id: 'pull_up', name: 'Wide Grip Pull-ups', reps: 10, sets: 4, video: 'https://www.youtube.com/watch?v=Hdc7Mw6BIEE' },
          { id: 'push_up', name: 'Archer Push-ups', reps: 8, sets: 3, video: 'https://www.youtube.com/watch?v=9u5HzYgtf7E' },
          { id: 'squat', name: 'Jump Squats', reps: 15, sets: 3, video: 'https://www.youtube.com/watch?v=CVaEhXotL7M' }
        ],
        duration: 55,
        difficulty: 'Advanced',
        calories: 380,
        icon: '🚀'
      }
    ]
  },
  cardio: {
    name: 'Cardio & Conditioning',
    plans: [
      {
        id: 'hiit',
        name: 'HIIT Circuit',
        category: 'cardio',
        description: 'High intensity interval training',
        exercises: [
          { id: 'jumping_jacks', name: 'Jumping Jacks', duration: 30, sets: 3, video: 'https://www.youtube.com/watch?v=iSSAk4XCsRA' },
          { id: 'burpees', name: 'Burpees', reps: 10, sets: 3, video: 'https://www.youtube.com/watch?v=TU8QYVW0gDU' },
          { id: 'mountain_climbers', name: 'Mountain Climbers', duration: 30, sets: 3, video: 'https://www.youtube.com/watch?v=nmwgirgXLYM' }
        ],
        duration: 20,
        difficulty: 'Intermediate',
        calories: 250,
        icon: '🏃'
      }
    ]
  },
  individual: {
    name: 'Individual Exercises',
    plans: [
      {
        id: 'individual_exercises',
        name: 'Individual Exercises',
        category: 'individual',
        description: 'Practice specific exercises with custom rep goals',
        exercises: [
          { id: 'bicep_curl', name: 'Bicep Curls', reps: 10, sets: 3, video: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' },
          { id: 'squat', name: 'Squats', reps: 12, sets: 3, video: 'https://www.youtube.com/watch?v=aclHkVaku9U' },
          { id: 'shoulder_press', name: 'Shoulder Press', reps: 10, sets: 3, video: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
          { id: 'push_up', name: 'Push-ups', reps: 10, sets: 3, video: 'https://www.youtube.com/watch?v=IODxDxX7oi4' }
        ],
        duration: 20,
        difficulty: 'Custom',
        calories: 200,
        icon: '🏅'
      }
    ]
  }
};

const allExercises = [
  { id: 'squat', name: 'Squat', reps: 12, sets: 3, video: 'https://youtube.com/squat' },
  { id: 'push_up', name: 'Push-up', reps: 10, sets: 3, video: 'https://youtube.com/pushup' },
  { id: 'pull_up', name: 'Pull-up', reps: 8, sets: 3, video: 'https://youtube.com/pullup' },
  { id: 'lunge', name: 'Lunge', reps: 10, sets: 3, video: 'https://youtube.com/lunge' },
  { id: 'plank', name: 'Plank', duration: 30, sets: 3, video: 'https://youtube.com/plank' },
  { id: 'bicep_curl', name: 'Bicep Curl', reps: 12, sets: 3, video: 'https://youtube.com/bicepcurl' },
  { id: 'shoulder_press', name: 'Shoulder Press', reps: 10, sets: 3, video: 'https://youtube.com/shoulderpress' },
  { id: 'jumping_jacks', name: 'Jumping Jacks', duration: 30, sets: 3, video: 'https://youtube.com/jumpingjacks' },
  { id: 'burpees', name: 'Burpees', reps: 10, sets: 3, video: 'https://youtube.com/burpees' },
  { id: 'mountain_climbers', name: 'Mountain Climbers', duration: 30, sets: 3, video: 'https://youtube.com/mountainclimbers' }
];

export default function Dashboard() {
  const [goalReps, setGoalReps] = useState(10);
const [showRepInput, setShowRepInput] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  const [goalReached, setGoalReached] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customWorkout, setCustomWorkout] = useState([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [detectorType, setDetectorType] = useState('movenet'); // 'movenet' or 'blazepose'
  
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const animationRef = useRef(null);
  const timerRef = useRef(null);
  const sessionRef = useRef({
    state: 'down',
    count: 0,
    time: 0,
    config: null,
    exerciseIndex: 0
  });

  // Initialize session for current exercise
  const initializeSession = (exercise) => {
    if (!exercise || !EXERCISE_CONFIGS[exercise.id]) {
      setError('Invalid exercise configuration');
      return;
    }
    sessionRef.current = {
      state: EXERCISE_CONFIGS[exercise.id]?.start_state || 'neutral',
      count: 0,
      time: 0,
      config: {
        ...EXERCISE_CONFIGS[exercise.id],
        goal: exercise.reps || 0,
        duration: exercise.duration || 0
      },
      exerciseIndex: selectedPlan.exercises.findIndex(ex => ex.id === exercise.id)
    };
    setCount(0);
    setTime(0);
    setGoalReached(false);
    setError(null);
    setShowVideo(false);
  };

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Get user session
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Initialize TensorFlow.js model
  useEffect(() => {
    let isMounted = true;
    const initModel = async () => {
      try {
        await tf.setBackend('webgl').catch(async () => {
          console.warn('WebGL not available, falling back to CPU');
          await tf.setBackend('cpu');
        });
        
        await tf.ready();
        
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
            enableSmoothing: true
          }
        );
        
        if (isMounted) {
          detectorRef.current = detector;
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Model initialization failed:', err);
        if (isMounted) {
          setError(`Model failed to load: ${err.message}`);
          setIsLoading(false);
        }
      }
    };

    initModel();
    return () => {
      isMounted = false;
      if (detectorRef.current) {
        detectorRef.current.dispose();
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  useEffect(() => {
    if (currentExercise && detectorRef.current && isWebcamReady) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
  
    return () => {
      clearInterval(timerRef.current);
    };
  }, [currentExercise, isWebcamReady]);

  // Start/stop detection based on exercise selection
  useEffect(() => {
    if (!currentExercise || !detectorRef.current || !isWebcamReady) return;

    // Skip pose detection for custom workouts (handled by CustomPoseDetector)
    if (selectedPlan?.id.startsWith('custom')) return;

    initializeSession(currentExercise);
    let isDetecting = true;
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    // Set canvas to match video dimensions
    const resizeCanvas = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };
    resizeCanvas();

    // For timed exercises
    if (currentExercise.duration) {
      timerRef.current = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          if (newTime >= currentExercise.duration) {
            setGoalReached(true);
            clearInterval(timerRef.current);
          }
          return newTime;
        });
      }, 1000);
    }

    const detectPose = async () => {
      if (!isDetecting || !video.readyState || video.readyState < 2) {
        animationRef.current = requestAnimationFrame(detectPose);
        return;
      }

      try {
        const poses = await detectorRef.current.estimatePoses(video);
        const pose = poses[0];
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (pose && sessionRef.current.config) {
          drawPose(ctx, pose.keypoints);
          if (currentExercise.id !== 'plank') {
            processExercise(pose.keypoints);
          }
        }
      } catch (err) {
        console.error('Detection error:', err);
        setError('Pose detection failed');
      }

      if (isDetecting) {
        animationRef.current = requestAnimationFrame(detectPose);
      }
    };

    const detectionTimer = setTimeout(() => {
      animationRef.current = requestAnimationFrame(detectPose);
    }, 500);

    return () => {
      isDetecting = false;
      clearTimeout(detectionTimer);
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current);
    };
  }, [currentExercise, isWebcamReady, selectedPlan]);

  // Draw pose on canvas (for standard workouts)
  const drawPose = (ctx, keypoints) => {
    const currentState = sessionRef.current.state;
    const connectionColor = STATE_COLORS[currentState] || '#3a86ff';

    keypoints.forEach(keypoint => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = connectionColor;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    const connections = [
      ['left_shoulder', 'left_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'],
      ['right_knee', 'right_ankle']
    ];

    connections.forEach(([joint1, joint2]) => {
      const kp1 = keypoints.find(k => k.name === joint1);
      const kp2 = keypoints.find(k => k.name === joint2);

      if (kp1?.score > 0.3 && kp2?.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.lineWidth = 4;
        ctx.strokeStyle = connectionColor;
        ctx.stroke();
      }
    });
  };

  // Calculate angle between three points
  const calculateAngle = (a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180 / Math.PI);
    return angle > 180 ? 360 - angle : angle;
  };

  // Process exercise movements (for standard workouts)
  const processExercise = (keypoints) => {
    const session = sessionRef.current;
    if (!session.config || !currentExercise) return;

    let angle = 0;
    const exerciseId = currentExercise.id;

    try {
      switch (exerciseId) {
        case 'bicep_curl':
        case 'shoulder_press':
          const shoulder = keypoints.find(k => k.name === 'left_shoulder');
          const elbow = keypoints.find(k => k.name === 'left_elbow');
          const wrist = keypoints.find(k => k.name === 'left_wrist');
          
          if (shoulder?.score > 0.3 && elbow?.score > 0.3 && wrist?.score > 0.3) {
            angle = calculateAngle(shoulder, elbow, wrist);
          }
          break;

        case 'squat':
          const hip = keypoints.find(k => k.name === 'left_hip');
          const knee = keypoints.find(k => k.name === 'left_knee');
          const ankle = keypoints.find(k => k.name === 'left_ankle');
          
          if (hip?.score > 0.3 && knee?.score > 0.3 && ankle?.score > 0.3) {
            angle = calculateAngle(hip, knee, ankle);
          }
          break;

        case 'push_up':
          const pShoulder = keypoints.find(k => k.name === 'left_shoulder');
          const pElbow = keypoints.find(k => k.name === 'left_elbow');
          const pWrist = keypoints.find(k => k.name === 'left_wrist');
          
          if (pShoulder?.score > 0.3 && pElbow?.score > 0.3 && pWrist?.score > 0.3) {
            angle = calculateAngle(pShoulder, pElbow, pWrist);
          }
          break;
      }

      if (angle > 0 && session.config) {
        if (exerciseId === 'bicep_curl' || exerciseId === 'shoulder_press') {
          if (angle > session.config.down_angle) {
            session.state = 'down';
          } else if (angle < session.config.up_angle && session.state === 'down') {
            session.state = 'up';
            session.count += 1;
            setCount(session.count);
            if (session.count >= session.config.goal) {
              setGoalReached(true);
            }
          }
        } else {
          if (angle < session.config.down_angle) {
            session.state = 'down';
          } else if (angle > session.config.up_angle && session.state === 'down') {
            session.state = 'up';
            session.count += 1;
            setCount(session.count);
            if (session.count >= session.config.goal) {
              setGoalReached(true);
            }
          }
        }
      }
    } catch (err) {
      console.error('Exercise processing error:', err);
    }
  };

  // Move to next exercise or complete workout
  const nextExercise = () => {
    if (!selectedPlan) return;
    
    const nextIndex = sessionRef.current.exerciseIndex + 1;
    if (nextIndex < selectedPlan.exercises.length) {
      setCurrentExercise(selectedPlan.exercises[nextIndex]);
    } else {
      completeWorkout();
    }
  };

  const startCustomWorkout = () => {
    const validExercises = customWorkout
      .filter(ex => 
        ex && 
        ex.id && 
        EXERCISE_CONFIGS[ex.id] && 
        ((ex.reps > 0 && ex.sets > 0) || (ex.duration > 0 && ex.sets > 0)))
      .map(ex => ({
        ...ex,
        name: allExercises.find(e => e.id === ex.id)?.name || ex.id,
        sets: ex.sets || 3
      }));

    if (validExercises.length === 0) {
      setError('Please add valid exercises with proper reps/duration and sets');
      return;
    }

    const newPlan = {
      id: 'custom_' + Date.now(),
      name: 'Custom Workout',
      exercises: validExercises,
      duration: validExercises.reduce((acc, ex) => 
        acc + (ex.duration ? ex.duration * ex.sets : ex.reps * ex.sets * 5), 0),
      calories: validExercises.reduce((acc, ex) => 
        acc + (EXERCISE_CONFIGS[ex.id]?.caloriesPerUnit || 0.5) * 
        (ex.reps ? ex.reps * ex.sets : ex.duration * ex.sets), 0),
      difficulty: 'Custom',
      icon: '✨'
    };

    setSelectedPlan(newPlan);
    setCurrentExercise(newPlan.exercises[0]);
    setCustomWorkout([]);
    setShowExerciseSelector(false);
    setWorkoutComplete(false);
    setError(null);
    setDetectorType('blazepose');
  };

  // Complete the entire workout
  const completeWorkout = () => {
    setWorkoutComplete(true);
    setCaloriesBurned(selectedPlan.calories);
    setCurrentExercise(null);
    setSelectedPlan(null);
    setDetectorType('movenet');
  };

  // Start a workout plan
  const startWorkout = (plan) => {
    setSelectedPlan(plan);
    setCurrentExercise(plan.exercises[0]);
    setWorkoutComplete(false);
    setDetectorType('movenet');
  };

  // Reset everything
  const resetWorkout = () => {
    setSelectedPlan(null);
    setCurrentExercise(null);
    setWorkoutComplete(false);
    setGoalReached(false);
    setDetectorType('movenet');
  };

  // Webcam component for standard workouts
  const webcamComponent = (
    <div className="camera-container">
      <Webcam
        audio={false}
        ref={webcamRef}
        className="video-feed"
        videoConstraints={{
          width: dimensions.width,
          height: dimensions.height,
          facingMode: 'user',
          frameRate: { ideal: 30 }
        }}
        onUserMedia={() => setIsWebcamReady(true)}
        onUserMediaError={(err) => {
          setError(`Camera error: ${err.message}`);
          setIsWebcamReady(false);
        }}
        forceScreenshotSourceSize={true}
      />
      <canvas
        ref={canvasRef}
        className="pose-canvas"
      />
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h2>Loading AI Fitness Coach</h2>
        <p>Initializing pose detection model...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-screen">
        <div className="error-icon">⚠️</div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Workout complete screen
  if (workoutComplete) {
    return (
      <div className="workout-complete">
        <Confetti 
          width={dimensions.width}
          height={dimensions.height}
          recycle={false} 
          numberOfPieces={500}
        />
        <div className="celebration-content">
          <h1>Workout Complete! 🎉</h1>
          <div className="stats-card">
            <div className="stat-item">
              <span className="stat-value">{selectedPlan?.exercises.length}</span>
              <span className="stat-label">Exercises</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{caloriesBurned}</span>
              <span className="stat-label">Calories</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{selectedPlan?.duration}</span>
              <span className="stat-label">Minutes</span>
            </div>
          </div>
          <button 
            className="finish-button"
            onClick={resetWorkout}
          >
            Finish & Return
          </button>
        </div>
      </div>
    );
  }
  

  // Main render
  return (
    <div className="dashboard">
      {!selectedPlan ? (
        <div className="workout-options">
        <h2>Choose Your Workout Style</h2>
        <div className="category-selector">
          {Object.keys(workoutCategories).map(category => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'active' : ''}
            >
              {workoutCategories[category].name}
            </button>
          ))}
          <button 
            onClick={() => {
              setSelectedCategory(null);
              setShowExerciseSelector(true);
            }}
            className="custom-workout-btn"
          >
            Create Custom Workout
          </button>
        </div>

        {showExerciseSelector && (
            <ExerciseSelector 
              exercises={allExercises}
              onSelect={(exercise) => {
                setCustomWorkout([...customWorkout, {
                  ...exercise,
                  sets: 3,
                  reps: exercise.reps || 0,
                  duration: exercise.duration || 0
                }]);
              }}
              onClose={() => setShowExerciseSelector(false)}
            />
          )}

        {customWorkout.length > 0 && (
          <div className="custom-workout-preview">
            <h3>Your Custom Workout</h3>
            <ul>
              {customWorkout.map((exercise, index) => (
                <li key={index}>
                  {exercise.name} - {exercise.reps ? `${exercise.sets}x${exercise.reps}` : `${exercise.duration}s`}
                  <button onClick={() => setCustomWorkout(customWorkout.filter((_, i) => i !== index))}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button 
                onClick={startCustomWorkout}
                disabled={customWorkout.length === 0}
              >
                Start Custom Workout
              </button>
          </div>
        )}

{selectedCategory && (
            <div className="plan-selection">
              <h3>{workoutCategories[selectedCategory].name} Plans</h3>
              <div className="plan-grid">
                {workoutCategories[selectedCategory].plans.map(plan => (
                  <div 
                    key={plan.id}
                    className="plan-card"
                    onClick={() => startWorkout(plan)}
                  >
                    <div className="plan-header">
                      <span className="plan-icon">{plan.icon}</span>
                      <h3>{plan.name}</h3>
                      <span className="plan-difficulty">{plan.difficulty}</span>
                    </div>
                    <div className="plan-content">
                      <p>{plan.description}</p>
                      <div className="plan-meta">
                        <span>⏱ {plan.duration} mins</span>
                        <span>🔥 {plan.calories} cal</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
      <div className="workout-mode">
        {webcamComponent}
        
        <div className="workout-overlay">
          <div className="current-exercise">
            <h2>{currentExercise.name}</h2>
            <div className="exercise-instructions">
              {EXERCISE_CONFIGS[currentExercise.id]?.instructions}
              <button 
                className="video-toggle"
                onClick={() => setShowVideo(!showVideo)}
              >
                {showVideo ? 'Hide Demo' : 'Show Demo'}
              </button>
            </div>
            
            {showVideo && currentExercise.video && (
              <div className="video-demo">
                <ReactPlayer 
                  url={currentExercise.video}
                  width="100%"
                  height="200px"
                  controls
                  light
                  playing={showVideo}
                />
              </div>
            )}
          </div>

          <div className="progress-container">
            <CircularProgressbar
              value={currentExercise.duration ? time : count}
              maxValue={currentExercise.duration || currentExercise.reps}
              text={currentExercise.duration ? `${time}s` : `${count}`}
              styles={buildStyles({
                pathColor: goalReached ? '#4caf50' : '#3a86ff',
                textColor: '#ffffff',
                trailColor: 'rgba(255, 255, 255, 0.2)',
                textSize: '2rem'
              })}
            />
            <div className="progress-meta">
              <span>Exercise {sessionRef.current.exerciseIndex + 1} of {selectedPlan.exercises.length}</span>
              <span>{EXERCISE_CONFIGS[currentExercise.id]?.muscles}</span>
            </div>
          </div>

          <div className="workout-controls">
          <button
    className="nav-button set-reps-button"
    onClick={() => setShowRepInput(!showRepInput)}
  >
    Set Goal Reps
  </button>
  {showRepInput && (
    <div className="rep-input-container">
      <input
        type="number"
        value={goalReps}
        onChange={(e) => setGoalReps(Math.max(1, parseInt(e.target.value) || 1))}
        min="1"
      />
      <button onClick={() => {
        if (currentExercise) {
          const updatedExercise = {...currentExercise, reps: goalReps};
          const updatedPlan = {
            ...selectedPlan,
            exercises: selectedPlan.exercises.map(ex => 
              ex.id === currentExercise.id ? updatedExercise : ex
            )
          };
          setSelectedPlan(updatedPlan);
          setCurrentExercise(updatedExercise);
          initializeSession(updatedExercise);
        }
        setShowRepInput(false);
      }}>
        Apply
      </button>
    </div>
  )}

<button
    className="nav-button skip-button"
    onClick={nextExercise}
    disabled={!goalReached}
  >
    {goalReached ? 'Next Exercise →' : 'Complete to Continue'}
  </button>
  <button
    className="nav-button cancel-button"
    onClick={resetWorkout}
  >
    Cancel Workout
  </button>

  <div className="timer-container">
  <div className="timer-display">
    {formatTime(time)}
  </div>
</div>
          </div>
        </div>

        {goalReached && (
          <div className="rep-complete">
            <span>Nice! 💪</span>
            <button onClick={nextExercise}>
              Continue to Next Exercise
            </button>
          </div>
        )}
      </div>
    )}

{workoutComplete && (
        <div className="workout-complete">
          <Confetti 
            width={dimensions.width}
            height={dimensions.height}
            recycle={false} 
            numberOfPieces={500}
          />
          <div className="celebration-content">
            <h1>Workout Complete! 🎉</h1>
            <div className="stats-card">
              <div className="stat-item">
                <span className="stat-value">{selectedPlan?.exercises.length}</span>
                <span className="stat-label">Exercises</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{caloriesBurned}</span>
                <span className="stat-label">Calories</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{selectedPlan?.duration}</span>
                <span className="stat-label">Minutes</span>
              </div>
            </div>
            <button 
              className="finish-button"
              onClick={resetWorkout}
            >
              Finish & Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced CSS Styles
const styles = `

/* Workout Options */
.workout-options {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.workout-options h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #fff;
}

/* Category Selector */
.category-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.category-selector button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.category-selector button.active {
  background: #3a86ff;
  color: white;
  font-weight: bold;
}

.category-selector button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.custom-workout-btn {
  background: #4caf50 !important;
}

.custom-workout-btn:hover {
  background: #3e8e41 !important;
}

/* Exercise Selector */
.exercise-selector {
  margin: 2rem 0;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.exercise-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.exercise-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.exercise-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.exercise-card h4 {
  margin: 0 0 0.5rem 0;
  color: #fff;
}

.exercise-card p {
  color: #b8c2d9;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.custom-controls {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.custom-controls label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #b8c2d9;
  font-size: 0.9rem;
}

.custom-controls input {
  width: 60px;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 5px;
  text-align: center;
}

.exercise-card button {
  width: 100%;
  padding: 0.75rem;
  background: #3a86ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s ease;
}

.exercise-card button:hover {
  background: #2a75eb;
}

/* Custom Workout Preview */
.custom-workout-preview {
  background: rgba(58, 134, 255, 0.1);
  padding: 1.5rem;
  border-radius: 15px;
  margin-top: 2rem;
  border: 1px solid rgba(58, 134, 255, 0.2);
}

.custom-workout-preview h3 {
  margin-top: 0;
  color: #fff;
}

.custom-workout-preview ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.custom-workout-preview li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
}

.custom-workout-preview button {
  background: rgba(255, 77, 77, 0.2);
  color: #ff4d4d;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-workout-preview button:hover {
  background: rgba(255, 77, 77, 0.3);
}

.custom-workout-preview > button {
  width: 100%;
  background: #4caf50;
  color: white;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 1rem;
}

.custom-workout-preview > button:disabled {
  background: #2a2a48;
  color: #6c757d;
  cursor: not-allowed;
}

.custom-workout-preview > button:hover:not(:disabled) {
  background: #3e8e41;
}

.dashboard {
font-family: 'Inter', system-ui, sans-serif;
color: #fff;
min-height: 100vh;
background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

/* Workout Plan Selection */
.plan-selection {
padding: 2rem;
max-width: 1200px;
margin: 0 auto;
}

.plan-selection h1 {
text-align: center;
margin-bottom: 2rem;
font-size: 2.5rem;
background: linear-gradient(90deg, #3a86ff 0%, #4caf50 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
}

.plan-grid {
display: grid;
gap: 2rem;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.plan-card {
background: rgba(255, 255, 255, 0.05);
border-radius: 20px;
padding: 1.5rem;
cursor: pointer;
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
}

.plan-card:hover {
transform: translateY(-5px);
background: rgba(255, 255, 255, 0.1);
box-shadow: 0 10px 30px rgba(58, 134, 255, 0.2);
}

.plan-header {
display: flex;
align-items: center;
gap: 1rem;
margin-bottom: 1rem;
}

.plan-icon {
font-size: 2rem;
}

.plan-difficulty {
margin-left: auto;
padding: 0.25rem 0.75rem;
border-radius: 20px;
font-size: 0.8rem;
background: rgba(255, 255, 255, 0.1);
}

.plan-content p {
color: #b8c2d9;
margin-bottom: 1rem;
}

.plan-meta {
display: flex;
justify-content: space-between;
color: #8d99ae;
}

/* Workout Mode Styles */
.workout-mode {
position: relative;
height: 100vh;
}

.camera-container {
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
z-index: 1;
}

.video-feed {
width: 100%;
height: 100%;
object-fit: cover;
}

.pose-canvas {
position: fixed;
top: 0;
left: 0;
pointer-events: none;
mix-blend-mode: screen;
}

.workout-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 2;
background: linear-gradient(180deg, rgba(10, 10, 20, 0.9) 0%, rgba(10, 10, 20, 0.6) 100%);
padding: 2rem;
display: flex;
flex-direction: column;
justify-content: space-between;
}

.current-exercise {
background: rgba(255, 255, 255, 0.1);
padding: 1.5rem;
border-radius: 15px;
backdrop-filter: blur(10px);
max-width: 500px;
}

.exercise-instructions {
color: #b8c2d9;
margin: 1rem 0;
}

.video-toggle {
background: none;
border: none;
color: #3a86ff;
cursor: pointer;
padding: 0.5rem;
margin-top: 1rem;
}

.video-demo {
margin-top: 1rem;
border-radius: 12px;
overflow: hidden;
}

.progress-container {
align-self: center;
width: 200px;
text-align: center;
}

.progress-meta {
margin-top: 1rem;
display: flex;
justify-content: space-between;
color: #8d99ae;
font-size: 0.9rem;
}

.workout-controls {
display: flex;
gap: 1rem;
justify-content: center;
}

.nav-button {
padding: 1rem 2rem;
border: none;
border-radius: 30px;
font-weight: 600;
cursor: pointer;
transition: all 0.3s ease;
}

.skip-button {
background: #3a86ff;
color: white;
}

.skip-button:disabled {
background: #2a2a48;
color: #6c757d;
cursor: not-allowed;
}

.cancel-button {
background: rgba(255, 77, 77, 0.2);
color: #ff4d4d;
}

.rep-complete {
position: fixed;
bottom: 2rem;
left: 50%;
transform: translateX(-50%);
background: rgba(76, 175, 80, 0.2);
color: #4caf50;
padding: 1rem 2rem;
border-radius: 30px;
backdrop-filter: blur(10px);
display: flex;
align-items: center;
gap: 1rem;
}

/* Loading and Error States */
.loading-screen {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100vh;
gap: 1rem;
}

.spinner {
width: 50px;
height: 50px;
border: 5px solid rgba(255, 255, 255, 0.1);
border-top-color: #3a86ff;
border-radius: 50%;
animation: spin 1s linear infinite;
}

.error-screen {
text-align: center;
padding: 2rem;
height: 100vh;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
}

@keyframes spin {
to { transform: rotate(360deg); }
}

/* Category Selector */
.category-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.category-selector button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-selector button.active {
  background: #3a86ff;
  color: white;
}

.category-selector button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.custom-workout-btn {
  background: #4caf50 !important;
}

/* Exercise Selector */
.exercise-selector {
  margin: 2rem 0;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 15px;
}

.exercise-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.exercise-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 10px;
}

.exercise-card h4 {
  margin: 0 0 0.5rem 0;
}

.custom-controls {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.custom-controls label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-controls input {
  width: 60px;
  padding: 0.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 5px;
}

/* Custom Workout Preview */
.custom-workout-preview {
  background: rgba(58, 134, 255, 0.1);
  padding: 1.5rem;
  border-radius: 15px;
  margin-top: 2rem;
}

.custom-workout-preview ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.custom-workout-preview li {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-workout-preview button {
  background: rgba(255, 77, 77, 0.2);
  color: #ff4d4d;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  cursor: pointer;
}

`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);