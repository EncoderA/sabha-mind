export function getBotBackendUrl() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured");
  }

  return backendUrl;
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
