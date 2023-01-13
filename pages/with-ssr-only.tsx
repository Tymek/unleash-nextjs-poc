import { Page, Text } from "@vercel/examples-ui";
import { GetServerSideProps, NextPage } from "next";
import { Toggle } from "../components/Toggle";
import { flags, getUnleashProps, IVariant } from "../vendor/unleash-nextjs";

type Props = {
  flagState: boolean;
  flagVariant: IVariant;
};

const SsrOnlyPage: NextPage<Props> = ({ flagState, flagVariant }) => (
  <Page>
    <Text>
      Flag state: <Toggle enabled={flagState} />
    </Text>
    <Text className="mb-4">
      Flag variant:
      <br />
      <pre>{JSON.stringify(flagVariant, null, 2)}</pre>
    </Text>
    <Text>
      With this example you can keep the name of the feature toggle private.
    </Text>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { unleash } = await getUnleashProps(ctx);

  return {
    props: {
      flagState: flags(unleash.toggles).isEnabled("nextjs-poc"),
      flagVariant: flags(unleash.toggles).getVariant("nextjs-poc"),
    },
  };
};

export default SsrOnlyPage;
