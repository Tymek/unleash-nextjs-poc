import type { ClientFeaturesResponse } from "../other/unleash-client-node";
import { UnleashClient } from "../other/unleash-proxy-client-js";

export type { IMutableContext } from "../other/unleash-proxy-client-js";
export type { ClientFeaturesResponse } from "../other/unleash-client-node";
export type UnleashFetcherResponse = ClientFeaturesResponse & {
  appName: string;
};
export type UnleashResolverResponse = {
  toggles: Required<
    ConstructorParameters<typeof UnleashClient>[0]
  >["bootstrap"];
};
export type UnleashProps = {
  unleash: Partial<UnleashResolverResponse> & {
    url: string;
  };
};
