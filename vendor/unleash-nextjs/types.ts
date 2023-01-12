import type { ClientFeaturesResponse } from "../unleash-client-node";
import { UnleashClient } from "../unleash-proxy-client-js";

export type { ClientFeaturesResponse } from "../unleash-client-node";
export type UnleashFetcherResponse = ClientFeaturesResponse & {
  appName: string;
};
export type UnleashResolverResponse = {
  toggles: Required<
    ConstructorParameters<typeof UnleashClient>[0]
  >["bootstrap"];
};
