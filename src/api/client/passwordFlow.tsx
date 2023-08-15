import { TokenCache } from "@commercetools/sdk-client-v2";
import { apiAdmin } from "../constants";

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

export const passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
  host: apiAdmin.CTP_AUTH_URL,
  projectKey: apiAdmin.CTP_PROJECT_KEY,
  credentials: {
    clientId: apiAdmin.CTP_CLIENT_ID,
    clientSecret: apiAdmin.CTP_CLIENT_SECRET,
    user: {
      username: apiAdmin.USERNAME,
      password: apiAdmin.PASSWORD,
    },
  },
  scopes: [`manage_project:${apiAdmin.CTP_PROJECT_KEY}`],
  fetch: fetch,
};

// const client = new ClientBuilder()
//   .withPasswordFlow(passwordAuthMiddlewareOptions)
//   // ...
//   .build();
