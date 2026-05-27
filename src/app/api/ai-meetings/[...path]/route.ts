import { NextResponse } from "next/server";

import { proxyBackendResponse } from "@/lib/bot-backend";
import { getMeetingsBackendUrl } from "@/lib/meetings-backend";

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const requestUrl = new URL(request.url);
    const backendUrl = new URL(path.join("/"), `${getMeetingsBackendUrl()}/`);
    backendUrl.search = requestUrl.search;

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: request.headers.get("Accept") ?? "application/json",
      },
      cache: "no-store",
    });

    return proxyBackendResponse(res);
  } catch (error) {
    console.error("Error proxying AI meetings request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
