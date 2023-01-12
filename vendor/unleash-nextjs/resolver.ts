import { ClientFeaturesResponse } from "../unleash-client-node";
import { ToggleEngine } from "../unleash-engine";
import { UnleashResolverResponse } from "./types";
import { safeCompare } from "./utils";

export const unleashResolver = (
  clientFeatures: ClientFeaturesResponse,
  context: Record<string, any> = {},
  clientKey?: string
) => {
  if (process.env.UNLEASH_CLIENT_KEY) {
    if (!clientKey || safeCompare(clientKey, process.env.UNLEASH_CLIENT_KEY)) {
      throw new Error("Unauthorized - clientKey missing");
    }
  }

  const engine = new ToggleEngine(clientFeatures);

  const output: UnleashResolverResponse["toggles"] = [];

  clientFeatures.features.forEach((feature) => {
    const enabled = engine.isEnabled(feature.name, context);
    if (!enabled) {
      return;
    }

    const variant = engine.getVariant(feature.name, context);

    output.push({
      name: feature.name,
      enabled,
      impressionData: feature.impressionData,
      variant,
    });
  });

  return output;
};
