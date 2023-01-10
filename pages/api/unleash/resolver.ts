import type { NextRequest } from "next/server";
import { addBasePath } from "next/dist/client/add-base-path";
import { unleashResolver } from "../../../unleash-nextjs";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  // FIXME: add context
  const context = {};
  const protocol = req.url.startsWith("https") ? "https" : "http";
  const host = req.headers.get("host");
  const fetcherPath = addBasePath("/api/unleash/fetcher", true);
  const token = process.env.UNLEASH_API_TOKEN || "";

  const clientFeatures = await fetch(
    `${protocol}://${host}${fetcherPath}?token=${token}`,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }
  );
  // TODO: fetch error - catch

  const flags = unleashResolver(await clientFeatures.json(), context);

  return new Response(JSON.stringify(flags), {
    status: 200,
    headers: {
      "content-type": "application/json",
      // "cache-control": UNLEASH_CACHE_CONTROL,
    },
  });
}
