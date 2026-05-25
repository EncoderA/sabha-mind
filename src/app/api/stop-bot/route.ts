import { NextResponse } from "next/server";

import { getBotBackendUrl, proxyBackendResponse } from "@/lib/bot-backend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${getBotBackendUrl()}/stop-bot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return proxyBackendResponse(res);
  } catch (error) {
    console.error("Error proxying stop-bot:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
