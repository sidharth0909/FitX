import { EXERCISE_CONFIGS, STATE_COLORS } from "./exerciseConfigs.js";
import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { supabase } from "../supabaseClient";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Confetti from "react-confetti";
import ReactPlayer from "react-player";
import ExerciseSelector from "./ExerciseSelector";
import Navbar from "./Nav.jsx";
import Footer from "./Footer.jsx";

// Workout plans with video demonstrations
const workoutCategories = {
  fullBody: {
    name: "Full Body Workouts",
    plans: [
      {
        id: "beginner_fullbody",
        name: "Beginner Full Body",
        category: "fullBody",
        description: "Perfect for starters - builds foundational strength",
        exercises: [
          {
            id: "squat",
            name: "Bodyweight Squat",
            reps: 12,
            sets: 3,
            video: "https://www.youtube.com/watch?v=aclHkVaku9U",
          },
          {
            id: "push_up",
            name: "Knee Push-ups",
            reps: 8,
            sets: 3,
            video: "https://www.youtube.com/watch?v=eFOSh8vpd8I",
          },
          { id: "plank", name: "Plank", duration: 30, sets: 3 },
        ],
        duration: 20,
        difficulty: "Beginner",
        calories: 180,
        icon: "🆕",
      },
      {
        id: "intermediate_fullbody",
        name: "Intermediate Full Body",
        category: "fullBody",
        description: "Challenging full body routine",
        exercises: [
          {
            id: "squat",
            name: "Squats",
            reps: 15,
            sets: 4,
            video: "https://www.youtube.com/watch?v=aclHkVaku9U",
          },
          {
            id: "push_up",
            name: "Push-ups",
            reps: 12,
            sets: 4,
            video: "https://www.youtube.com/watch?v=IODxDxX7oi4",
          },
          {
            id: "pull_up",
            name: "Assisted Pull-ups",
            reps: 6,
            sets: 3,
            video: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
          },
          { id: "plank", name: "Plank", duration: 45, sets: 3 },
        ],
        duration: 30,
        difficulty: "Intermediate",
        calories: 250,
        icon: "💪",
      },
    ],
  },
  pushPullLegs: {
    name: "Push-Pull-Legs",
    plans: [
      {
        id: "intermediate_ppl",
        name: "PPL Split",
        category: "pushPullLegs",
        description: "Classic push, pull, legs split for balanced development",
        exercises: [
          // Push day exercises
          {
            id: "push_up",
            name: "Push-ups",
            reps: 12,
            sets: 4,
            video: "https://www.youtube.com/watch?v=IODxDxX7oi4",
          },
          {
            id: "shoulder_press",
            name: "Shoulder Press",
            reps: 10,
            sets: 3,
            video: "https://www.youtube.com/watch?v=qEwKCR5JCog",
          },
          // Pull day exercises
          {
            id: "pull_up",
            name: "Pull-ups",
            reps: 8,
            sets: 3,
            video: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
          },
          // Leg day exercises
          {
            id: "squat",
            name: "Squats",
            reps: 12,
            sets: 3,
            video: "https://www.youtube.com/watch?v=aclHkVaku9U",
          },
          {
            id: "lunge",
            name: "Lunges",
            reps: 10,
            sets: 3,
            video: "https://www.youtube.com/watch?v=QOVaHwm-Q6U",
          },
        ],
        duration: 45,
        difficulty: "Intermediate",
        calories: 300,
        icon: "🏋️",
      },
      {
        id: "advanced_ppl",
        name: "Advanced PPL",
        category: "pushPullLegs",
        description: "Intensive push/pull/legs for advanced lifters",
        exercises: [
          {
            id: "push_up",
            name: "Weighted Push-ups",
            reps: 10,
            sets: 4,
            video: "https://www.youtube.com/watch?v=G1dS8iLzS9A",
          },
          {
            id: "pull_up",
            name: "Weighted Pull-ups",
            reps: 6,
            sets: 4,
            video: "https://www.youtube.com/watch?v=Hdc7Mw6BIEE",
          },
          {
            id: "squat",
            name: "Bulgarian Split Squats",
            reps: 10,
            sets: 3,
            video: "https://www.youtube.com/watch?v=2C-uNgKwPLE",
          },
        ],
        duration: 50,
        difficulty: "Advanced",
        calories: 350,
        icon: "🔥",
      },
    ],
  },
  upperLower: {
    name: "Upper/Lower Split",
    plans: [
      {
        id: "intermediate_upper_lower",
        name: "Upper/Lower Split",
        category: "upperLower",
        description: "Balanced upper and lower body focus",
        exercises: [
          // Upper body exercises
          {
            id: "push_up",
            name: "Push-ups",
            reps: 15,
            sets: 4,
            video: "https://www.youtube.com/watch?v=IODxDxX7oi4",
          },
          {
            id: "bicep_curl",
            name: "Bicep Curls",
            reps: 12,
            sets: 3,
            video: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
          },
          // Lower body exercises
          {
            id: "squat",
            name: "Squats",
            reps: 15,
            sets: 4,
            video: "https://www.youtube.com/watch?v=aclHkVaku9U",
          },
          {
            id: "lunge",
            name: "Lunges",
            reps: 12,
            sets: 3,
            video: "https://www.youtube.com/watch?v=QOVaHwm-Q6U",
          },
        ],
        duration: 50,
        difficulty: "Intermediate",
        calories: 320,
        icon: "⚖️",
      },
      {
        id: "advanced_upper_lower",
        name: "Advanced Upper/Lower",
        category: "upperLower",
        description: "High intensity upper/lower split",
        exercises: [
          {
            id: "pull_up",
            name: "Wide Grip Pull-ups",
            reps: 10,
            sets: 4,
            video: "https://www.youtube.com/watch?v=Hdc7Mw6BIEE",
          },
          {
            id: "push_up",
            name: "Archer Push-ups",
            reps: 8,
            sets: 3,
            video: "https://www.youtube.com/watch?v=9u5HzYgtf7E",
          },
          {
            id: "squat",
            name: "Jump Squats",
            reps: 15,
            sets: 3,
            video: "https://www.youtube.com/watch?v=CVaEhXotL7M",
          },
        ],
        duration: 55,
        difficulty: "Advanced",
        calories: 380,
        icon: "🚀",
      },
    ],
  },
  cardio: {
    name: "Cardio & Conditioning",
    plans: [
      {
        id: "hiit",
        name: "HIIT Circuit",
        category: "cardio",
        description: "High intensity interval training",
        exercises: [
          {
            id: "jumping_jacks",
            name: "Jumping Jacks",
            duration: 30,
            sets: 3,
            video: "https://www.youtube.com/watch?v=iSSAk4XCsRA",
          },
          {
            id: "burpees",
            name: "Burpees",
            reps: 10,
            sets: 3,
            video: "https://www.youtube.com/watch?v=TU8QYVW0gDU",
          },
          {
            id: "mountain_climbers",
            name: "Mountain Climbers",
            duration: 30,
            sets: 3,
            video: "https://www.youtube.com/watch?v=nmwgirgXLYM",
          },
        ],
        duration: 20,
        difficulty: "Intermediate",
        calories: 250,
        icon: "🏃",
      },
    ],
  },
  individual: {
    name: "Individual Exercises",
    plans: [
      {
        id: "individual_exercises",
        name: "Individual Exercises",
        category: "individual",
        description: "Practice specific exercises with custom rep goals",
        exercises: [
          {
            id: "bicep_curl",
            name: "Bicep Curls",
            reps: 10,
            sets: 3,
            video: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
          },
          {
            id: "squat",
            name: "Squats",
            reps: 12,
            sets: 3,
            video: "https://www.youtube.com/watch?v=aclHkVaku9U",
          },
          {
            id: "shoulder_press",
            name: "Shoulder Press",
            reps: 10,
            sets: 3,
            video: "https://www.youtube.com/watch?v=qEwKCR5JCog",
          },
          {
            id: "push_up",
            name: "Push-ups",
            reps: 10,
            sets: 3,
            video: "https://www.youtube.com/watch?v=IODxDxX7oi4",
          },
        ],
        duration: 20,
        difficulty: "Custom",
        calories: 200,
        icon: "🏅",
      },
    ],
  },
};

