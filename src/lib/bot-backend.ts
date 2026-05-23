const DEFAULT_BOT_BACKEND_URL = "http://65.2.158.83:3001";

export function getBotBackendUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_BOT_BACKEND_URL;
}
