import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { EXERCISE_CONFIGS } from './exerciseConfigs';

const CustomPoseDetector = ({
  exercise,
  onRepUpdate,
  onGoalReached,
  onError,
  onWebcamReady
}) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const animationRef = useRef(null);
  const sessionRef = useRef({
    state: 'down',
    count: 0,
    config: null
  });

  // BlazePose model initialization for better accuracy
  useEffect(() => {
    let isMounted = true;
    const initModel = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.BlazePose,
          {
            runtime: 'tfjs',
            enableSmoothing: true,
            modelType: 'full'
          }
        );
        
        if (isMounted) {
          detectorRef.current = detector;
          onWebcamReady();
        }
      } catch (err) {
        onError(`Custom model failed to load: ${err.message}`);
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

  useEffect(() => {
    if (!exercise || !detectorRef.current) return;

    const initializeSession = () => {
      const config = EXERCISE_CONFIGS[exercise.id];
      if (!config) {
        onError('Invalid exercise configuration for custom workout');
        return;
      }
      
      sessionRef.current = {
        state: config.start_state || 'neutral',
        count: 0,
        config: {
          ...config,
          goal: exercise.reps || exercise.duration || 0
        }
      };
      onRepUpdate(0);
    };

    initializeSession();
    let isDetecting = true;
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    const detectPose = async () => {
      if (!isDetecting || !video?.readyState) return;

      try {
        const poses = await detectorRef.current.estimatePoses(video);
        const pose = poses[0];
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (pose && sessionRef.current.config) {
          drawCustomPose(ctx, pose.keypoints);
          processCustomExercise(pose.keypoints);
        }
      } catch (err) {
        onError('Custom workout detection failed');
      }
      animationRef.current = requestAnimationFrame(detectPose);
    };

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      animationRef.current = requestAnimationFrame(detectPose);
    }

    return () => {
      isDetecting = false;
      cancelAnimationFrame(animationRef.current);
    };
  }, [exercise]);

  const drawCustomPose = (ctx, keypoints) => {
    // Custom drawing logic for BlazePose model
    keypoints.forEach(kp => {
      if (kp.score > 0.3) {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#FF0000'; // Custom color for workout
        ctx.fill();
      }
    });
  };

  const calculateCustomAngle = (a, b, c) => {
    // Enhanced angle calculation for BlazePose keypoints
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - 
                   Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180 / Math.PI);
    return angle > 180 ? 360 - angle : angle;
  };

  const processCustomExercise = (keypoints) => {
    const config = sessionRef.current.config;
    if (!config || !exercise) return;
  
    let angle;
    switch (exercise.id) {
      case 'bicep_curl':
        angle = calculateCustomAngle(
          keypoints[11], // Left shoulder
          keypoints[13], // Left elbow
          keypoints[15]  // Left wrist
        );
        break;
      case 'squat':
        angle = calculateCustomAngle(
          keypoints[23], // Left hip
          keypoints[25], // Left knee
          keypoints[27]  // Left ankle
        );
        break;
      case 'push_up':
        angle = calculateCustomAngle(
          keypoints[11], // Left shoulder
          keypoints[13], // Left elbow
          keypoints[15]  // Left wrist
        );
        break;
      case 'shoulder_press':
        angle = calculateCustomAngle(
          keypoints[11], // Left shoulder
          keypoints[13], // Left elbow
          keypoints[15]  // Left wrist
        );
        break;
      case 'pull_up':
        angle = calculateCustomAngle(
          keypoints[11], // Left shoulder
          keypoints[13], // Left elbow
          keypoints[15]  // Left wrist
        );
        break;
      case 'lunge':
        angle = calculateCustomAngle(
          keypoints[23], // Left hip
          keypoints[25], // Left knee
          keypoints[27]  // Left ankle
        );
        break;
    }
  
    if (angle !== undefined) {
      if (angle > config.down_angle) {
        if (sessionRef.current.state === 'up') {
          sessionRef.current.count += 1;
          onRepUpdate(sessionRef.current.count);
          if (sessionRef.current.count >= config.goal) {
            onGoalReached();
          }
        }
        sessionRef.current.state = 'down';
      } else if (angle < config.up_angle) {
        sessionRef.current.state = 'up';
      }
    }
  };  

  return (
    <div className="custom-camera-container">
      <Webcam
        ref={webcamRef}
        style={{ position: 'absolute' }}
        videoConstraints={{ facingMode: 'user' }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default CustomPoseDetector;