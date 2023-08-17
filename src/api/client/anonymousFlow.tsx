import { ClientBuilder, HttpMiddlewareOptions, TokenCache } from "@commercetools/sdk-client-v2";
import { apiAdmin, apiUser } from "../constants";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

type AnonymousAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    anonymousId?: string;
  };
  scopes?: Array<string>;
  oauthUri?: string;
  fetch?: any;
  tokenCache?: TokenCache;
};

export const anonymousAuthMiddlewareOptions: AnonymousAuthMiddlewareOptions = {
  host: apiAdmin.CTP_AUTH_URL,
  projectKey: apiAdmin.CTP_PROJECT_KEY,
  credentials: {
    clientId: apiAdmin.CTP_CLIENT_ID,
    clientSecret: apiAdmin.CTP_CLIENT_SECRET,
    // anonymousId: apiAdmin.CTP_ANONYMOUS_ID,
  },
  scopes: [apiAdmin.CTP_SCOPES],
  fetch: fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUser.CTP_API_URL,
  fetch,
};

export const anonymousClient = new ClientBuilder()
  .withAnonymousSessionFlow(anonymousAuthMiddlewareOptions)
  .withClientCredentialsFlow(anonymousAuthMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRootAnonymous = createApiBuilderFromCtpClient(
  anonymousClient,
).withProjectKey({ projectKey: apiUser.CTP_PROJECT_KEY });

export const getProjectAnonymous = () => {
  return apiRootAnonymous.get().execute();
};
