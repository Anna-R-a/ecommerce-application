import { TokenStore, TokenCache } from "@commercetools/sdk-client-v2";



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
