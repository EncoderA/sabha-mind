import { NextResponse } from "next/server";

import { getBotBackendUrl } from "@/lib/bot-backend";

export async function GET() {
  try {
    const res = await fetch(`${getBotBackendUrl()}/transcripts`, {
      method: "GET",
    });
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error proxying transcripts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}