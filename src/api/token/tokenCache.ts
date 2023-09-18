import { TokenStore, TokenCache } from "@commercetools/sdk-client-v2";

export const createTokenCache = () => {
  let tokenStore: TokenStore;
  const tokenName = "accessToken";
  const tokenCache: TokenCache = {
    get() {
      return tokenStore;
    },
    set(tokenStore) {
      localStorage.setItem(`${tokenName}`, JSON.stringify(tokenStore));
    },
  };
  return tokenCache;
};
