const DEFAULT_BOT_BACKEND_URL = "http://65.2.158.83:3001";

export function getBotBackendUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_BOT_BACKEND_URL;
}

export async function proxyBackendResponse(res: Response) {
  const text = await res.text();
  const contentType = res.headers.get("Content-Type") ?? "application/json";

  if (contentType.includes("application/json")) {
    try {
      return Response.json(text ? JSON.parse(text) : {}, { status: res.status });
    } catch {
      return Response.json({ message: text }, { status: res.status });
    }
  }

  return new Response(text, {
    status: res.status,
    headers: { "Content-Type": contentType },
  });
}
