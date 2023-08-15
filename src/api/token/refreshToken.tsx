import { TokenCache } from "@commercetools/sdk-client-v2";
import { apiAdmin } from "../constants";

type RefreshAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
  };
  refreshToken: string;
  tokenCache?: TokenCache;
  scopes?: Array<string>;
  oauthUri?: string;
  fetch?: any;
};

export const options: RefreshAuthMiddlewareOptions = {
  host: apiAdmin.CTP_AUTH_URL,
  projectKey:  apiAdmin.CTP_PROJECT_KEY,
  credentials: {
    clientId: apiAdmin.CTP_CLIENT_ID,
    clientSecret: apiAdmin.CTP_CLIENT_SECRET,
  },
  refreshToken: 'bXvTyxc5yuebdvwTwyXn==',
  // tokenCache: 'TokenCache',
  scopes: [`manage_project:${apiAdmin.CTP_PROJECT_KEY}`],
  fetch: fetch,
};

// const client = new ClientBuilder()
//   .withRefreshTokenFlow(options)
//   // ...
//   .build();