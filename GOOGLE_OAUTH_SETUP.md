# Quick Google OAuth Setup Guide

To enable Google Login in ThreatSim, follow these simple steps:

## 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. **Create a new project** (or select existing):
   - Click "Select a project" → "NEW PROJECT"
   - Name it "ThreatSim" or any name you prefer
   - Click "CREATE"

3. **Enable OAuth consent screen**:
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" (for testing)
   - Fill in the required fields:
     - App name: ThreatSim
     - User support email: Your email
     - Developer contact: Your email
   - Click "SAVE AND CONTINUE"
   - Click "SAVE AND CONTINUE" on Scopes (no changes needed)
   - Click "SAVE AND CONTINUE" on Test users (no changes needed)
   - Click "BACK TO DASHBOARD"

4. **Create OAuth credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "CREATE CREDENTIALS" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "ThreatSim Web Client"
   - **Authorized JavaScript origins**:
     - Add: `http://localhost:5173`
     - Add: `http://127.0.0.1:5173`
   - **Authorized redirect URIs**:
     - Add: `http://localhost:5173`
     - Add: `http://127.0.0.1:5173`
   - Click "CREATE"

5. **Copy the Client ID**:
   - A dialog will appear with your Client ID
   - Copy the Client ID (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

## 2. Update Your Environment File

1. Open the `.env` file in your project root
2. Replace the empty `VITE_GOOGLE_CLIENT_ID=` with your actual Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```

## 3. Restart Your Development Server

```bash
npm run dev
```

## 4. Test Google Login

1. Go to `http://localhost:5173`
2. Click "Login"
3. You should now see a "Sign in with Google" button
4. Click it and authenticate with your Google account

## Troubleshooting

**Error: "The OAuth client was not found"**
- Make sure your Client ID is correctly pasted in the `.env` file
- Ensure there are no extra spaces or characters

**Error: "Unauthorized origin"**
- Double-check that you added `http://localhost:5173` to authorized origins in Google Console
- Make sure you're accessing the app from the same URL

**Google button doesn't appear**
- Check if `VITE_GOOGLE_CLIENT_ID` is set in your `.env` file
- Restart your development server after adding the client ID

## Note

- Without Google OAuth setup, the regular email/password login still works perfectly
- Any email/password combination will work for demo purposes
- All challenge progress and user data will be saved locally
