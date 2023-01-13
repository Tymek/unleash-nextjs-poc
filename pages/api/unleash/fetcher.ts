import type { NextRequest } from "next/server";
import pkg from "../../../package.json";
import { unleashFetcher } from "../../../vendor/unleash-nextjs/fetcher";
import { handleError } from "../../../vendor/unleash-nextjs/utils";

// export const config = {
//   runtime: "experimental-edge",
// };

export default async function handler(req: NextRequest) {
  const serverSecret =
    req.nextUrl.searchParams.get("serverSecret") || undefined;

  try {
    const response = await unleashFetcher({
      serverSecret,
      appName: `nextjs_${pkg.name}_${pkg.version}`,
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "content-type": "application/json",
        // https://vercel.com/docs/concepts/edge-network/caching
        "cache-control":
          process.env.UNLEASH_CACHE_CONTROL ||
          "public, s-maxage=1, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    return handleError(error as Error);
  }
}
