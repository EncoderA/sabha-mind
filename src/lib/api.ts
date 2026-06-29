import axios from "axios";

import type {
  BotJob,
  StopBotResponse,
  SubmitLinkResponse,
  TranscriptListItem,
} from "@/lib/bot-api";

const AUTH_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

const API = axios.create({
  baseURL: AUTH_BACKEND_URL,
});

const BASE_URL = AUTH_BACKEND_URL;

type RequestOptions = {
  body?: unknown;
  method?: "GET" | "POST";
};

export async function parseApiResponse<T = unknown>(res: Response) {
  const text = await res.text();

  let data: Record<string, unknown> = {};
  try {
    const parsed = text ? JSON.parse(text) : {};
    data =
      parsed && typeof parsed === "object"
        ? (parsed as Record<string, unknown>)
        : { message: String(parsed) };
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    const details = typeof data.details === "string" ? data.details : "";
    const error = typeof data.error === "string" ? data.error : "";
    const message = typeof data.message === "string" ? data.message : "";
    throw new Error(details || error || message || `HTTP ${res.status}`);
  }

  return data as T;
}

async function requestJson<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(path, {
    cache: "no-store",
    method: options.method ?? "GET",
    headers:
      options.body === undefined
        ? undefined
        : {
            "Content-Type": "application/json",
          },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  return parseApiResponse<T>(response);
}

function parseJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function registerUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
}

export async function loginWithGoogleProfile(profile: {
  googleId: string;
  email: string;
  name?: string;
  picture?: string;
}) {
  const res = await fetch(`${BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Google login failed");
  }

  return res.json() as Promise<{ user: unknown; accessToken: string; refreshToken: string }>;
}

// Recording bot APIs via Next.js proxy (avoids CORS in Meet add-on iframe)
export type { SubmitLinkResponse, TranscriptListItem } from "@/lib/bot-api";

export function submitMeetingLink(url: string) {
  return requestJson<SubmitLinkResponse>("/api/submit-link", {
    method: "POST",
    body: { url },
  });
}

export function getBotJob(jobId: string) {
  return requestJson<BotJob>(`/api/job/${encodeURIComponent(jobId)}`);
}

export function stopBot(jobId: string) {
  return requestJson<StopBotResponse>("/api/stop-bot", {
    method: "POST",
    body: { jobId },
  });
}

export function getAllTranscripts() {
  return requestJson<TranscriptListItem[] | Record<string, unknown>>(
    "/api/transcripts",
  );
}

export function getMeetingTranscript(meetingId: string) {
  return requestJson<Record<string, unknown>>(
    `/api/meeting-transcript/${encodeURIComponent(meetingId)}`,
  );
}

export async function getTranscriptDirect(meetingId: string) {
  const response = await fetch(
    `/api/transcripts/${encodeURIComponent(meetingId)}`,
    { cache: "no-store" },
  );

  const contentType = response.headers.get("Content-Type") ?? "";
  const text = await response.text();

  if (!response.ok) {
    const data = text ? parseJson(text) : null;
    const message =
      typeof data?.error === "string"
        ? data.error
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (contentType.includes("application/json")) {
    return text ? parseJson(text) : null;
  }

  return text;
}

export default API;