const allExercises = [
  {
    id: "squat",
    name: "Squat",
    reps: 12,
    sets: 3,
    video: "https://youtube.com/squat",
  },
  {
    id: "push_up",
    name: "Push-up",
    reps: 10,
    sets: 3,
    video: "https://youtube.com/pushup",
  },
  {
    id: "pull_up",
    name: "Pull-up",
    reps: 8,
    sets: 3,
    video: "https://youtube.com/pullup",
  },
  {
    id: "lunge",
    name: "Lunge",
    reps: 10,
    sets: 3,
    video: "https://youtube.com/lunge",
  },
  {
    id: "plank",
    name: "Plank",
    duration: 30,
    sets: 3,
    video: "https://youtube.com/plank",
  },
  {
    id: "bicep_curl",
    name: "Bicep Curl",
    reps: 12,
    sets: 3,
    video: "https://youtube.com/bicepcurl",
  },
  {
    id: "shoulder_press",
    name: "Shoulder Press",
    reps: 10,
    sets: 3,
    video: "https://youtube.com/shoulderpress",
  },
  {
    id: "jumping_jacks",
    name: "Jumping Jacks",
    duration: 30,
    sets: 3,
    video: "https://youtube.com/jumpingjacks",
  },
  {
    id: "burpees",
    name: "Burpees",
    reps: 10,
    sets: 3,
    video: "https://youtube.com/burpees",
  },
  {
    id: "mountain_climbers",
    name: "Mountain Climbers",
    duration: 30,
    sets: 3,
    video: "https://youtube.com/mountainclimbers",
  },
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
    height: window.innerHeight,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customWorkout, setCustomWorkout] = useState([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [repsDone, setRepsDone] = useState(0); // Initialize with 0 or your logic
  const [detectorType, setDetectorType] = useState("movenet");

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const animationRef = useRef(null);
  const timerRef = useRef(null);
  const sessionRef = useRef({
    state: "down",
    count: 0,
    time: 0,
    config: null,
    exerciseIndex: 0,
  });

  const handleApplyReps = () => {
    if (currentExercise) {
      const updatedExercise = {
        ...currentExercise,
        reps: goalReps,
      };
      const updatedPlan = {
        ...selectedPlan,
        exercises: selectedPlan.exercises.map((ex) =>
          ex.id === currentExercise.id ? updatedExercise : ex
        ),
      };
      setSelectedPlan(updatedPlan);
      setCurrentExercise(updatedExercise);
      initializeSession(updatedExercise);
    }
    setShowRepInput(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const controls = document.querySelector(".workout-controls-container");
      if (controls) {
        controls.style.animation = "fadeOut 0.5s forwards";
        controls.style.animationDelay = "5s";
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  // Initialize session for current exercise
  const initializeSession = (exercise) => {
    const config = EXERCISE_CONFIGS[exercise.id] || EXERCISE_CONFIGS.default;
    if (!config) {
      setError("Invalid exercise configuration");
      return;
    }
    sessionRef.current = {
      state: config.start_state,
      count: 0,
      time: 0,
      config: {
        ...config,
        goal: exercise.reps || exercise.duration || 10,
        duration: exercise.duration || 0,
      },
      exerciseIndex: selectedPlan.exercises.findIndex(
        (ex) => ex.id === exercise.id
      ),
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
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Get user session
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Initialize TensorFlow.js model
  useEffect(() => {
    let isMounted = true;
    const initModel = async () => {
      try {
        await tf.setBackend("webgl").catch(async () => {
          console.warn("WebGL not available, falling back to CPU");
          await tf.setBackend("cpu");
        });

        await tf.ready();

        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
            enableSmoothing: true,
          }
        );

        if (isMounted) {
          detectorRef.current = detector;
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Model initialization failed:", err);
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
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
  useEffect(() => {
    if (currentExercise && detectorRef.current && isWebcamReady) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
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
    // if (selectedPlan?.id.startsWith("custom")) return;

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
        setTime((prev) => {
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
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (pose && sessionRef.current.config) {
          drawPose(ctx, pose.keypoints);
          if (currentExercise.id !== "plank") {
            processExercise(pose.keypoints);
          }
        }
      } catch (err) {
        console.error("Detection error:", err);
        setError("Pose detection failed");
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
    const connectionColor = STATE_COLORS[currentState] || "#3a86ff";

    keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = connectionColor;
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    const connections = [
      ["left_shoulder", "left_elbow"],
      ["left_elbow", "left_wrist"],
      ["right_shoulder", "right_elbow"],
      ["right_elbow", "right_wrist"],
      ["left_shoulder", "right_shoulder"],
      ["left_shoulder", "left_hip"],
      ["right_shoulder", "right_hip"],
      ["left_hip", "right_hip"],
      ["left_hip", "left_knee"],
      ["left_knee", "left_ankle"],
      ["right_hip", "right_knee"],
      ["right_knee", "right_ankle"],
    ];

    connections.forEach(([joint1, joint2]) => {
      const kp1 = keypoints.find((k) => k.name === joint1);
      const kp2 = keypoints.find((k) => k.name === joint2);

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
    const radians =
      Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180) / Math.PI);
    return angle > 180 ? 360 - angle : angle;
  };

  // Process exercise movements (for standard workouts)
  const processExercise = (keypoints) => {
    const session = sessionRef.current;
    if (!session.config || !currentExercise) return;

    let angle = 0;
    const exerciseId = currentExercise.id;

    try {
      // Get the exercise config - fall back to default if not found
      const exerciseConfig =
        EXERCISE_CONFIGS[exerciseId] || EXERCISE_CONFIGS.default;

      switch (exerciseId) {
        // Standard exercises with specific angle calculations
        case "bicep_curl":
        case "shoulder_press":
        case "pull_up":
          const shoulder = keypoints.find((k) => k.name === "left_shoulder");
          const elbow = keypoints.find((k) => k.name === "left_elbow");
          const wrist = keypoints.find((k) => k.name === "left_wrist");

          if (
            shoulder?.score > 0.3 &&
            elbow?.score > 0.3 &&
            wrist?.score > 0.3
          ) {
            angle = calculateAngle(shoulder, elbow, wrist);
          }
          break;

        case "squat":
        case "lunge":
          const hip = keypoints.find((k) => k.name === "left_hip");
          const knee = keypoints.find((k) => k.name === "left_knee");
          const ankle = keypoints.find((k) => k.name === "left_ankle");

          if (hip?.score > 0.3 && knee?.score > 0.3 && ankle?.score > 0.3) {
            angle = calculateAngle(hip, knee, ankle);
          }
          break;

        case "push_up":
          const pShoulder = keypoints.find((k) => k.name === "left_shoulder");
          const pElbow = keypoints.find((k) => k.name === "left_elbow");
          const pWrist = keypoints.find((k) => k.name === "left_wrist");

          if (
            pShoulder?.score > 0.3 &&
            pElbow?.score > 0.3 &&
            pWrist?.score > 0.3
          ) {
            angle = calculateAngle(pShoulder, pElbow, pWrist);
          }
          break;

        // Custom exercises will use the default angle calculation
        default:
          // Try to detect arm movement first
          const cShoulder = keypoints.find((k) => k.name === "left_shoulder");
          const cElbow = keypoints.find((k) => k.name === "left_elbow");
          const cWrist = keypoints.find((k) => k.name === "left_wrist");

          if (
            cShoulder?.score > 0.3 &&
            cElbow?.score > 0.3 &&
            cWrist?.score > 0.3
          ) {
            angle = calculateAngle(cShoulder, cElbow, cWrist);
          } else {
            // Fall back to leg movement detection
            const cHip = keypoints.find((k) => k.name === "left_hip");
            const cKnee = keypoints.find((k) => k.name === "left_knee");
            const cAnkle = keypoints.find((k) => k.name === "left_ankle");

            if (
              cHip?.score > 0.3 &&
              cKnee?.score > 0.3 &&
              cAnkle?.score > 0.3
            ) {
              angle = calculateAngle(cHip, cKnee, cAnkle);
            }
          }
          break;
      }

      if (angle > 0 && session.config) {
        // Determine direction based on exercise type
        const isArmExercise = [
          "bicep_curl",
          "shoulder_press",
          "pull_up",
        ].includes(exerciseId);

        const isLegExercise = ["squat", "lunge", "push_up"].includes(
          exerciseId
        );

        if (isArmExercise || (!isArmExercise && !isLegExercise)) {
          // For arm exercises or custom exercises, up is when angle decreases
          if (angle > session.config.down_angle) {
            session.state = "down";
          } else if (
            angle < session.config.up_angle &&
            session.state === "down"
          ) {
            session.state = "up";
            session.count += 1;
            setCount(session.count);
            if (session.count >= session.config.goal) {
              setGoalReached(true);
            }
          }
        } else if (isLegExercise) {
          // For leg exercises, up is when angle increases
          if (angle < session.config.down_angle) {
            session.state = "down";
          } else if (
            angle > session.config.up_angle &&
            session.state === "down"
          ) {
            session.state = "up";
            session.count += 1;
            setCount(session.count);
            if (session.count >= session.config.goal) {
              setGoalReached(true);
            }
          }
        }
      }
    } catch (err) {
      console.error("Exercise processing error:", err);
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
    // First validate all exercises
    const invalidExercises = customWorkout
      .filter(
        (ex) =>
          !((ex.reps > 0 && ex.sets > 0) || (ex.duration > 0 && ex.sets > 0))
      )
      .map((ex) => ex.name || ex.id);

    if (invalidExercises.length > 0) {
      setError(
        `Invalid settings for: ${invalidExercises.join(
          ", "
        )}. Please check reps/duration and sets.`
      );
      return;
    }

    // Proceed with valid exercises
    const validExercises = customWorkout.map((ex) => {
      // Use the exercise's specific config if available, otherwise use default
      const exerciseConfig =
        EXERCISE_CONFIGS[ex.id] || EXERCISE_CONFIGS.default;

      return {
        ...ex,
        ...exerciseConfig, // Spread the config properties
        name: allExercises.find((e) => e.id === ex.id)?.name || ex.id,
        sets: ex.sets || 3,
        reps: ex.reps || exerciseConfig.defaultReps || 10,
        duration: ex.duration || 0,
      };
    });

    if (validExercises.length === 0) {
      setError("Please add valid exercises");
      return;
    }

    const newPlan = {
      id: "custom_" + Date.now(),
      name: "Custom Workout",
      exercises: validExercises,
      duration: validExercises.reduce(
        (acc, ex) =>
          acc + (ex.duration ? ex.duration * ex.sets : ex.reps * ex.sets * 5),
        0
      ),
      calories: validExercises.reduce(
        (acc, ex) =>
          acc +
          (ex.caloriesPerUnit || 0.5) *
            (ex.reps ? ex.reps * ex.sets : ex.duration * ex.sets),
        0
      ),
      difficulty: "Custom",
      icon: "✨",
    };

    setSelectedPlan(newPlan);
    setCurrentExercise(newPlan.exercises[0]);
    setCustomWorkout([]);
    setShowExerciseSelector(false);
    setWorkoutComplete(false);
    setError(null);
  };

  // Complete the entire workout
  const completeWorkout = () => {
    setWorkoutComplete(true);
    setCaloriesBurned(selectedPlan.calories);
    setCurrentExercise(null);
    setSelectedPlan(null);
  };

  // Start a workout plan
  const startWorkout = (plan) => {
    setSelectedPlan(plan);
    setCurrentExercise(plan.exercises[0]);
    setWorkoutComplete(false);
  };

  // Reset everything
  const resetWorkout = () => {
    setSelectedPlan(null);
    setCurrentExercise(null);
    setWorkoutComplete(false);
    setGoalReached(false);
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
          facingMode: "user",
          frameRate: { ideal: 30 },
        }}
        onUserMedia={() => setIsWebcamReady(true)}
        onUserMediaError={(err) => {
          setError(`Camera error: ${err.message}`);
          setIsWebcamReady(false);
        }}
        forceScreenshotSourceSize={true}
      />
      <canvas ref={canvasRef} className="pose-canvas" />
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
      <div className="workout-complete cosmic-celebration">
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={500}
          initialVelocityY={15}
          confettiSource={{
            x: dimensions.width / 2,
            y: dimensions.height,
            w: 10,
            h: 10,
          }}
        />

        {/* Floating Emojis Animation */}
        <div className="emoji-shower">
          {["💪", "🔥", "🚀", "🏆", "⭐️"].map((emoji, i) => (
            <span key={i} className="floating-emoji" style={{ "--i": i }}>
              {emoji}
            </span>
          ))}
        </div>

        <div className="celebration-content neon-pulse">
          <h1 className="celebration-title">
            <span className="text-gradient">Victory Lap Complete!</span> 🏁
            <div className="sparkle-trail"></div>
          </h1>

          {/* Animated Stats Cards */}
          <div className="stats-deck">
            <div className="stat-card hover-glow">
              <div className="stat-icon">🏋️♂️</div>
              <span className="stat-value cosmic-text">
                {selectedPlan?.exercises.length}
              </span>
              <span className="stat-label">Challenges Conquered</span>
            </div>

            <div className="stat-card hover-glow">
              <div className="stat-icon">🔥</div>
              <span className="stat-value cosmic-text">{caloriesBurned}</span>
              <span className="stat-label">Calories Torched</span>
            </div>

            <div className="stat-card hover-glow">
              <div className="stat-icon">⏳</div>
              <span className="stat-value cosmic-text">
                {selectedPlan?.duration}
              </span>
              <span className="stat-label">Minutes of Glory</span>
            </div>
          </div>

          {/* Interactive Finish Button */}
          <button className="finish-button power-button" onClick={resetWorkout}>
            <span className="button-sparkle">✨</span>
            Claim Victory & Rise
            <div className="button-aura"></div>
          </button>

          {/* Motivational Microcopy */}
          <p className="motivational-quote">
            "Every rep was a step towards your stronger self!" 💥
          </p>
        </div>

        {/* Progress Mascot */}
        <div className="celebratory-mascot">
          <div className="mascot-jump">🏋️♀️💦</div>
          <div className="mascot-confetti"></div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="dashboard">
      {!currentExercise && <Navbar />}
      {!selectedPlan ? (
        <div className="workout-options">
          <h2>Choose Your Workout Style</h2>
          <div className="category-selector">
            {Object.keys(workoutCategories).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowExerciseSelector(false); // Close exercise selector when category is selected
                }}
                className={selectedCategory === category ? "active" : ""}
              >
                {workoutCategories[category].name}
              </button>
            ))}
            <button
              onClick={() => {
                setShowExerciseSelector((prev) => !prev);
                // Clear any selected category
                setSelectedCategory(null);
              }}
              className={`custom-workout-btn ${
                showExerciseSelector ? "active" : ""
              }`}
            >
              Create Custom Workout
            </button>
          </div>

          {showExerciseSelector && (
            <ExerciseSelector
              exercises={allExercises}
              onSelect={(exercise) => {
                setCustomWorkout([
                  ...customWorkout,
                  {
                    ...exercise,
                    sets: 3,
                    reps: exercise.reps || 0,
                    duration: exercise.duration || 0,
                  },
                ]);
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
                    {exercise.name} -{" "}
                    {exercise.reps
                      ? `${exercise.sets}x${exercise.reps}`
                      : `${exercise.duration}s`}
                    <button
                      onClick={() =>
                        setCustomWorkout(
                          customWorkout.filter((_, i) => i !== index)
                        )
                      }
                    >
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
                {workoutCategories[selectedCategory].plans.map((plan) => (
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
                  {showVideo ? "Hide Demo" : "Show Demo"}
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
                  pathColor: goalReached ? "#4caf50" : "#3a86ff",
                  textColor: "#ffffff",
                  trailColor: "rgba(255, 255, 255, 0.2)",
                  textSize: "2rem",
                })}
              />
              <div className="progress-meta">
                <span>
                  Exercise {sessionRef.current.exerciseIndex + 1} of{" "}
                  {selectedPlan.exercises.length}
                </span>
                <span>{EXERCISE_CONFIGS[currentExercise.id]?.muscles}</span>
              </div>
            </div>

            <div className="workout-controls-container">
              <div className="workout-controls">
                <button
                  className="nav-button set-reps-button"
                  onClick={() => setShowRepInput(!showRepInput)}
                >
                  Set Reps
                </button>

                {showRepInput && (
                  <div className="rep-input-container">
                    <input
                      type="number"
                      value={goalReps}
                      onChange={(e) =>
                        setGoalReps(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      min="1"
                    />
                    <button className="apply-button" onClick={handleApplyReps}>
                      ✓
                    </button>
                  </div>
                )}

                <button
                  className={`nav-button skip-button ${
                    !goalReached ? "disabled" : ""
                  }`}
                  onClick={nextExercise}
                  disabled={!goalReached}
                >
                  {goalReached
                    ? "Next →"
                    : `${count}/${
                        currentExercise.reps || currentExercise.duration
                      }`}
                </button>

                <button
                  className="nav-button cancel-button"
                  onClick={resetWorkout}
                >
                  ✕
                </button>

                <div className="timer-display">{formatTime(time)}</div>
              </div>
            </div>
          </div>

          {goalReached && (
            <div className="rep-complete">
              <span>Nice! 💪</span>
              <button onClick={nextExercise}>Continue to Next Exercise</button>
            </div>
          )}
        </div>
      )}

{!currentExercise && <Footer />}

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
                <span className="stat-value">
                  {selectedPlan?.exercises.length}
                </span>
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
            <button className="finish-button" onClick={resetWorkout}>
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
  padding: 5.5rem;
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

.custom-workout-btn.active {
  background: #3a86ff !important;
  color: white;
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
display: flex;
flex-direction: column;
mini-height: 100vh;
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
  height: 100vh;
  width: 100vw;
  position: relative;
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

/* Cosmic Celebration Container */
.cosmic-celebration {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: white;
  font-family: 'Montserrat', sans-serif;
  text-align: center;
  padding: 2rem;
}

/* Floating Emojis Animation */
.emoji-shower {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-emoji {
  position: absolute;
  font-size: 2rem;
  animation: float-up 4s linear infinite;
  animation-delay: calc(var(--i) * 0.8s);
  opacity: 0;
  bottom: -50px;
  left: calc(var(--i) * 20%);
}

@keyframes float-up {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Title Styles */
.celebration-title {
  font-size: 3rem;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
}

.text-gradient {
  background: linear-gradient(90deg, #ff8a00, #e52e71, #00b4db);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient-pulse 3s ease infinite;
}

.sparkle-trail {
  position: absolute;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  bottom: -10px;
  left: 0;
  animation: trail-sparkle 2s ease-in-out infinite;
}

@keyframes gradient-pulse {
  0% { background-size: 100% 100%; }
  50% { background-size: 200% 200%; }
  100% { background-size: 100% 100%; }
}

@keyframes trail-sparkle {
  0% { opacity: 0; transform: scaleX(0); }
  50% { opacity: 1; transform: scaleX(1); }
  100% { opacity: 0; transform: scaleX(0); }
}

/* Stats Deck */
.stats-deck {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 3rem 0;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  min-width: 150px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.hover-glow:hover {
  box-shadow: 0 0 15px rgba(255, 138, 0, 0.6);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: block;
}

.stat-value {
  font-size: 2.8rem;
  font-weight: 700;
  display: block;
  margin-bottom: 0.3rem;
}

.cosmic-text {
  background: linear-gradient(90deg, #00d2ff, #3a7bd5);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(58, 123, 213, 0.3);
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Power Button */
.power-button {
  position: relative;
  background: linear-gradient(90deg, #ff5e62, #ff9966);
  border: none;
  color: white;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 1;
  margin-top: 2rem;
  box-shadow: 0 4px 15px rgba(255, 94, 98, 0.4);
}

.power-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 94, 98, 0.6);
}

.power-button:active {
  transform: translateY(1px);
}

.button-sparkle {
  position: absolute;
  font-size: 1rem;
  animation: sparkle-twinkle 1.5s ease-in-out infinite;
  opacity: 0;
}

.button-aura {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.power-button:hover .button-aura {
  opacity: 0.3;
}

@keyframes sparkle-twinkle {
  0% { transform: translate(0, 0) scale(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translate(20px, -20px) scale(1.5); opacity: 0; }
}

/* Motivational Quote */
.motivational-quote {
  margin-top: 2rem;
  font-style: italic;
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn 2s ease;
}

/* Mascot Animation */
.celebratory-mascot {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.mascot-jump {
  font-size: 3rem;
  animation: jump 1.5s ease infinite;
}

.mascot-confetti::before {
  content: "🎊";
  position: absolute;
  font-size: 1.5rem;
  animation: confetti-fall 3s linear infinite;
}

@keyframes jump {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}

@keyframes confetti-fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .celebration-title {
    font-size: 2rem;
  }
  
  .stats-deck {
    flex-direction: column;
    align-items: center;
  }
  
  .stat-card {
    width: 80%;
  }
  
  .celebratory-mascot {
    position: relative;
    bottom: auto;
    right: auto;
    margin-top: 2rem;
  }
}
/* Container with auto-hide behavior */
.workout-controls-container {
  position: fixed;
  bottom: 20px;
  left: 20px; /* Changed from center to left */
  width: auto; /* Let the content define the width, or set a fixed width */
  max-width: 400px;
  z-index: 100;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 1;
}


.workout-controls-container:hover,
.workout-controls-container:focus-within {
  opacity: 1 !important;
  transition-delay: 0s !important;
}

.workout-controls-container.inactive {
  opacity: 0.3;
}

/* Compact Controls */
.workout-controls {
  display: flex;
  gap: 8px;
  padding: 10px;
  background: rgba(40, 40, 40, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Minimalist Buttons */
.nav-button {
  padding: 8px 12px;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.set-reps-button { background: #3498db; color: white; }
.skip-button { background: #2ecc71; color: white; }
.skip-button.disabled { background: #555; opacity: 0.7; }
.cancel-button { background: #e74c3c; color: white; }

/* Tiny Input Container */
.rep-input-container {
  display: flex;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
  overflow: hidden;
}

.rep-input-container input {
  width: 50px;
  padding: 8px;
  border: none;
  text-align: center;
  background: transparent;
}

.apply-button {
  padding: 0 10px;
  background: #27ae60;
  color: white;
  border: none;
  cursor: pointer;
}

/* Compact Timer */
.timer-display {
  margin-left: auto;
  padding: 8px 12px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: white;
}

/* Auto-hide Animation */
@keyframes fadeOut {
  to { opacity: 0.3; }
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
