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
- **APIs**: HealthKit, Google Fit (future integration plans)

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

