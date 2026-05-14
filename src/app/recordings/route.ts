import { proxyRecordingRequest } from "@/lib/recording-proxy";

export async function GET() {
  return proxyRecordingRequest("/recordings");
}
