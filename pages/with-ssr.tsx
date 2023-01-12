import { NextPage } from "next";
import { SimplePage } from "../components/SimplePage";
import { FlagProvider, getUnleashProps, UnleashProps } from "../vendor/unleash-nextjs";

type Props = UnleashProps;

const Page: NextPage<Props> = ({ unleash }) => (
  <FlagProvider
    config={{
      bootstrap: unleash.toggles,
      url: unleash.url,
    }}
  >
    <SimplePage />
  </FlagProvider>
);

Page.getInitialProps = async (ctx) => getUnleashProps(ctx);

export default Page;
