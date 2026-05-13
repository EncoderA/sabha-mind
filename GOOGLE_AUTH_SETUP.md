# Google OAuth Setup Guide (Frontend)

This guide explains how the Google OAuth login feature works in the frontend and what your backend needs to implement.

## 🎯 Overview

The frontend implements a **redirect-based OAuth flow** where:
1. User clicks "Continue with Google"
2. Frontend redirects to backend OAuth endpoint
3. Backend handles Google OAuth and redirects back with tokens
4. Frontend stores tokens and logs user in

## 📁 Files Added/Modified

### New Files:
- `src/app/auth/callback/page.tsx` - Handles OAuth callback from backend
- `.env.local.example` - Environment configuration template
- `GOOGLE_AUTH_SETUP.md` - This documentation

### Modified Files:
- `src/lib/api.ts` - Added Google OAuth functions
- `src/app/login/page.tsx` - Added Google login button
- `src/app/register/page.tsx` - Added Google signup button

## 🔧 Frontend Implementation

### 1. API Functions (`src/lib/api.ts`)

```typescript
// Redirects user to backend Google OAuth endpoint
export function initiateGoogleLogin() {
  window.location.href = `${BASE_URL}/auth/google`;
}

// Exchanges OAuth code for tokens
export async function handleGoogleCallback(code: string) {
  const res = await fetch(`${BASE_URL}/auth/google/callback?code=${code}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}
```

### 2. Login/Register Pages

Both pages now have a "Continue with Google" button that calls `initiateGoogleLogin()`.

### 3. Callback Page (`src/app/auth/callback/page.tsx`)

Handles the redirect from your backend after Google authentication:
- Extracts the `code` parameter from URL
- Calls `handleGoogleCallback(code)` to exchange for tokens
- Stores tokens in localStorage
- Redirects to `/meet-addon/summaries`

## 🔌 Backend Requirements

Your backend needs to implement these endpoints:

### 1. **GET /auth/google**
Initiates Google OAuth flow.

**What it should do:**
- Redirect user to Google OAuth consent screen
- Include your Google Client ID
- Set redirect_uri to your backend callback URL
- Request appropriate scopes (email, profile)

**Example Response:**
```
HTTP 302 Redirect to:
https://accounts.google.com/o/oauth2/v2/auth?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=http://localhost:5000/auth/google/callback&
  response_type=code&
  scope=email profile&
  access_type=offline
```

### 2. **GET /auth/google/callback**
Handles Google's redirect after user consent.

**What it should do:**
- Receive authorization code from Google
- Exchange code for Google access token
- Get user info from Google
- Create/find user in your database
- Generate your JWT tokens (accessToken, refreshToken)
- Redirect to frontend callback with code

**Query Parameters:**
- `code` - Authorization code from Google
- `error` - (optional) Error from Google

**Response:**
Redirect to: `http://localhost:3000/auth/callback?code=YOUR_BACKEND_CODE`

Then when frontend calls `/auth/google/callback?code=YOUR_BACKEND_CODE`:

**Response JSON:**
```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Error Response:**
```json
{
  "error": "Authentication failed"
}
```

## 🔐 Backend Implementation Example (Node.js/Express)

```javascript
const express = require('express');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:5000/auth/google/callback'
);

// Step 1: Initiate OAuth
app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['email', 'profile']
  });
  res.redirect(url);
});

// Step 2: Handle Google callback
app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    
    // Find or create user in your database
    let user = await User.findOne({ email: data.email });
    if (!user) {
      user = await User.create({
        email: data.email,
        name: data.name,
        googleId: data.id,
        avatar: data.picture
      });
    }
    
    // Generate your JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Redirect to frontend callback
    res.redirect(`http://localhost:3000/auth/callback?code=${accessToken}`);
    
  } catch (error) {
    res.redirect('http://localhost:3000/auth/callback?error=auth_failed');
  }
});

// Step 3: Exchange code for tokens (called by frontend)
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  
  // Verify and decode the code
  // Return tokens
  res.json({
    accessToken: code, // or decode and return proper tokens
    refreshToken: 'refresh_token_here'
  });
});
```

## 🌐 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback
```

### Backend (.env)
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

## 🚀 Setup Instructions

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback` (backend)
   - `http://localhost:3000/auth/callback` (frontend)
7. Copy Client ID and Client Secret

### 2. Configure Frontend

```bash
# Copy example env file
cp .env.local.example .env.local

# Edit .env.local with your values
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Configure Backend

Add Google credentials to your backend `.env` file.

### 4. Test the Flow

1. Start backend: `npm run dev` (on port 5000)
2. Start frontend: `npm run dev` (on port 3000)
3. Go to `http://localhost:3000/login`
4. Click "Continue with Google"
5. Complete Google authentication
6. Should redirect back and log you in

## 🔍 Flow Diagram

```
User                Frontend              Backend              Google
 |                     |                     |                    |
 |--Click "Google"---->|                     |                    |
 |                     |--Redirect---------->|                    |
 |                     |                     |--OAuth Request---->|
 |                     |                     |                    |
 |<-----------------Google Consent Screen------------------>|
 |                     |                     |                    |
 |                     |                     |<--Auth Code--------|
 |                     |                     |                    |
 |                     |                     |--Get User Info---->|
 |                     |                     |<--User Data--------|
 |                     |                     |                    |
 |                     |<--Redirect w/ code--|                    |
 |                     |                     |                    |
 |                     |--Exchange code----->|                    |
 |                     |<--Tokens------------|                    |
 |                     |                     |                    |
 |<--Logged In---------|                     |                    |
```

## 🐛 Troubleshooting

### "Redirect URI mismatch"
- Ensure redirect URIs in Google Console match exactly
- Check both backend callback and frontend callback URLs

### "Invalid code"
- Code might have expired (10 minutes)
- User might have clicked back button
- Check backend is properly exchanging code for tokens

### "CORS errors"
- Ensure backend has CORS enabled for frontend URL
- Check `Access-Control-Allow-Origin` header

### "Tokens not stored"
- Check browser console for errors
- Verify localStorage is accessible
- Check callback page is receiving tokens

## 📝 Notes

- This implementation uses **redirect-based OAuth** (not popup)
- Tokens are stored in **localStorage** (consider httpOnly cookies for production)
- The flow requires **backend cooperation** - frontend alone cannot complete OAuth
- For production, use HTTPS for all URLs
- Consider implementing PKCE for additional security

## 🔒 Security Considerations

1. **Never expose Client Secret in frontend**
2. Use HTTPS in production
3. Implement CSRF protection
4. Validate tokens on backend
5. Set appropriate token expiration times
6. Consider using httpOnly cookies instead of localStorage
7. Implement rate limiting on auth endpoints

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
