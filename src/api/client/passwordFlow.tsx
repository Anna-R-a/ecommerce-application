import {
  AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
  TokenCache,
} from "@commercetools/sdk-client-v2";
import { createTokenCache } from "../token/tokenCache";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

const tokenCache = createTokenCache();

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: `${process.env.REACT_APP_USER_CTP_AUTH_URL}`,
  projectKey: `${process.env.REACT_APP_USER_CTP_PROJECT_KEY}`,
  credentials: {
    clientId: `${process.env.REACT_APP_USER_CTP_CLIENT_ID}`,
    clientSecret: `${process.env.REACT_APP_USER_CTP_CLIENT_SECRET}`,
  },
  scopes: [`${process.env.REACT_APP_USER_CTP_SCOPES}`],
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
  host: `${process.env.REACT_APP_USER_CTP_AUTH_URL}`,
  projectKey: `${process.env.REACT_APP_USER_CTP_PROJECT_KEY}`,
  credentials: {
    clientId: `${process.env.REACT_APP_USER_CTP_CLIENT_ID}`,
    clientSecret: `${process.env.REACT_APP_USER_CTP_CLIENT_SECRET}`,
    user: {
      username: loginParams.email,
      password: loginParams.password,
    },
  },
  scopes: [`${process.env.REACT_APP_USER_CTP_SCOPES}`],
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: `${process.env.REACT_APP_USER_CTP_API_URL}`,
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
  projectKey: `${process.env.REACT_APP_USER_CTP_PROJECT_KEY}`,
});
