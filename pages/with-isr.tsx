import { GetStaticProps, NextPage } from "next";
import pkg from "../package.json";
import { SimplePage } from "../components/SimplePage";
import {
  getUnleashToggles,
  UnleashProps,
  FlagProvider,
} from "../vendor/unleash-nextjs";

type Props = {
  bootstrap: UnleashProps["unleash"]["toggles"];
};

const SsrOnlyPage: NextPage<Props> = ({ bootstrap }) => (
  <FlagProvider
    config={{
      bootstrap,
    }}
  >
    <SimplePage />
  </FlagProvider>
);

export const getStaticProps: GetStaticProps<Props> = async (_ctx) => {
  const appName = `nextjs-static_${pkg.name}_${pkg.version}`; // optional
  const bootstrap = await getUnleashToggles({
    appName,
  });

  return {
    props: {
      bootstrap,
    },
    revalidate: 180,
  };
};

export default SsrOnlyPage;
