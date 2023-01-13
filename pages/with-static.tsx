import { GetStaticProps, NextPage } from "next";
import { Link, Text } from "@vercel/examples-ui";
import pkg from "../package.json";
import { SimplePage } from "../components/SimplePage";
import {
  flags,
  getUnleashToggles,
  UnleashProps,
  FlagProvider,
} from "../vendor/unleash-nextjs";

type Props = {
  bootstrap: UnleashProps["unleash"]["toggles"];
  singleFlagValue: boolean;
};

const SsrOnlyPage: NextPage<Props> = ({ bootstrap }) => (
  <FlagProvider
    config={{
      bootstrap,
    }}
  >
    <SimplePage>
      <Text>
        You can get toggles with only{" "}
        <Link href="https://docs.getunleash.io/reference/front-end-api">
          frontend API
        </Link>{" "}
        access. (using <code>UNLEASH_FRONTEND_API_TOKEN</code>)
      </Text>
    </SimplePage>
  </FlagProvider>
);

export const getStaticProps: GetStaticProps<Props> = async (_ctx) => {
  const appName = `nextjs-static_${pkg.name}_${pkg.version}`; // optional
  const bootstrap = await getUnleashToggles({
    appName,
    // frontendApiToken: process.env.UNLEASH_FRONTEND_API_TOKEN, // if env set, try to use frontend api
  });

  return {
    props: {
      bootstrap,
      // You can filter 'bootstrap' toggles, or resolve values right away
      singleFlagValue: flags(bootstrap).isEnabled("nextjs-poc"),
    },
    // revalidate: 180, // enable ISR
  };
};

export default SsrOnlyPage;
