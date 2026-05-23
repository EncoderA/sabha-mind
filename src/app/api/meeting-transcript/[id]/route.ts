import { NextResponse } from "next/server";

import { getBotBackendUrl } from "@/lib/bot-backend";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const res = await fetch(`${getBotBackendUrl()}/meeting-transcript/${params.id}`, {
      method: "GET",
    });
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error proxying meeting-transcript:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}