import type { ClientFeaturesResponse } from "unleash-client";
import { UnleashClient } from "unleash-proxy-client";

export type { ClientFeaturesResponse } from "unleash-client";
export type UnleashFetcherResponse = ClientFeaturesResponse & {
  appName: string;
};
export type UnleashResolverResponse = {
  toggles: Required<
    ConstructorParameters<typeof UnleashClient>[0]
  >["bootstrap"];
};
