export type SubmitLinkResponse = {
  jobId?: string;
  id?: string;
  job_id?: string;
  meetingId?: string;
  [key: string]: unknown;
};

export type BotDonePayload = {
  jobId: string;
  meetingId: string;
};

export type TranscriptSegment = {
  id: string;
  meetingId: string;
  start: number;
  end: number;
  text: string;
  speaker: string;
};

export type MeetingTranscript = {
  meetingId: string;
  createdAt?: string;
  segments: TranscriptSegment[];
};

export type TranscriptListItem = {
  id?: string;
  meetingId?: string;
  title?: string;
  summary?: string;
  preview?: string;
  createdAt?: string;
  date?: string;
  duration?: string;
  participantCount?: number;
  segments?: TranscriptSegment[];
  [key: string]: unknown;
};

const JOB_ID_STORAGE_KEY = "meet-addon-job-id";

export function extractMeetingIdFromUrl(meetUrl: string) {
  try {
    const pathname = new URL(meetUrl).pathname.replace(/^\/+/, "");
    return pathname.split("/")[0] ?? "";
  } catch {
    const segment = meetUrl.split("/").filter(Boolean).pop();
    return segment ?? "";
  }
}

export function extractJobId(payload: SubmitLinkResponse | null | undefined) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const candidates = [payload.jobId, payload.id, payload.job_id];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

export function loadStoredJobId() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return sessionStorage.getItem(JOB_ID_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function storeJobId(jobId: string) {
  if (typeof window === "undefined" || !jobId) {
    return;
  }

  try {
    sessionStorage.setItem(JOB_ID_STORAGE_KEY, jobId);
  } catch {
    // ignore quota / private mode
  }
}

export function clearStoredJobId() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.removeItem(JOB_ID_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function normalizeTranscriptList(
  payload: unknown
): TranscriptListItem[] {
  if (Array.isArray(payload)) {
    return payload as TranscriptListItem[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of ["transcripts", "data", "items", "meetings"]) {
      const nested = record[key];
      if (Array.isArray(nested)) {
        return nested as TranscriptListItem[];
      }
    }
  }

  return [];
}

export function getTranscriptItemId(item: TranscriptListItem) {
  const id = item.meetingId ?? item.id;
  return typeof id === "string" ? id : "";
}

export function getTranscriptItemTitle(item: TranscriptListItem) {
  if (typeof item.title === "string" && item.title.trim()) {
    return item.title;
  }

  const id = getTranscriptItemId(item);
  return id ? `Meeting ${id}` : "Meeting transcript";
}

function parseSegment(raw: unknown): TranscriptSegment | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const segment = raw as Record<string, unknown>;
  const text = typeof segment.text === "string" ? segment.text.trim() : "";
  const speaker =
    typeof segment.speaker === "string" ? segment.speaker.trim() : "Unknown";

  if (!text) {
    return null;
  }

  return {
    id: typeof segment.id === "string" ? segment.id : "",
    meetingId:
      typeof segment.meetingId === "string" ? segment.meetingId : "",
    start: typeof segment.start === "number" ? segment.start : 0,
    end: typeof segment.end === "number" ? segment.end : 0,
    text,
    speaker,
  };
}

function findTranscriptRecord(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.segments)) {
    return record;
  }

  for (const key of ["transcript", "data", "meeting", "record", "result"]) {
    const nested = record[key];
    if (
      nested &&
      typeof nested === "object" &&
      Array.isArray((nested as Record<string, unknown>).segments)
    ) {
      return nested as Record<string, unknown>;
    }
  }

  return null;
}

export function parseMeetingTranscript(
  payload: unknown
): MeetingTranscript | null {
  const record = findTranscriptRecord(payload);
  if (!record) {
    return null;
  }

  const rawSegments = record.segments;
  if (!Array.isArray(rawSegments)) {
    return null;
  }

  const segments = rawSegments
    .map(parseSegment)
    .filter((segment): segment is TranscriptSegment => segment !== null);

  const meetingId =
    (typeof record.meetingId === "string" && record.meetingId) ||
    segments[0]?.meetingId ||
    "";

  if (!meetingId && segments.length === 0) {
    return null;
  }

  const createdAt =
    typeof record.createdAt === "string" ? record.createdAt : undefined;

  return {
    meetingId,
    createdAt,
    segments,
  };
}

export function formatSegmentTime(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function formatSegmentRange(start: number, end: number) {
  return `${formatSegmentTime(start)} – ${formatSegmentTime(end)}`;
}

export function getSegmentCount(item: TranscriptListItem) {
  if (Array.isArray(item.segments)) {
    return item.segments.length;
  }
  return 0;
}

export function getTranscriptItemPreview(item: TranscriptListItem) {
  const segments = item.segments;
  if (Array.isArray(segments) && segments.length > 0) {
    const first = segments[0];
    const preview =
      typeof first === "object" && first && "text" in first
        ? String((first as TranscriptSegment).text)
        : "";
    if (preview.trim()) {
      const trimmed = preview.trim();
      const speaker =
        typeof first === "object" && first && "speaker" in first
          ? String((first as TranscriptSegment).speaker)
          : "";
      const line = speaker ? `${speaker}: ${trimmed}` : trimmed;
      return line.length > 160 ? `${line.slice(0, 157)}…` : line;
    }
  }

  for (const key of ["preview", "summary", "transcript", "text"]) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) {
      const trimmed = value.trim();
      return trimmed.length > 160 ? `${trimmed.slice(0, 157)}…` : trimmed;
    }
  }

  return "Open to view transcript.";
}

export function getTranscriptItemDate(item: TranscriptListItem) {
  for (const key of ["createdAt", "date", "updatedAt"]) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
}

export function extractTranscriptBody(
  wrapped: unknown,
  direct: string | Record<string, unknown> | null
) {
  if (typeof direct === "string" && direct.trim()) {
    return direct.trim();
  }

  if (direct && typeof direct === "object") {
    for (const key of ["transcript", "text", "content", "summary", "body"]) {
      const value = direct[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  if (wrapped && typeof wrapped === "object") {
    const record = wrapped as Record<string, unknown>;
    for (const key of ["transcript", "text", "content", "summary", "body", "data"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  if (typeof wrapped === "string" && wrapped.trim()) {
    return wrapped.trim();
  }

  return "";
}
