import { UnleashClient } from "unleash-proxy-client";

export const unleashClient = (
  config: ConstructorParameters<typeof UnleashClient>[0]
) =>
  new UnleashClient({
    refreshInterval: 15,
    disableRefresh: typeof window === "undefined", // SSR
    ...config,
  });
