import {
  AuthMiddlewareOptions,
  ClientBuilder,
  Credentials,
  HttpMiddlewareOptions,
} from "@commercetools/sdk-client-v2";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

export const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: `${process.env.REACT_APP_ADMIN_CTP_AUTH_URL}`,
  projectKey: `${process.env.REACT_APP_ADMIN_CTP_PROJECT_KEY}`,
  credentials: {
    clientId: `${process.env.REACT_APP_ADMIN_CTP_CLIENT_ID}`,
    clientSecret: `${process.env.REACT_APP_ADMIN_CTP_CLIENT_SECRET}`,
  },
  scopes: [`${process.env.REACT_APP_ADMIN_CTP_SCOPES}`],
  fetch,
};

export const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: `${process.env.REACT_APP_ADMIN_CTP_API_URL}`,
  fetch,
};

export const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

  export const defaultClient = (
    baseUri: string,
    credentials: Credentials,
    oauthUri?: string,
    projectKey?: string
  ): ClientBuilder => {
    return new ClientBuilder().withClientCredentialsFlow({
      host: oauthUri as string,
      projectKey: projectKey as string,
      credentials,
    })
      .withHttpMiddleware({
        host: baseUri,
        fetch: fetch,
      })
      .withLoggerMiddleware()
  }

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: `${process.env.REACT_APP_ADMIN_CTP_PROJECT_KEY}`,
});

