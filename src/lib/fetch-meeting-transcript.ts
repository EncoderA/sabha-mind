import { getMeetingTranscript, getTranscriptDirect } from "@/lib/api";
import { parseMeetingTranscript, type MeetingTranscript } from "@/lib/bot-api";

export async function fetchMeetingTranscript(
  meetingId: string
): Promise<MeetingTranscript | null> {
  const [wrapped, direct] = await Promise.all([
    getMeetingTranscript(meetingId).catch(() => null),
    getTranscriptDirect(meetingId).catch(() => null),
  ]);

  return (
    parseMeetingTranscript(direct) ??
    parseMeetingTranscript(wrapped) ??
    null
  );
}
