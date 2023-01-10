import {
  ContextType,
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { UnleashClient } from "unleash-proxy-client";

const UnleashContext = createContext<
  ConstructorParameters<typeof UnleashClient>[0]["bootstrap"]
>([]);

const Provider = UnleashContext.Provider;

const refreshIntervalSec = 5;

export const FeatureFlagsProvider: FC<{
  value: any;
  url: string;
  children: ReactNode;
}> = ({ value, url, children }) => {
  const [flags, setFlags] = useState<ContextType<typeof UnleashContext>>(value);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(url)
        .then((res) => res.json())
        .then((json) => setFlags(json));
    }, refreshIntervalSec * 1000);

    return () => clearInterval(interval);
  }, [url]);

  return <Provider value={flags}>{children}</Provider>;
};

export const useFlag = (name: string) => {
  const flags = useContext(UnleashContext);
  const flag = flags?.find((flag) => flag.name === name);
  const variant = flag?.variant?.enabled ? flag?.variant : undefined;

  return flag?.enabled ? variant || true : false;
};
