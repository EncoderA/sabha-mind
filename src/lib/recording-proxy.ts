const RECORDING_API_BASE_URL =
  process.env.RECORDING_API_URL ??
  process.env.NEXT_PUBLIC_RECORDING_API_URL ??
  "http://65.2.158.83:5000";

type ProxyOptions = {
  body?: unknown;
  method?: "GET" | "POST";
};

export async function proxyRecordingRequest(
  path: string,
  options: ProxyOptions = {}
) {
  const response = await fetch(`${RECORDING_API_BASE_URL}${path}`, {
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

  const contentType = response.headers.get("content-type") ?? "application/json";
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type": contentType,
    },
  });
}
