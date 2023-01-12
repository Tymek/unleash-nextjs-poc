import { NextPage } from "next";
import { SimplePage } from "../components/SimplePage";
import {
  FlagProvider,
  getUnleashProps,
  UnleashProps,
} from "../vendor/unleash-nextjs";
import { Layout } from "@vercel/examples-ui";

type Props = UnleashProps & {
  context: Record<string, any>;
  anotherUnrelatedProp: string;
};

const Page: NextPage<Props> & {
  Layout: typeof Layout;
} = ({ unleash, context }) => (
  <FlagProvider
    startClient={typeof window !== "undefined"}
    config={{
      bootstrap: unleash.toggles,
      url: unleash.url,
      context: context,
    }}
  >
    <SimplePage>
      Context passed to Unleash:
      <br />
      <code>{JSON.stringify(context, null, 2)}</code>
    </SimplePage>
  </FlagProvider>
);

Page.getInitialProps = async (ctx) => {
  const additionalContext = {
    properties: {
      userAgent:
        (ctx?.req ? ctx?.req.headers["user-agent"] : navigator?.userAgent) ||
        "",
      // Append with any other context fields you want to pass to Unleash
    },
  };

  const unleashProps = await getUnleashProps(ctx, additionalContext);

  return {
    ...unleashProps,
    context: additionalContext,
    anotherUnrelatedProp: "pass initial props along",
  };
};

Page.Layout = Layout;

export default Page;
