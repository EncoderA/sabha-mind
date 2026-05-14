# 🧪 Mock Authentication Guide

## Problem: "This site can't be reached"

This error occurs because the backend server at `http://localhost:5000` is not running.

## ✅ Solution: Mock Authentication (For Testing)

I've added **mock authentication endpoints** so you can test the Google login UI without a backend server.

---

## 🚀 Quick Start

### 1. **Check Your `.env.local` File**

Make sure you have this file in your project root:

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_AUTH=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. **Restart Your Dev Server**

Environment variables require a restart:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### 3. **Test Google Login**

1. Go to `http://localhost:3000/login`
2. Click "Continue with Google"
3. You'll be redirected through mock endpoints
4. Should successfully log you in!

---

## 🔄 How It Works

### Mock Mode (NEXT_PUBLIC_USE_MOCK_AUTH=true)
```
User clicks "Google" 
  → /api/auth/google (Next.js API route)
  → /auth/callback?code=mock_token
  → Stores mock tokens
  → Redirects to /meet-addon/summaries
```

### Real Mode (NEXT_PUBLIC_USE_MOCK_AUTH=false)
```
User clicks "Google"
  → http://localhost:5000/auth/google (Your backend)
  → Google OAuth flow
  → Your backend callback
  → /auth/callback?code=real_token
  → Stores real tokens
  → Redirects to /meet-addon/summaries
```

---

## 📁 Files Added

### Mock API Routes (Next.js):
- `src/app/api/auth/google/route.ts` - Mock Google OAuth initiation
- `src/app/api/auth/google/callback/route.ts` - Mock token exchange

### Updated Files:
- `src/lib/api.ts` - Added mock mode support
- `.env.local` - Configuration file
- `.env.local.example` - Updated template

---

## 🔧 Configuration

### Testing Without Backend (Current Setup):
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

### Using Real Backend:
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🎯 What Gets Mocked

### Mock User Data:
```json
{
  "accessToken": "mock_access_token_1234567890",
  "refreshToken": "mock_refresh_token_1234567890",
  "user": {
    "id": "mock_user_id",
    "email": "user@example.com",
    "name": "Test User"
  }
}
```

### What Works:
- ✅ Google login button
- ✅ OAuth redirect flow
- ✅ Callback handling
- ✅ Token storage
- ✅ Redirect to dashboard
- ✅ UI/UX testing

### What Doesn't Work:
- ❌ Real Google authentication
- ❌ Actual user data
- ❌ Token validation
- ❌ Backend API calls

---

## 🐛 Troubleshooting

### Still Getting "Site Can't Be Reached"?

**1. Check Environment Variable:**
```bash
# Make sure this is set to "true"
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

**2. Restart Dev Server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

**3. Clear Browser Cache:**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

**4. Check Console:**
- Open browser DevTools (F12)
- Look for errors in Console tab
- Check Network tab for failed requests

### Mock Login Not Working?

**Check the URL it's redirecting to:**
- Should be: `http://localhost:3000/api/auth/google`
- NOT: `http://localhost:5000/auth/google`

**Verify .env.local:**
```bash
# Should exist in project root
cat .env.local

# Should contain:
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

---

## 🔄 Switching Between Mock and Real Backend

### Enable Mock Mode:
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

### Enable Real Backend:
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Remember to restart dev server after changing!**

---

## 📝 Notes

- Mock mode is **for frontend testing only**
- Tokens are fake and won't work with real API calls
- Switch to real backend when it's ready
- Mock endpoints are in `src/app/api/auth/google/`

---

## ✅ Checklist

Before testing:
- [ ] `.env.local` file exists
- [ ] `NEXT_PUBLIC_USE_MOCK_AUTH=true` is set
- [ ] Dev server restarted
- [ ] Browser cache cleared
- [ ] Go to `/login` and click "Continue with Google"

---

## 🚀 Next Steps

1. **Test the mock flow** to verify UI/UX
2. **Implement real backend** when ready
3. **Switch to real mode** by setting `NEXT_PUBLIC_USE_MOCK_AUTH=false`
4. **Test with real Google OAuth**

---

## 💡 Pro Tip

You can keep both modes and switch between them easily:

```bash
# For frontend development
NEXT_PUBLIC_USE_MOCK_AUTH=true

# For integration testing
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

This way you can develop the UI without waiting for the backend! 🎉
