import type { NextRequest } from "next/server";
import { addBasePath } from "next/dist/client/add-base-path";
import { unleashResolver } from "../../../unleash-nextjs";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  const context = {};
  const protocol = req.url.startsWith("https") ? "https" : "http";
  const host = req.headers.get("host");
  const fetcherPath = addBasePath("/api/unleash/fetcher", true);

  const clientFeatures = await fetch(`${protocol}://${host}${fetcherPath}`, {
    method: "GET",
    headers: {
      Authorization: process.env.UNLEASH_API_TOKEN || "",
    },
  });

  const flags = unleashResolver(await clientFeatures.json(), context);

  return new Response(JSON.stringify(flags), {
    status: 200,
    headers: {
      "content-type": "application/json",
      // "cache-control": UNLEASH_CACHE_CONTROL,
    },
  });
}
