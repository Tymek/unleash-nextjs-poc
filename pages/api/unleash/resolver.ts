import type { NextRequest } from "next/server";
import {
  UnleashFetcherResponse,
  unleashResolver,
  UnleashResolverResponse,
  handleError,
  IMutableContext,
  parseApiEndpoint,
  getSessionCookie,
} from "../../../vendor/unleash-nextjs";

// export const config = {
//   runtime: "experimental-edge",
// };

export default async function handler(req: NextRequest) {
  try {
    const sessionId =
      req.nextUrl.searchParams.get("sessionId") ||
      getSessionCookie(req) ||
      `${Math.floor(Math.random() * 1_000_000_000)}`;
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

    const toggles = unleashResolver(fetcherResponse, context, clientKey);

    const response: UnleashResolverResponse = {
      toggles,
    };

    return new Response(JSON.stringify(response), {
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
