import type { AppProps } from "next/app";
import type { LayoutProps } from "@vercel/examples-ui/layout";
import { getLayout, Layout as DefaultLayout } from "@vercel/examples-ui";
import "@vercel/examples-ui/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const PageLayout = getLayout<LayoutProps>(Component);
  const Layout = PageLayout.name === "Noop" ? DefaultLayout : PageLayout;

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
