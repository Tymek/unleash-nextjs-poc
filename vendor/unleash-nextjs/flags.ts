import { IToggle, UnleashClient } from "../other/unleash-proxy-client-js";

/**
 * Simplified client
 *
 * TODO: rewrite, remove proxy-client dependency, create "getMetrics" method
 */
export const flags = (input?: IToggle[]) => {
  const client = new UnleashClient({
    url: "http://localhost",
    appName: " ",
    refreshInterval: 0,
    clientKey: " ",
    bootstrap: input || [],
    bootstrapOverride: true,
    disableMetrics: true,
    storageProvider: {
      get: async (_name: string) => {},
      save: async (_name: string, _value: string) => {},
    },
  });

  return {
    getAllToggles: () => client.getAllToggles(),
    isEnabled: (name: string) => client.isEnabled(name),
    getVariant: (name: string) => client.getVariant(name),
  };
};
