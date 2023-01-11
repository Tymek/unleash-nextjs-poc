import { ComponentProps, FC, ReactNode, useRef } from "react";
import ProxyProvider, { UnleashClient } from "@unleash/proxy-client-react";

type Config = Required<ComponentProps<typeof ProxyProvider>>["config"];

type OptionalProps = "appName" | "clientKey";

type FlagProviderProps = {
  children: ReactNode;
  config: Partial<Pick<Config, OptionalProps>> & Omit<Config, OptionalProps>;
};

export const FlagProvider: FC<FlagProviderProps> = ({ config, ...props }) => {
  const client = useRef(
    new UnleashClient({
      bootstrapOverride: true,
      appName: "nextjs",
      clientKey: "none",
      disableMetrics: true,
      ...config,
    })
  );

  return (
    <ProxyProvider
      {...props}
      startClient={typeof window !== "undefined"}
      unleashClient={client.current}
    />
  );
};
