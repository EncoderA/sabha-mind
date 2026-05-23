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

export function getTranscriptItemPreview(item: TranscriptListItem) {
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
