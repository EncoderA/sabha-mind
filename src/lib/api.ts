const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

export type Recording = {
  id?: string;
  recordingId?: string;
  meetUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

type RequestOptions = {
  body?: unknown;
  method?: "GET" | "POST";
};

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

  const text = await response.text();
  const data = text ? parseJson(text) : null;

  if (!response.ok) {
    const message =
      typeof data?.error === "string"
        ? data.error
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
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

export function startRecording(meetUrl: string) {
  return requestJson<Recording>("/recordings/start", {
    method: "POST",
    body: { meetUrl },
  });
}

export function getRecordingStatus(recordingId: string) {
  return requestJson<Recording>(`/recordings/${recordingId}/status`);
}

export function stopRecording(recordingId: string) {
  return requestJson<Recording>(`/recordings/${recordingId}/stop`, {
    method: "POST",
  });
}

export function listRecordings() {
  return requestJson<Recording[] | { recordings: Recording[] }>("/recordings");
}

export function checkRecordingApiHealth() {
  return requestJson<Record<string, unknown>>("/health");
}

export function initiateGoogleLogin() {
  if (USE_MOCK_AUTH) {
    window.location.href = "/api/auth/google";
    return;
  }

  window.location.href = `${BASE_URL}/auth/google`;
}

export async function handleGoogleCallback(code: string) {
  if (USE_MOCK_AUTH) {
    const res = await fetch(`/api/auth/google/callback?code=${code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.json();
  }

  return {
    accessToken: code,
    refreshToken: "",
  };
}
