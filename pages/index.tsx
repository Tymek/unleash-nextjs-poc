import { Layout, Page, Text, Link, Button, List } from "@vercel/examples-ui";

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
            SSR + Client-side rendering (with{" "}
            <code>getInitialProps</code>)
          </Link>
        </li>
        <li>
          <Link href="./static">static</Link>
          {/* TODO: getStaticProps */}
        </li>
        <li>
          <Link href="./with-ssr">middleware</Link>
          {/* TODO: use Edge middleware to A/B test by redirecting to static page */}
        </li>
      </List>
    </Page>
  );
}

Home.Layout = Layout;
