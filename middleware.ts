import { NextRequest, NextResponse } from "next/server";
import {
  flags,
  getSessionCookie,
  parseApiEndpoint,
  UnleashFetcherResponse,
  unleashResolver,
} from "./vendor/unleash-nextjs";

export const config = {
  runtime: "experimental-edge",
  matcher: "/middleware",
};

export default async function middleware(req: NextRequest) {
  const sessionId = getSessionCookie(req);

  const fetcherResponse: UnleashFetcherResponse = await fetch(
    `${parseApiEndpoint("/api/unleash/fetcher", req)}?serverSecret=${
      process.env.UNLEASH_SERVER_SECRET || ""
    }`
  ).then((res) => res.json());
  const resolved = unleashResolver(fetcherResponse, { sessionId });
  const variant = flags(resolved.toggles).getVariant("nextjs-poc")?.payload
    ?.value;

  const url = req.nextUrl.clone();
  url.pathname = `/middleware/${variant === "a" ? "a" : "b"}`;
  const res = NextResponse.rewrite(url);
  res.cookies.set("unleash-session", sessionId);

  return res;
}
