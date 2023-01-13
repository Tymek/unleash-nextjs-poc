import type { ClientFeaturesResponse } from "../other/unleash-client-node";
import { IToggle } from "../other/unleash-proxy-client-js";

export type { IMutableContext } from "../other/unleash-proxy-client-js";
export type { ClientFeaturesResponse } from "../other/unleash-client-node";
export type UnleashFetcherResponse = ClientFeaturesResponse & {
  appName: string;
};
export type UnleashProps = {
  unleash: {
    toggles?: IToggle[];
    url?: string;
  };
};
