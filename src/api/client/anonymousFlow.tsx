import {
  ClientBuilder,
  HttpMiddlewareOptions,
  TokenCache,
} from "@commercetools/sdk-client-v2";
import { apiUser } from "../constants";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import { createTokenCache } from "../token/tokenCache";

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

const tokenCache = createTokenCache();

export const anonymousAuthMiddlewareOptions: AnonymousAuthMiddlewareOptions = {
  host: apiUser.CTP_AUTH_URL,
  projectKey: apiUser.CTP_PROJECT_KEY,
  credentials: {
    clientId: apiUser.CTP_CLIENT_ID,
    clientSecret: apiUser.CTP_CLIENT_SECRET,
    // anonymousId: apiAdmin.CTP_ANONYMOUS_ID,
  },
  scopes: [apiUser.CTP_SCOPES],
  fetch: fetch,
  tokenCache,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUser.CTP_API_URL,
  fetch,
};

export const anonymousClient = new ClientBuilder()
  // .withAnonymousSessionFlow(anonymousAuthMiddlewareOptions)
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
