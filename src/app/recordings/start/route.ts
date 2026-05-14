import { proxyRecordingRequest } from "@/lib/recording-proxy";

export async function POST(request: Request) {
  const body = await request.json();

  return proxyRecordingRequest("/recordings/start", {
    method: "POST",
    body,
  });
}
