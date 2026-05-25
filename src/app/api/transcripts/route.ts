import { NextResponse } from "next/server";

import { getBotBackendUrl, proxyBackendResponse } from "@/lib/bot-backend";

export async function GET() {
  try {
    const res = await fetch(`${getBotBackendUrl()}/transcripts`, {
      method: "GET",
    });

    return proxyBackendResponse(res);
  } catch (error) {
    console.error("Error proxying transcripts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
