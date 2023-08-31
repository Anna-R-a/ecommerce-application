import { ClientBuilder } from "@commercetools/sdk-client-v2";
import { httpMiddlewareOptions } from "./createClient";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

function getToken() {
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

  const apiTokenClient = createApiBuilderFromCtpClient(
    tokenClient,
  ).withProjectKey({
    projectKey: `${process.env.REACT_APP_USER_CTP_PROJECT_KEY}`,
  });

  return apiTokenClient;
};
