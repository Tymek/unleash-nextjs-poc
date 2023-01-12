import type { NextRequest } from "next/server";
import { addBasePath } from "next/dist/client/add-base-path";
import {
  UnleashFetcherResponse,
  unleashResolver,
  UnleashResolverResponse,
} from "../../../vendor/unleash-nextjs";
import { handleError } from "../../../vendor/unleash-nextjs/utils";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  // FIXME: add context
  const context = {};

  try {
    const clientKey = req.nextUrl.searchParams.get("clientKey") || undefined;
    const protocol = req.url.startsWith("https") ? "https" : "http";
    const apiPath = "/api/unleash/fetcher";
    const serverSecret = process.env.UNLEASH_SERVER_SECRET || "";
    const baseUrl = `${protocol}://${req.headers.get("host")}`;

    const fetcherResponse: UnleashFetcherResponse = await fetch(
      `${baseUrl}${addBasePath(apiPath, true)}?serverSecret=${serverSecret}`
    ).then((res) => res.json());

    const toggles = unleashResolver(fetcherResponse, context, clientKey);

    const response: UnleashResolverResponse = {
      toggles,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    return handleError(error as Error);
  }
}
