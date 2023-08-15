import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
  TokenStore,
  TokenCache,
} from "@commercetools/sdk-client-v2";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import { apiAdmin } from "../constants";

let tokenStore: TokenStore;
let accessToken: string;

const tokenCache: TokenCache = {
  get() {
    return tokenStore;
  },
  set(tokenStore) {
    accessToken = tokenStore.token;
  },
};

const projectKey = apiAdmin.CTP_PROJECT_KEY;
const scopes = [apiAdmin.CTP_SCOPES];

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: apiAdmin.CTP_AUTH_URL,
  projectKey: projectKey,
  credentials: {
    clientId: apiAdmin.CTP_CLIENT_ID,
    clientSecret: apiAdmin.CTP_CLIENT_SECRET,
  },
  scopes,
  fetch,
  tokenCache,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiAdmin.CTP_API_URL,
  fetch,
};

export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: projectKey,
});

export const getProject1 = () => {
  return apiRoot.get().execute();
};

export const token = async () =>
  await getProject1()
    .then((res) => console.log("resAdmin", res))
    .then(() => console.log("accessToken", accessToken))
    .catch(console.error);
