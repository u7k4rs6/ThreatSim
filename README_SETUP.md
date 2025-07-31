# ThreatSim - Complete Setup Guide

ThreatSim is a comprehensive cybersecurity learning platform with authentication, data persistence, and interactive challenges.

## 🚀 Features

✅ **Authentication System**
- Traditional email/password login
- Google OAuth integration
- Persistent user sessions

✅ **Data Persistence**
- Challenge progress saved automatically
- User statistics tracking
- Achievement system
- Progress bars and analytics

✅ **Challenge Categories**
- Web Exploitation (10 challenges)
- Reverse Engineering (10 challenges) 
- Steganography (10 challenges)
- And more coming soon!

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Google account (for OAuth setup)

## 🛠️ Installation

1. **Clone and Install Dependencies**
   ```bash
   cd ThreatSim-main
   npm install
   ```

2. **Set up Google OAuth (Required for Google Login)**

   a. Go to [Google Cloud Console](https://console.developers.google.com/)
   
   b. Create a new project or select an existing one
   
   c. Enable the Google+ API:
      - Go to "APIs & Services" > "Library"
      - Search for "Google+ API" and enable it
   
   d. Create OAuth 2.0 credentials:
      - Go to "APIs & Services" > "Credentials"
      - Click "Create Credentials" > "OAuth 2.0 Client IDs"
      - Set Application type to "Web application"
      - Add authorized origins:
        - `http://localhost:5173` (for development)
        - Your production domain (if deploying)
      - Add authorized redirect URIs:
        - `http://localhost:5173` (for development)
   
   e. Copy the Client ID

3. **Configure Environment Variables**
   
   Update the `.env` file in the root directory:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
   VITE_APP_NAME=ThreatSim
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. **Open your browser and navigate to** `http://localhost:5173`

## 🔐 Authentication

### Regular Login
- Any email/password combination will work for demo purposes
- Data is stored locally in the browser

### Google Login
- Click the "Sign in with Google" button
- Authenticate with your Google account
- User data is automatically populated from Google profile

## 💾 Data Persistence

All user progress is automatically saved to localStorage:

- **Challenge Progress**: Completion status, scores, and timestamps
- **User Statistics**: Total challenges completed, current level, achievements
- **Session Management**: Login state persists across browser sessions

### Data Storage Keys
- `threatSim_user` - User authentication data
- `threatSim_challenge_{challengeId}_{userId}` - Individual challenge progress
- `threatSim_progress_{userId}` - Overall user progress and statistics

## 🎯 Using the Platform

1. **Login**: Use either regular login or Google OAuth
2. **Navigate**: Go to Simulation Lab → Challenges
3. **Select Category**: Choose Web Exploitation, Reverse Engineering, or Steganography
4. **Solve Challenges**: Complete challenges to earn points and unlock achievements
5. **Track Progress**: View your progress on the dashboard

## 🏗️ Project Structure

```
src/
├── components/
│   ├── challenges/           # Individual challenge components
│   ├── PrivateRoute.tsx     # Route protection
│   ├── ThreatHuntingChallenges.tsx
│   ├── WebExploitation.tsx
│   └── ReverseEngineering.tsx
├── contexts/
│   └── AuthContext.tsx      # Authentication management
├── pages/
│   ├── Login.tsx            # Login page with Google OAuth
│   ├── Journey.tsx          # Main landing page
│   └── SimulationLab.tsx    # Protected lab environment
├── utils/
│   └── dataStorage.ts       # Data persistence utilities
└── main.tsx                 # App entry point
```

## 🔧 Troubleshooting

### Google OAuth Issues
1. **"Invalid Client ID"**: Make sure your client ID is correctly set in `.env`
2. **"Unauthorized Origin"**: Add your domain to authorized origins in Google Console
3. **"Popup Blocked"**: Allow popups for the authentication flow

### Data Not Saving
1. Check browser localStorage is enabled
2. Ensure you're logged in before attempting challenges
3. Clear browser cache and try again

### Development Issues
1. **Port conflicts**: Change the port in `vite.config.ts` if needed
2. **Module errors**: Delete `node_modules` and run `npm install` again

## 🚀 Deployment

For production deployment:

1. Update `.env` with production Google OAuth settings
2. Add your production domain to Google Console authorized origins
3. Build the project: `npm run build`
4. Deploy the `dist` folder to your hosting service

## 📝 Development Notes

- The app uses React 18 with TypeScript
- Styling is done with Tailwind CSS
- State management via React Context
- Local storage for data persistence
- React Router for navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 🎉 You're All Set!

Your ThreatSim platform is now fully configured with:
- ✅ Working authentication (email + Google OAuth)
- ✅ Data persistence for all challenges
- ✅ Progress tracking and achievements
- ✅ Protected routes and user management

Start your cybersecurity learning journey! 🔐
