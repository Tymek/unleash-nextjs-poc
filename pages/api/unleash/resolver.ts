import type { NextRequest } from "next/server";
import {
  UnleashFetcherResponse,
  unleashResolver,
  handleError,
  IMutableContext,
  parseApiEndpoint,
  getSessionCookie,
  safeCompare,
} from "../../../vendor/unleash-nextjs";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const sessionId =
      req.nextUrl.searchParams.get("sessionId") ||
      getSessionCookie(req);
    const remoteAddress =
      req.nextUrl.searchParams.get("remoteAddress") ||
      req.headers.get("x-forwarded-for") ||
      req.ip;

    const context: IMutableContext = {
      userId: req.nextUrl.searchParams.get("userId") || undefined,
      sessionId,
      remoteAddress,
    };

    const clientKey = req.nextUrl.searchParams.get("clientKey") || undefined;
    const apiEndpoint = "/api/unleash/fetcher";
    const serverSecret = process.env.UNLEASH_SERVER_SECRET || "";

    const fetcherResponse: UnleashFetcherResponse = await fetch(
      `${parseApiEndpoint(apiEndpoint, req)}?serverSecret=${serverSecret}`
    ).then((res) => res.json());

    if (process.env.UNLEASH_CLIENT_KEY) {
      if (
        !clientKey ||
        safeCompare(clientKey, process.env.UNLEASH_CLIENT_KEY)
      ) {
        throw new Error("Unauthorized - clientKey missing");
      }
    }

    const resolved = unleashResolver(fetcherResponse, context);

    return new Response(JSON.stringify(resolved), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "set-cookie": `unleash-session=${sessionId}; path=/;`,
      },
    });
  } catch (error) {
    return handleError(error as Error);
  }
}
