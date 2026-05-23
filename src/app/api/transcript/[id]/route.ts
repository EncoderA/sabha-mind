import { NextResponse } from "next/server";

import { getBotBackendUrl } from "@/lib/bot-backend";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const res = await fetch(`${getBotBackendUrl()}/transcript/${params.id}`, {
      method: "GET",
    });
    
    // We try to return JSON. If the backend returns some other format, adjust accordingly.
    const contentType = res.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } else {
        const text = await res.text();
        return new NextResponse(text, { status: res.status, headers: { "Content-Type": contentType || "text/plain" } });
    }
  } catch (error) {
    console.error("Error proxying direct transcript:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}