import { ClientBuilder, TokenCache } from "@commercetools/sdk-client-v2";
import { apiAdmin } from "./constants";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import { projectKey } from "./customer/createCustomer";
import { httpMiddlewareOptions } from "./createClient";

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


export const anonymousAuthMiddlewareOptions: AnonymousAuthMiddlewareOptions = {
  host: apiAdmin.CTP_AUTH_URL,
  projectKey:  apiAdmin.CTP_PROJECT_KEY,
  credentials: {
    clientId:apiAdmin.CTP_CLIENT_ID,
    clientSecret: apiAdmin.CTP_CLIENT_SECRET,
    anonymousId:apiAdmin.CTP_ANONYMOUS_ID, 
  },
  scopes: [apiAdmin.CTP_SCOPES],
  fetch: fetch,
};


export const anonymousClient = new ClientBuilder()
.withAnonymousSessionFlow(anonymousAuthMiddlewareOptions)
.withHttpMiddleware(httpMiddlewareOptions)
.withLoggerMiddleware()
.build();


export const apiRootAnonym = createApiBuilderFromCtpClient(anonymousClient)
  .withProjectKey({ projectKey: `${projectKey}` });


export const getProjectAnonym = () => {
  return apiRootAnonym
    .get()
    .execute();
};
