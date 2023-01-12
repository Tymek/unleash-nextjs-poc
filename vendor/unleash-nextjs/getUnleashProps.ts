import { GetServerSidePropsContext, NextPageContext } from "next";
import { IMutableContext } from "../other/unleash-proxy-client-js";
import { UnleashProps, UnleashResolverResponse } from "./types";
import { getSessionCookie, parseApiEndpoint } from "./utils";

export const getUnleashProps = async (
  ctx: NextPageContext | GetServerSidePropsContext,
  contextOverride?: Partial<IMutableContext>,
  apiEndpoint = `/api/unleash/resolver`
): Promise<UnleashProps> => {
  const { req } = ctx;
  const context: Partial<IMutableContext> = {};
  if (req?.socket.remoteAddress) {
    context.remoteAddress = req.socket.remoteAddress;
  }
  const cookie = getSessionCookie(req);
  if (cookie) {
    context.sessionId = cookie;
  }
  const resolverUrl = parseApiEndpoint(apiEndpoint, req);

  const unleash: UnleashResolverResponse = await fetch(
    `${resolverUrl}?${new URLSearchParams({
      ...context,
      ...contextOverride,
      properties: JSON.stringify({
        ...context.properties,
        ...contextOverride?.properties,
      }),
    })}`
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return {};
    });

  return {
    unleash: {
      ...unleash,
      url: resolverUrl,
    },
  };
};
