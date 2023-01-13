import { ClientFeaturesResponse } from "../other/unleash-client-node";
import { ToggleEngine } from "../other/unleash-engine";
import { IToggle } from "../other/unleash-proxy-client-js";

export const unleashResolver = (
  clientFeatures: ClientFeaturesResponse,
  context: Record<string, any> = {}
) => {
  const engine = new ToggleEngine(clientFeatures);

  const toggles: IToggle[] = [];

  clientFeatures.features.forEach((feature) => {
    const enabled = engine.isEnabled(feature.name, context);
    if (!enabled) {
      return;
    }

    const variant = engine.getVariant(feature.name, context);

    toggles.push({
      name: feature.name,
      enabled,
      impressionData: feature.impressionData,
      variant,
    });
  });

  return { toggles };
};
