import { NextPage } from "next";
import { Page } from "@vercel/examples-ui";
import { SimplePage } from "../components/SimplePage";
import {
  FlagProvider,
  getUnleashProps,
  parseApiEndpoint,
  UnleashProps,
  useFlagsStatus,
} from "../vendor/unleash-nextjs";

type Props = UnleashProps;

const LoadingWrapper = () => {
  const { flagsReady } = useFlagsStatus();

  if (!flagsReady) {
    return <Page>Loading...</Page>;
  }

  return <SimplePage />;
};

const CsrPage: NextPage<Props> = ({ unleash }) => (
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
