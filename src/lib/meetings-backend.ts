export function getMeetingsBackendUrl() {
  const backendUrl =
    process.env.MEETINGS_API_URL ?? process.env.NEXT_PUBLIC_MEETINGS_API_URL;

  if (!backendUrl) {
    throw new Error("MEETINGS_API_URL or NEXT_PUBLIC_MEETINGS_API_URL is not configured");
  }

  return backendUrl.replace(/\/$/, "");
}
