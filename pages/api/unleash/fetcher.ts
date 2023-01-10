import type { NextRequest } from "next/server";
import pkg from "../../../package.json";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  // FIXME: timing safe compare
  if (!token || token !== process.env.UNLEASH_API_TOKEN) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const appName =
    process.env.UNLEASH_APP_NAME || `nextjs_${pkg.name}_${pkg.version}`;

  const features = await fetch(
    `${process.env.UNLEASH_BASE_URL}/client/features`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "UNLEASH-APPNAME": appName,
        "User-Agent": appName,
        Authorization: token,
      },
    }
  ).then((res) => res.json());

  return new Response(JSON.stringify(features), {
    status: 200,
    headers: {
      "content-type": "application/json",
      /**
       * @see https://vercel.com/docs/concepts/edge-network/caching
       */
      "cache-control":
        process.env.UNLEASH_CACHE_CONTROL ||
        "public, s-maxage=1, stale-while-revalidate=59",
    },
  });
}
