import { useFlag } from "../vendor/other/proxy-client-react";
import { Page, Text, Link } from "@vercel/examples-ui";
import { FC, ReactNode } from "react";
import { Toggle } from "./Toggle";

export const SimplePage: FC<{ children?: ReactNode }> = ({ children }) => {
  const poc = useFlag("nextjs-poc");

  return (
    <Page>
      <Text variant="h2" className="mb-8">
        Feature flags with{" "}
        <Link href="https://getunleash.io/?ref=nextjs-demo">Unleash</Link>
      </Text>
      <Text className="mb-8">
        Flag is <Toggle enabled={poc} />. (
        <code className="font-mono">`nextjs-poc`</code>)
      </Text>
      {children}
    </Page>
  );
};
