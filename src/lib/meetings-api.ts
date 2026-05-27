export const MEETINGS_API_URL = process.env.NEXT_PUBLIC_MEETINGS_API_URL;

export function getMeetingsApiUrl() {
  if (!MEETINGS_API_URL) {
    throw new Error("NEXT_PUBLIC_MEETINGS_API_URL is not configured");
  }

  return MEETINGS_API_URL;
}
