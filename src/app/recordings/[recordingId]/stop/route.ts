
import { proxyRecordingRequest } from "@/lib/recording-proxy";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ recordingId: string }> }
) {
  const { recordingId } = await params;

  return proxyRecordingRequest(`/recordings/${recordingId}/stop`, {
    method: "POST",
  });
}
