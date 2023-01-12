import { ComponentProps, FC } from "react";
import { FlagProvider as ReactFlagProvider } from "../other/proxy-client-react";

type Config = Required<ComponentProps<typeof ReactFlagProvider>>["config"];

type RequiredProps = "url";

type FlagProviderProps = {
  config: Omit<Partial<Config>, RequiredProps> &
    Pick<Required<Config>, RequiredProps>;
} & Omit<ComponentProps<typeof ReactFlagProvider>, "config">;

export const FlagProvider: FC<FlagProviderProps> = ({ ...props }) => (
  <ReactFlagProvider
    startClient={typeof window !== "undefined"}
    {...props}
    config={{
      appName: "nextjs",
      clientKey: "none",
      disableMetrics: true,
      refreshInterval: 7,
      bootstrapOverride: true,
      ...props.config,
    }}
  />
);
