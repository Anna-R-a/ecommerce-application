import {
  AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
} from "@commercetools/sdk-client-v2";
import { apiAdmin } from "../constants";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

export const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: apiAdmin.CTP_AUTH_URL,
  projectKey: apiAdmin.CTP_PROJECT_KEY,
  credentials: {
    clientId: apiAdmin.CTP_CLIENT_ID,
    clientSecret: apiAdmin.CTP_CLIENT_SECRET,
  },
  scopes: [apiAdmin.CTP_SCOPES],
  fetch,
};

export const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiAdmin.CTP_API_URL,
  fetch,
};

export const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: "application",
});
