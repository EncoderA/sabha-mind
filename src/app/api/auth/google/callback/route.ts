import { NextResponse } from 'next/server';

// MOCK ENDPOINT - For frontend testing only
// Replace with real backend implementation in production
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code provided' },
      { status: 400 }
    );
  }

  // Mock successful authentication
  // In production, this would validate the code and return real tokens
  return NextResponse.json({
    accessToken: code,
    refreshToken: 'mock_refresh_token_' + Date.now(),
    user: {
      id: 'mock_user_id',
      email: 'user@example.com',
      name: 'Test User',
    },
  });
}
