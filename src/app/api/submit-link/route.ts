import { NextResponse } from "next/server";

import { getBotBackendUrl } from "@/lib/bot-backend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${getBotBackendUrl()}/submit-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error proxying submit-link:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}