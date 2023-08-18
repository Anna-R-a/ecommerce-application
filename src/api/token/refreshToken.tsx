import { TokenCache } from "@commercetools/sdk-client-v2";

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
  host: `${process.env.REACT_APP_ADMIN_CTP_AUTH_URL}`,
  projectKey:`${process.env.REACT_APP_ADMIN_CTP_CLIENT_ID}`,
  credentials: {
    clientId: `${process.env.REACT_APP_ADMIN_CTP_CLIENT_ID}`,
    clientSecret: `${process.env.REACT_APP_ADMIN_CTP_CLIENT_SECRET}`,
  },
  refreshToken: "bXvTyxc5yuebdvwTwyXn==",
  // tokenCache: 'TokenCache',
  scopes: [`manage_project:${process.env.REACT_APP_ADMIN_CTP_PROJECT_KEY}`],
  fetch: fetch,
};

// const client = new ClientBuilder()
//   .withRefreshTokenFlow(options)
//   // ...
//   .build();
