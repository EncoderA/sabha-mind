import { NextResponse } from 'next/server';

// MOCK ENDPOINT - For frontend testing only
// Replace with real backend implementation in production
export async function GET(request: Request) {
  // In a real implementation, this would redirect to Google OAuth
  // For now, we'll simulate a successful login
  
  // Generate a mock token
  const mockToken = 'mock_access_token_' + Date.now();
  // Redirect to callback with mock code
  const callbackUrl = new URL(
    "/auth/callback",
    process.env.NEXT_PUBLIC_APP_URL ?? request.url
  );
  callbackUrl.searchParams.set('code', mockToken);
  
  return NextResponse.redirect(callbackUrl);
}
