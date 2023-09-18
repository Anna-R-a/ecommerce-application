import {
  ClientBuilder,
  HttpMiddlewareOptions,
  TokenCache,
} from "@commercetools/sdk-client-v2";
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
  host: `${process.env.REACT_APP_USER_CTP_AUTH_URL}`,
  projectKey: `${process.env.REACT_APP_USER_CTP_PROJECT_KEY}`,
  credentials: {
    clientId: `${process.env.REACT_APP_USER_CTP_CLIENT_ID}`,
    clientSecret: `${process.env.REACT_APP_USER_CTP_CLIENT_SECRET}`,
  },
  scopes: [`${process.env.REACT_APP_USER_CTP_SCOPES}`],
  fetch: fetch,
  tokenCache,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: `${process.env.REACT_APP_USER_CTP_API_URL}`,
  fetch,
};

export const anonymousClient = new ClientBuilder()
  .withAnonymousSessionFlow(anonymousAuthMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRootAnonymous = createApiBuilderFromCtpClient(
  anonymousClient
).withProjectKey({
  projectKey: `${process.env.REACT_APP_USER_CTP_PROJECT_KEY}`,
});

export const getProjectAnonymous = () => {
  return apiRootAnonymous.get().execute();
};
