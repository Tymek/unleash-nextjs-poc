import App, { AppContext, AppInitialProps } from "next/app";
import type { AppProps } from "next/app";
import type { LayoutProps } from "@vercel/examples-ui/layout";
import { getLayout } from "@vercel/examples-ui";
import { UnleashClient } from "unleash-proxy-client";
import { addBasePath } from "next/dist/client/add-base-path";
import "@vercel/examples-ui/globals.css";
import { FeatureFlagsProvider } from "../unleash-nextjs/featureFlagsProvider";

type MyAppProps = {
  unleashBootstrap: ConstructorParameters<typeof UnleashClient>[0]["bootstrap"];
  unleashUrl: string;
};

export default function MyApp({ Component, pageProps }: AppProps<MyAppProps>) {
  const Layout = getLayout<LayoutProps>(Component);

  return (
    <FeatureFlagsProvider
      value={pageProps.unleashBootstrap}
      url={pageProps.unleashUrl}
    >
      <Layout
        title="Feature flags with Unleash"
        path="edge-functions/feature-flags-unleash"
        deployButton={{
          env: ["UNLEASH_BASE_URL", "UNLEASH_API_TOKEN"],
        }}
      >
        <Component {...pageProps} />
      </Layout>
    </FeatureFlagsProvider>
  );
}

MyApp.getInitialProps = async (
  appContext: AppContext
): Promise<AppInitialProps<MyAppProps>> => {
  const appProps = await App.getInitialProps(appContext);
  const protocol = appContext.ctx.req?.url?.startsWith("https")
    ? "https"
    : "http";
  const host = appContext.ctx.req?.headers.host;
  const unleashUrl = `${protocol}://${host}${addBasePath(
    `/api/unleash/resolver`,
    true
  )}`;

  // FIXME: pass context - use cookies
  const unleashBootstrap = await fetch(unleashUrl).then((res) => res.json());

  return {
    ...appProps,
    pageProps: { ...appProps.pageProps, unleashBootstrap, unleashUrl },
  };
};
