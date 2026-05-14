const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

export async function registerUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
}

// Google OAuth - Redirect to backend OAuth URL or mock endpoint
export function initiateGoogleLogin() {
  if (USE_MOCK_AUTH) {
    // Use Next.js API route for testing
    window.location.href = '/api/auth/google';
  } else {
    // Use real backend
    window.location.href = `${BASE_URL}/auth/google`;
  }
}

// Handle OAuth callback - Exchange code for tokens
export async function handleGoogleCallback(code: string) {
  if (USE_MOCK_AUTH) {
    const res = await fetch(`/api/auth/google/callback?code=${code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.json();
  }

  // For real backend: code IS the access token from the redirect
  // We need to get the refresh token from somewhere
  // Since your backend redirects with just the access token,
  // we'll store it and the backend should have stored the refresh token
  // For now, return the access token and a placeholder for refresh token
  // You might want to modify backend to include refresh token in the redirect
  return {
    accessToken: code,
    refreshToken: '', // Backend stores this, frontend doesn't need it immediately
  };
}