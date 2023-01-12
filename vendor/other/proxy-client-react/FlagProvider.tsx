/** @format */

import * as React from "react";
import {
  IConfig,
  IMutableContext,
  UnleashClient,
} from "../unleash-proxy-client-js";
import FlagContext, { IFlagContextValue } from "./FlagContext";

export interface IFlagProvider {
  config?: IConfig;
  unleashClient?: UnleashClient;
  startClient?: boolean;
}

const FlagProvider: React.FC<React.PropsWithChildren<IFlagProvider>> = ({
  config,
  children,
  unleashClient,
  startClient = typeof window !== undefined,
}) => {
  if (!config && !unleashClient) {
    console.warn(
      `You must provide either a config or an unleash client to the flag provider. 
      If you are initializing the client in useEffect, you can avoid this warning 
      by checking if the client exists before rendering.`
    );
  }

  const client = React.useRef<UnleashClient>(
    unleashClient || new UnleashClient(config as IConfig)
  );
  const [flagsReady, setFlagsReady] = React.useState(false);
  const [flagsError, setFlagsError] = React.useState(null);
  const isStartedRef = React.useRef(false); // prevent double instantiation, https://github.com/reactwg/react-18/discussions/18
  const flagsErrorRef = React.useRef(null);
  const isCallbackRegisteredRef = React.useRef(false);

  const errorCallback = React.useCallback((e: any) => {
    // Use a ref because regular event handlers are closing over state
    // with stale values:
    flagsErrorRef.current = e;

    if (flagsErrorRef.current === null) {
      setFlagsError(e);
    }
  }, []);
  const readyCallback = React.useCallback(() => {
    setFlagsReady(true);
  }, []);

  React.useEffect(() => {
    if (!isCallbackRegisteredRef.current) {
      client.current.on("ready", readyCallback);
      client.current.on("error", errorCallback);
      isCallbackRegisteredRef.current = true;
    }

    if (!isStartedRef.current && startClient) {
      isStartedRef.current = true;

      client.current.stop(); // defensively stop the client first
      client.current.start();
    }

    // stop unleash client on unmount
    return function cleanup() {
      if (client.current) {
        client.current.off("error", errorCallback);
        client.current.off("ready", readyCallback);
        client.current.stop(); // eslint-disable-line react-hooks/exhaustive-deps
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateContext: IFlagContextValue["updateContext"] = async (
    context: IMutableContext
  ) => {
    await client.current.updateContext(context);
  };

  const isEnabled: IFlagContextValue["isEnabled"] = (toggleName: string) => {
    return client.current.isEnabled(toggleName);
  };

  const getVariant: IFlagContextValue["getVariant"] = (toggleName: string) => {
    return client.current.getVariant(toggleName);
  };

  const on: IFlagContextValue["on"] = (event: any, callback: any, ctx: any) => {
    return client.current.on(event, callback, ctx);
  };

  const context = React.useMemo<IFlagContextValue>(
    () => ({
      on,
      updateContext,
      isEnabled,
      getVariant,
      client: client.current,
      flagsReady,
      flagsError,
      setFlagsReady,
      setFlagsError,
    }),
    [flagsReady, flagsError]
  );

  return (
    <FlagContext.Provider value={context}>{children}</FlagContext.Provider>
  );
};

export default FlagProvider;
