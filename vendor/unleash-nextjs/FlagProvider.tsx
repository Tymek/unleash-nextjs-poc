import { ComponentProps, FC } from "react";
import { FlagProvider as ReactFlagProvider } from "../other/proxy-client-react";

type Config = Required<ComponentProps<typeof ReactFlagProvider>>["config"];

type FlagProviderProps = {
  config: Partial<Config>;
} & Omit<ComponentProps<typeof ReactFlagProvider>, "config">;

export const FlagProvider: FC<FlagProviderProps> = ({ ...props }) => (
  <ReactFlagProvider
    startClient={typeof window !== "undefined" && !!props.config.url}
    {...props}
    config={{
      url: props.config.url || "http://localhost",
      appName: "nextjs",
      clientKey: "none",
      disableMetrics: true,
      refreshInterval: 7,
      bootstrapOverride: true,
      ...props.config,
    }}
  />
);
