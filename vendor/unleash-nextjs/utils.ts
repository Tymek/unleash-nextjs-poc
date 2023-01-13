import { addBasePath } from "next/dist/client/add-base-path";
import { NextIncomingMessage } from "next/dist/server/request-meta";
import { parse as parseCookies } from "cookie";
import { NextRequest } from "next/server";
import jsCookies from "js-cookie";

/**
 * Do a constant time string comparison. Always compare the complete strings
 * against each other to get a constant time. This method does not short-cut
 * if the two string's length differs.
 *
 * @see https://github.com/Bruce17/safe-compare/blob/a96e0fb1dd1b6e998f657b43987c5b7a6d48186e/index.js#L12-L38
 */
export const safeCompare = function safeCompare(a: string, b: string) {
  let strA = String(a);
  let strB = String(b);
  const lenA = strA.length;
  let result = 0;

  if (lenA !== strB.length) {
    strB = strA;
    result = 1;
  }

  for (let i = 0; i < lenA; i++) {
    result |= strA.charCodeAt(i) ^ strB.charCodeAt(i);
  }

  return result === 0;
};

export const handleError = (error: Error) =>
  new Response(
    JSON.stringify({
      error: error?.message || "Unknown server error",
    }),
    {
      status: error?.message?.includes("Unauthorized") ? 401 : 500,
      headers: {
        "content-type": "application/json",
      },
    }
  );

export const parseApiEndpoint = (
  apiEndpoint: string,
  req?: NextIncomingMessage | NextRequest
) => {
  if (apiEndpoint.startsWith("http")) {
    return apiEndpoint;
  }

  if ((req as NextIncomingMessage)?.headers?.host) {
    const protocol = req?.url?.startsWith("https") ? "https" : "http";
    const host = (req as NextIncomingMessage)?.headers.host;
    return `${protocol}://${host}${addBasePath(apiEndpoint, true)}`;
  }

  if ((req as NextRequest)?.headers.get("host")) {
    const protocol = req?.url?.startsWith("https") ? "https" : "http";
    const host = (req as NextRequest).headers.get("host");
    return `${protocol}://${host}${addBasePath(apiEndpoint, true)}`;
  }

  if (typeof window !== "undefined") {
    const protocol = window?.location?.protocol;
    const host = window?.location?.host;
    return `${protocol}//${host}${addBasePath(apiEndpoint, true)}`;
  }

  return apiEndpoint;
};

export const getSessionCookie = (
  req?: NextIncomingMessage | NextRequest,
  name = "unleash-session"
) => {
  const randomSessionId = `${Math.floor(Math.random() * 1_000_000_000)}`;

  if (typeof window !== "undefined") {
    return jsCookies.get(name) || randomSessionId;
  }

  if ((req as NextIncomingMessage)?.headers?.cookie) {
    return parseCookies((req as NextIncomingMessage)?.headers?.cookie || "")?.[
      name
    ];
  }

  return (req as NextRequest)?.cookies.get?.(name)?.value || randomSessionId;
};
