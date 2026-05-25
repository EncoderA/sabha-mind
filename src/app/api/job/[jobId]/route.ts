import { NextResponse } from "next/server";

import { getBotBackendUrl, proxyBackendResponse } from "@/lib/bot-backend";

export async function GET(
  request: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params;
    const res = await fetch(
      `${getBotBackendUrl()}/job/${encodeURIComponent(jobId)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return proxyBackendResponse(res);
  } catch (error) {
    console.error("Error proxying job status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
