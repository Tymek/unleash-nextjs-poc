import App, { AppContext, AppInitialProps } from "next/app";
import type { AppProps } from "next/app";
import type { LayoutProps } from "@vercel/examples-ui/layout";
import { getLayout } from "@vercel/examples-ui";
import { addBasePath } from "next/dist/client/add-base-path";
import "@vercel/examples-ui/globals.css";
import { FlagProvider, UnleashResolverResponse } from "../unleash-nextjs";

type MyAppProps = {
  unleash: UnleashResolverResponse & {
    url: string;
  };
};

export default function MyApp({ Component, pageProps }: AppProps<MyAppProps>) {
  const Layout = getLayout<LayoutProps>(Component);

  return (
    <FlagProvider
      config={{
        bootstrap: pageProps.unleash.toggles,
        url: pageProps.unleash.url,
        context: {},
        refreshInterval: 5,
      }}
    >
      <Layout
        title="Feature flags with Unleash"
        path="edge-functions/feature-flags-unleash"
        deployButton={{
          env: [
            "UNLEASH_BASE_URL",
            "UNLEASH_API_TOKEN",
            "UNLEASH_SERVER_SECRET",
          ],
        }}
      >
        <Component {...pageProps} />
      </Layout>
    </FlagProvider>
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
  const unleash: UnleashResolverResponse = await fetch(unleashUrl).then((res) =>
    res.json()
  );

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      unleash: {
        toggles: unleash.toggles,
        url: unleashUrl,
      },
    },
  };
};
