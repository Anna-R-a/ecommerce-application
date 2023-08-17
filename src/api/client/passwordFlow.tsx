import {
  AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
  TokenCache,
} from "@commercetools/sdk-client-v2";
import { apiUser } from "../constants";
import { createTokenCache } from "../token/tokenCache";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

const tokenCache = createTokenCache();

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: apiUser.CTP_AUTH_URL,
  projectKey: apiUser.CTP_PROJECT_KEY,
  credentials: {
    clientId: apiUser.CTP_CLIENT_ID,
    clientSecret: apiUser.CTP_CLIENT_SECRET,
  },
  scopes: [apiUser.CTP_SCOPES],
  fetch,
  tokenCache,
};

type PasswordAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    user: {
      username: string;
      password: string;
    };
  };
  scopes?: Array<string>;
  tokenCache?: TokenCache;
  oauthUri?: string;
  fetch?: any;
};

type LoginParamsOptions = {
  email: string;
  password: string;
};

const loginParams: LoginParamsOptions = {
  email: "email@email.com",
  password: "password123!Q",
};

export const passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
  host: apiUser.CTP_AUTH_URL,
  projectKey: apiUser.CTP_PROJECT_KEY,
  credentials: {
    clientId: apiUser.CTP_CLIENT_ID,
    clientSecret: apiUser.CTP_CLIENT_SECRET,
    user: {
      username: loginParams.email,
      password: loginParams.password,
    },
  },
  scopes: [apiUser.CTP_SCOPES],
  fetch,
  tokenCache,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUser.CTP_API_URL,
  fetch,
};

export const passwordClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withPasswordFlow(passwordAuthMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRootPassword = createApiBuilderFromCtpClient(
  passwordClient,
).withProjectKey({
  projectKey: apiUser.CTP_PROJECT_KEY,
});
