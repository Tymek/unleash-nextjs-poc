import type { AppProps } from "next/app";
import type { LayoutProps } from "@vercel/examples-ui/layout";
import { getLayout } from "@vercel/examples-ui";
import "@vercel/examples-ui/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component);

  return (
    <Layout
      title="Feature flags with Unleash"
      path="edge-functions/feature-flags-unleash"
      deployButton={{
        env: ["UNLEASH_BASE_URL", "UNLEASH_API_TOKEN", "UNLEASH_SERVER_SECRET"],
      }}
    >
      <Component {...pageProps} />
    </Layout>
  );
}
