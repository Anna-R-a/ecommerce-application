import { ClientBuilder } from "@commercetools/sdk-client-v2";
import { httpMiddlewareOptions } from "./createClient";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

export function getToken() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return;
  }

  try {
    const { token } = JSON.parse(accessToken);
    return `Bearer ${token}`;
  } catch (e) {
    return;
  }
}

export const getTokenClient = () => {
  const token = getToken();
  if (!token) {
    return;
  }

  const tokenClient = new ClientBuilder()
    .withExistingTokenFlow(token, {
      force: true,
    })
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();

    console.log("tokenClient", tokenClient);

  const apiTokenClient = createApiBuilderFromCtpClient(
    tokenClient,
  ).withProjectKey({
    projectKey: `${process.env.REACT_APP_USER_CTP_PROJECT_KEY}`,
  });

  return apiTokenClient;
};

// export function getRefreshToken() {
//   const accessToken = localStorage.getItem("accessToken");
//   if (!accessToken) {
//     return;
//   }

//   try {
//     const { refreshToken } = JSON.parse(accessToken);
//     console.log(refreshToken.split(":")[1]);
//     return refreshToken.split(":")[1];
//   } catch (e) {
//     return;
//   }
// }

// export const getRefreshTokenClient = () => {
//   const refreshToken = getRefreshToken();

//   if (!refreshToken) {
//     return;
//   }

//   const refreshOptions = {
//     ...authMiddlewareOptions,
//     refreshToken,
//   };

//   const refreshClient = new ClientBuilder()
//   .withRefreshTokenFlow(refreshOptions)
//   .withHttpMiddleware(httpMiddlewareOptions)
//   .withLoggerMiddleware()
//   .build();

//   return createApiBuilderFromCtpClient(
//     refreshClient
//   ).withProjectKey({
//     projectKey: `${process.env.REACT_APP_USER_CTP_PROJECT_KEY}`,
//   });
// }
