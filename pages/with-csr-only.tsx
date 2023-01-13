import { NextPage } from "next";
import { Page } from "@vercel/examples-ui";
import { SimplePage } from "../components/SimplePage";
import {
  FlagProvider,
  getUnleashProps,
  parseApiEndpoint,
  useFlagsStatus,
} from "../vendor/unleash-nextjs";

const LoadingWrapper = () => {
  const { flagsReady } = useFlagsStatus();

  if (!flagsReady) {
    return <Page>Loading...</Page>;
  }

  return <SimplePage />;
};

const CsrPage: NextPage = () => (
  <FlagProvider
    config={{
      url: parseApiEndpoint("/api/unleash/resolver"),
    }}
  >
    <LoadingWrapper />
  </FlagProvider>
);

CsrPage.getInitialProps = async (ctx) => getUnleashProps(ctx);

export default CsrPage;
