import Cookies from "js-cookie";
import { Layout, Page, Text, Link, List, Button } from "@vercel/examples-ui";

export default function Home() {
  return (
    <Page>
      <Text variant="h2" className="mb-8">
        Feature flags with{" "}
        <Link href="https://getunleash.io/?ref=nextjs-demo">Unleash</Link>
      </Text>
      <Text>Example implementations:</Text>
      <List variant="ul" className="my-2">
        <li>
          <Link href="./with-ssr">
            SSR + Client-side rendering (with <code>getInitialProps</code>)
          </Link>
        </li>
        <li>
          <Link href="./with-ssr-extend-context">
            SSR + Client-side with additional Unleash context passed
          </Link>
        </li>
        <li>
          <Link href="./ssr-only">Server-side rendering only</Link>
        </li>
        <li>
          <Link href="./static">
            Static rendering (on build time only or ISR)
          </Link>
        </li>
        <li>
          <Link href="./middleware">Middleware (A/B testing)</Link>
        </li>
      </List>
      <Button
        className="mt-6"
        variant="secondary"
        onClick={() => {
          Cookies.remove("unleash-session");
          window.location.reload();
        }}
      >
        Reset session cookie
      </Button>
    </Page>
  );
}

Home.Layout = Layout;
