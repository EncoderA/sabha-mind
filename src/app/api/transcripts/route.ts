import { NextResponse } from "next/server";

import { getBotBackendUrl, proxyBackendResponse, getAuthHeaders } from "@/lib/bot-backend";

export async function GET(request: Request) {
  try {
    const res = await fetch(`${getBotBackendUrl()}/transcripts`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    return proxyBackendResponse(res);
  } catch (error) {
    console.error("Error proxying transcripts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
