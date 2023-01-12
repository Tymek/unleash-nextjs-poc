import { Page } from "@vercel/examples-ui";
import { GetServerSideProps, NextPage } from "next";
import { Toggle } from "../components/Toggle";
import { flags, getUnleashProps } from "../vendor/unleash-nextjs";

type Props = {
  flagState: boolean;
};

const SsrOnlyPage: NextPage<Props> = ({ flagState }) => (
  <Page>
    Flag state: <Toggle enabled={flagState} />
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { unleash } = await getUnleashProps(ctx);

  return {
    props: {
      flagState: flags(unleash.toggles).isEnabled("nextjs-poc"),
    },
  };
};

export default SsrOnlyPage;
