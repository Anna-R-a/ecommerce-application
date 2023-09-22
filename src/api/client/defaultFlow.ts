import {
  AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
} from "@commercetools/sdk-client-v2";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

export const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: `${process.env.REACT_APP_USER_CTP_AUTH_URL}`,
  projectKey: `${process.env.REACT_APP_USER_CTP_PROJECT_KEY}`,
  credentials: {
    clientId: `${process.env.REACT_APP_USER_CTP_CLIENT_ID}`,
    clientSecret: `${process.env.REACT_APP_USER_CTP_CLIENT_SECRET}`,
  },
  scopes: [`${process.env.REACT_APP_USER_CTP_SCOPES}`],
  fetch: fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: `${process.env.REACT_APP_USER_CTP_API_URL}`,
  fetch,
};

const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRootClient = createApiBuilderFromCtpClient(
  ctpClient,
).withProjectKey({
  projectKey: `${process.env.REACT_APP_USER_CTP_PROJECT_KEY}`,
});
