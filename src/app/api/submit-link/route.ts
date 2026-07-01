import { NextResponse } from "next/server";

import { getBotBackendUrl, proxyBackendResponse, getAuthHeaders } from "@/lib/bot-backend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${getBotBackendUrl()}/submit-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify(body),
    });

    return proxyBackendResponse(res);
  } catch (error) {
    console.error("Error proxying submit-link:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
