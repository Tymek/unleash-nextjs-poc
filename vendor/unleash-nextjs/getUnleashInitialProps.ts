import { NextPageContext } from "next";
import { addBasePath } from "next/dist/client/add-base-path";
import { IMutableContext } from "../unleash-proxy-client-js";
import { UnleashResolverResponse } from "./types";

export type UnleashInitialProps = {
  unleash: Partial<UnleashResolverResponse> & {
    url: string;
    context: IMutableContext;
  };
};

export const getUnleashInitialProps = async (
  ctx: NextPageContext,
  apiEndpoint = `/api/unleash/resolver`
): Promise<UnleashInitialProps> => {
  const { req } = ctx;
  const context: IMutableContext = {
    remoteAddress: req?.socket.remoteAddress || "::1",
    properties: {
      userAgent: (req ? req.headers["user-agent"] : navigator.userAgent) || "",
    },
  };
  const protocol = req?.url?.startsWith("https") ? "https" : "http";
  const host = req?.headers.host;
  const resolverUrl = `${protocol}://${host}${addBasePath(apiEndpoint, true)}`;

  // FIXME: pass context - use cookies
  const unleash: UnleashResolverResponse = await fetch(resolverUrl)
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return {};
    });

  return {
    unleash: {
      ...unleash,
      context,
      url: resolverUrl,
    },
  };
};
