import { unleashFetcher } from "./fetcher";
import { unleashResolver } from "./resolver";
import { UnleashProps } from "./types";

// TODO: merge with getUnleashProps?
export const getUnleashToggles = async ({
  frontendApiToken: frontendApiTokenOverride,
  appName: appNameOverride,
}: {
  appName?: string;
  frontendApiToken?: string;
}): Promise<UnleashProps["unleash"]["toggles"]> => {
  const appName =
    appNameOverride || process.env.UNLEASH_APP_NAME || "nextjs-static";
  const frontendApiToken =
    frontendApiTokenOverride || process.env.UNLEASH_FRONTEND_API_TOKEN;
  if (frontendApiToken) {
    const frontendApiResponse: { toggles: UnleashProps["unleash"]["toggles"] } =
      await fetch(
        `${process.env.UNLEASH_BASE_URL}/frontend?appName=${appName}`,
        {
          headers: {
            Authorization: frontendApiToken,
            "Content-Type": "application/json",
            "UNLEASH-APPNAME": appName,
            "User-Agent": appName,
          },
        }
      ).then((response) => response.json());

    return frontendApiResponse?.toggles;
  }

  const fetcherResponse = await unleashFetcher({
    serverSecret: process.env.UNLEASH_SERVER_SECRET,
    appName,
  });

  const { toggles } = unleashResolver(fetcherResponse, {});

  return toggles;
};
