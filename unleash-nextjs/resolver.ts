import { ClientFeaturesResponse } from "unleash-client";
import { ToggleEngine } from "unleash-on-the-edge/dist/engine/unleash-engine";
import { UnleashClient } from "unleash-proxy-client";

export const unleashResolver = (
  clientFeatures: ClientFeaturesResponse,
  context: Record<string, any> = {}
) => {
  const engine = new ToggleEngine(clientFeatures);

  const output: ConstructorParameters<typeof UnleashClient>[0]["bootstrap"] =
    [];

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
