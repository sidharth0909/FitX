# Fitness Tracker (FitX)

## Overview
FitX is an advanced fitness tracking application built using React and TensorFlow.js for real-time pose estimation. The application helps users monitor their workouts, set fitness goals, and track progress with AI-powered assistance. It offers an interactive workout experience with guided commands and video instructions.

## Features
- **User Authentication**: Secure authentication using Supabase.
- **Dashboard**: After logging in, users are directed to the dashboard where the pose estimation model is initiated.
- **Pose Estimation**: Uses TensorFlow.js for real-time workout tracking and feedback.
- **Workout Selection**: Users can choose from different predefined workout models.
- **Live Camera Integration**: The app opens the camera to track movements and provide real-time guidance.
- **Workout Assistance**: Video tutorials and voice commands assist users during workouts.
- **Goal Setting**: Users can set fitness goals and monitor progress.
- **Timer Functionality**: A built-in timer helps users manage workout duration.
- **Custom Exercises**: Users can create and customize their own exercises.

## Technologies Used
- **Frontend**: React
- **Authentication**: Supabase
- **Machine Learning**: TensorFlow.js (Pose Estimation)
- **Database**: Supabase


## **Project Structure**
- `App.js`: Handles routing and authentication.
- `Dashboard.js`: The main workout interface where users can select plans, perform exercises, and track their progress.
- `ExerciseSelector.js`: Allows users to select and customize workouts.
- `exerciseConfigs.js`: Contains predefined configurations for exercises.
- `Auth.js`: Handles user authentication (login/register).
- `Home.js`: The landing page of the app.


## **1. App.js - Routing & Authentication**

### **Purpose:**
- Manages navigation between different pages.
- Implements protected routes using Supabase authentication.

### **Key Features:**
- Uses `react-router-dom` for navigation.
- Checks user authentication before accessing the `Dashboard`.
- Redirects unauthenticated users to the login page.

```javascript
function ProtectedRoute({ children }) {
  const user = supabase.auth.getUser();
  return user ? children : <Navigate to="/login" />;
}
```

---

## **2. Dashboard.js - Core Workout Component**

### **Purpose:**
- Displays workout options.
- Allows users to select a plan or create a custom workout.
- Integrates TensorFlow.js for exercise recognition.
- Tracks and displays workout progress.

### **Key Features:**
1. **Workout Selection:**
   - Users choose between predefined workout plans or create their own.
   - Custom workouts allow users to manually select exercises and set repetitions or duration.

2. **TensorFlow.js Integration:**
   - The system uses a TensorFlow.js model to analyze user movements through a webcam.
   - The model tracks body posture and counts repetitions.
   - Integration is handled using `@tensorflow-models/posenet`.

3. **Real-Time Progress Tracking:**
   - Circular progress bars indicate exercise completion.
   - Users receive real-time feedback on form and repetition count.

4. **Exercise Execution:**
   - Each exercise has predefined configurations (`EXERCISE_CONFIGS`).
   - The app provides instructions, timers, and video demonstrations.

### **TensorFlow.js Integration:**
#### **How It Works:**
- Uses PoseNet to detect body keypoints.
- Determines exercise state based on predefined angles.
- Counts reps when the movement transitions between defined `up` and `down` states.

```javascript
const poseNetModel = await posenet.load();
const pose = await poseNetModel.estimateSinglePose(videoElement, { flipHorizontal: false });
```
- The detected pose is analyzed to match predefined exercise criteria.

---

## **3. ExerciseSelector.js - Custom Workout Selection**

### **Purpose:**
- Allows users to choose individual exercises and customize reps, sets, or duration.

### **Key Features:**
- Uses `useState` to track user settings.
- Enables selecting exercises from a predefined list (`EXERCISE_CONFIGS`).
- Allows customization of exercise parameters.

```javascript
const handleSettingChange = (exerciseId, field, value) => {
  const numericValue = Math.max(1, parseInt(value) || 1);
  setCustomSettings(prev => ({
    ...prev,
    [exerciseId]: { ...prev[exerciseId], [field]: numericValue }
  }));
};
```

---

## **4. exerciseConfigs.js - Exercise Definitions**

### **Purpose:**
- Defines exercises, including movement ranges, muscles worked, and calorie estimates.

### **Key Features:**
- Contains exercise metadata, including start positions and angles.
- Provides instructions for correct form.
- Defines calorie expenditure per repetition.

```javascript
export const EXERCISE_CONFIGS = {
  push_up: {
    start_state: 'up',
    up_angle: 170,
    down_angle: 90,
    instructions: 'Maintain straight body line, lower chest to floor',
    muscles: 'Chest, Shoulders, Triceps',
  },
};
```

## 🚀 FitX - Project Preview  

### 🏠 Home Page  
![Home Page](https://raw.githubusercontent.com/sidharth0909/FitX/main/public/Home.png)  

### 📊 Dashboard  
![Dashboard](https://raw.githubusercontent.com/sidharth0909/FitX/main/public/Dashboard.png)  

### 🔑 Login Page  
![Login](https://raw.githubusercontent.com/sidharth0909/FitX/main/public/Login.png)  

### 🎯 Workout Customization  
![Custom Workout](https://raw.githubusercontent.com/sidharth0909/FitX/main/public/Custom.png)  

### 🎥 Demo  
![Demo](https://raw.githubusercontent.com/sidharth0909/FitX/main/public/demo.png)


## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/sidharth0909/FitX.git
   ```
2. Navigate to the project directory:
   ```sh
   cd FitX
   ```
3. Install dependencies:
   ```sh
   npm install # or yarn install
   ```
4. Set up environment variables in a `.env` file.
5. Start the development server:
   ```sh
   npm start # or yarn start
   ```

## Usage
- Sign up or log in using Supabase authentication.
- Once logged in, access the dashboard where pose estimation is initiated.
- Select a workout model and begin exercising with AI-powered assistance.
- Follow real-time video tutorials and voice commands for guidance.
- Set fitness goals and track progress over time.
- Utilize the built-in timer for better workout management.
- Create and customize your own exercises.

## **Conclusion**
- The app provides a structured workout experience with AI-powered exercise tracking.
- TensorFlow.js enables real-time rep counting and posture assessment.
- Users can choose between predefined workouts or create their own.
- Authentication ensures secure access to user-specific data.

## Future Scope
- **Wearable Device Integration**: Support for fitness bands and smartwatches for enhanced tracking.
- **AI-based Feedback**: Advanced analysis to provide real-time feedback on posture and movement corrections.
- **Social Features**: Community challenges, leaderboards, and workout-sharing capabilities.
- **Personalized Recommendations**: AI-driven workout and diet plans tailored to individual users.
- **Multi-device Support**: Expanding functionality for mobile and web compatibility.
- **Voice Assistant Integration**: Hands-free interaction using voice commands.
- **Offline Mode**: Allow users to track workouts without an internet connection.

## Contribution
Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch (`feature-branch-name`).
3. Commit your changes.
4. Push the changes and create a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Contact
For any inquiries or support, reach out to [sidharthsaholiya@gmail.com] or create an issue in the repository.

