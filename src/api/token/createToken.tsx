import {
  TokenStore,
  TokenCache,
} from "@commercetools/sdk-client-v2";


// let tokenStore: TokenStore;
// export let accessToken: string;

// const tokenCache: TokenCache = {
//   get() {
//     return tokenStore;
//   },
//   set(tokenStore) {
//     accessToken = tokenStore.token;
//   },
// };

// const projectKey = apiAdmin.CTP_PROJECT_KEY;
// const scopes = [apiAdmin.CTP_SCOPES];

// const authMiddlewareOptions: AuthMiddlewareOptions = {
//   host: apiAdmin.CTP_AUTH_URL,
//   projectKey: projectKey,
//   credentials: {
//     clientId: apiAdmin.CTP_CLIENT_ID,
//     clientSecret: apiAdmin.CTP_CLIENT_SECRET,
//   },
//   scopes,
//   fetch,
//   tokenCache,
// };

// const httpMiddlewareOptions: HttpMiddlewareOptions = {
//   host: apiAdmin.CTP_API_URL,
//   fetch,
// };

// export const ctpClient = new ClientBuilder()
//   .withProjectKey(projectKey)
//   .withClientCredentialsFlow(authMiddlewareOptions)
//   .withHttpMiddleware(httpMiddlewareOptions)
//   .withLoggerMiddleware()
//   .build();

// const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
//   projectKey: projectKey,
// });

// export const getProject1 = () => {
//   return apiRoot.get().execute();
// };

// export async function getCustomerToken() {
//   return await getProject1()
//     .then((res) => console.log("resAdmin", res))
//     .then(() => console.log("accessToken", accessToken))
//     .then(() => {
//       return accessToken;
//     })
//     .catch(console.error);
// }

export const createTokenCache = () => {
  let tokenStore: TokenStore;
  const tokenName = "accessToken";
  const tokenCache: TokenCache = {
    get() {
      const token = localStorage.getItem(`${tokenName}`);
      if (token) {
        const tokenObj = JSON.parse(token);
        return tokenObj;
      }
      return tokenStore;
    },
    set(tokenStore) {
      const token = localStorage.getItem(`${tokenName}`);
      if (token) {
        const tokenObj = JSON.parse(token);
        tokenStore = tokenObj;
      } else {
        localStorage.setItem(`${tokenName}`, JSON.stringify(tokenStore));
      }
    },
  };
  return tokenCache;
};

