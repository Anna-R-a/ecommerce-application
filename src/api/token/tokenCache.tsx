import { TokenStore, TokenCache } from "@commercetools/sdk-client-v2";

// export const createTokenCache = () => {
//   let tokenStore: TokenStore;
//   const tokenName = "accessToken";
//   const tokenCache: TokenCache = {
//     get() {
//       const token = localStorage.getItem(`${tokenName}`);
//       //const isLogged = localStorage.getItem("isLogged");
//       console.log("tokenStore get", tokenStore);
//       if (token) {
//         const tokenObj = JSON.parse(token);
//         return tokenObj;
//       }
//       return tokenStore;
//     },
//     set(tokenStore) {
//       console.log("tokenStore set", tokenStore);
//       const token = localStorage.getItem(`${tokenName}`);
//       //const isLogged = localStorage.getItem("isLogged");
//       if (token) {
//         const tokenObj = JSON.parse(token);
//         tokenStore = tokenObj;
//       } else {
//         localStorage.setItem(`${tokenName}`, JSON.stringify(tokenStore));
//       }
//     },
//   };
//   return tokenCache;
// };

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
