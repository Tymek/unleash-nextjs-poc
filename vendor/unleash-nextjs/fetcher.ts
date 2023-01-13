import { ClientFeaturesResponse, UnleashFetcherResponse } from "./types";
import { safeCompare } from "./utils";

export const unleashFetcher = async ({
  serverSecret,
  appName: appNameOverride,
  baseUrl,
}: {
  serverSecret?: string;
  appName?: string;
  baseUrl?: string;
}) => {
  const appName = appNameOverride || process.env.UNLEASH_APP_NAME || "nextjs";
  if (!(baseUrl || process.env.UNLEASH_BASE_URL)) {
    console.warn(
      'No "UNLEASH_BASE_URL" env var set. Using "http://localhost:4242/api" as default.'
    );
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "UNLEASH-APPNAME": appName,
    "User-Agent": appName,
  };

  if (process.env.UNLEASH_API_TOKEN) {
    headers["Authorization"] = process.env.UNLEASH_API_TOKEN;
  } else {
    console.error("No UNLEASH_API_TOKEN env var set.");
  }

  if (
    !process.env.UNLEASH_SERVER_SECRET ||
    !serverSecret ||
    !safeCompare(serverSecret, process.env.UNLEASH_SERVER_SECRET)
  ) {
    throw new Error("Unauthorized - serverSecret missing");
  }

  const url =
    baseUrl || process.env.UNLEASH_BASE_URL || "http://localhost:4242/api";

  const features: ClientFeaturesResponse = await fetch(
    `${url}/client/features`,
    {
      method: "GET",
      headers,
    }
  ).then((res) => res.json());

  const response: UnleashFetcherResponse = { ...features, appName };

  return response;
};
