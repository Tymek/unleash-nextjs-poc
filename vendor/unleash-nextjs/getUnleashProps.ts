import {
  GetServerSidePropsContext,
  GetStaticPropsContext,
  NextPageContext,
} from "next";
import { IMutableContext, IToggle } from "../other/unleash-proxy-client-js";
import { UnleashProps } from "./types";
import { getSessionCookie, parseApiEndpoint } from "./utils";

export const getUnleashProps = async (
  ctx: NextPageContext | GetServerSidePropsContext | GetStaticPropsContext,
  contextOverride?: Partial<IMutableContext>,
  apiEndpoint = `/api/unleash/resolver`,
  fetchOptions?: RequestInit
): Promise<UnleashProps> => {
  const req = (ctx as NextPageContext | GetServerSidePropsContext)?.req;
  const context: Partial<IMutableContext> = {};
  if (req?.socket.remoteAddress) {
    context.remoteAddress = req.socket.remoteAddress;
  }
  const cookie = getSessionCookie(req);
  if (cookie) {
    context.sessionId = cookie;
  }
  const resolverUrl = parseApiEndpoint(apiEndpoint, req);

  const unleash: { toggles: IToggle[] } = await fetch(
    `${resolverUrl}?${new URLSearchParams({
      ...context,
      ...contextOverride,
      properties: JSON.stringify({
        ...context.properties,
        ...contextOverride?.properties,
      }),
    })}`,
    fetchOptions
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
