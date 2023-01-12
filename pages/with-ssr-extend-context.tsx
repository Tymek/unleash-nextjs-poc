import { NextPage } from "next";
import { SimplePage } from "../components/SimplePage";
import FlagProvider from "../vendor/proxy-client-react";
import {
  getUnleashInitialProps,
  UnleashInitialProps,
} from "../vendor/unleash-nextjs/getUnleashInitialProps";
import { Layout } from "@vercel/examples-ui";

type Props = UnleashInitialProps & {
  customValue: string;
};

const Page: NextPage<Props> & {
  Layout: typeof Layout;
} = ({ unleash }) => (
  <FlagProvider
    startClient={typeof window !== "undefined"}
    config={{
      bootstrap: unleash.toggles,
      url: unleash.url,
      context: unleash.context,
      refreshInterval: 7,
      bootstrapOverride: true,
      appName: "nextjs",
      clientKey: "none",
      disableMetrics: true,
    }}
  >
    <SimplePage>
      Context passed to Unleash:
      <br />
      <code>{JSON.stringify(unleash.context, null, 2)}</code>
    </SimplePage>
  </FlagProvider>
);

Page.getInitialProps = async (ctx) => {
  const unleashProps = await getUnleashInitialProps(ctx);

  // TODO: pass custom values to context

  return {
    ...unleashProps,
    customValue: "test",
  };
};

Page.Layout = Layout;

export default Page;
