import {
  //AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
  //TokenCache,
} from "@commercetools/sdk-client-v2";
import { createTokenCache } from "../token/tokenCache";
import {
  MyCustomerSignin,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

const tokenCache = createTokenCache();

const getPasswordParams = ({ email, password }: MyCustomerSignin) => {
  return {
    host: `${process.env.REACT_APP_USER_CTP_AUTH_URL}`,
    projectKey: `${process.env.REACT_APP_USER_CTP_PROJECT_KEY}`,
    credentials: {
      clientId: `${process.env.REACT_APP_USER_CTP_CLIENT_ID}`,
      clientSecret: `${process.env.REACT_APP_USER_CTP_CLIENT_SECRET}`,
      user: {
        username: email,
        password: password,
      },
    },
    scopes: [`${process.env.REACT_APP_USER_CTP_SCOPES}`],
    fetch,
    tokenCache,
  };
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: `${process.env.REACT_APP_USER_CTP_API_URL}`,
  fetch,
};

export const createPasswordClient = ({ email, password }: MyCustomerSignin) => {
  const passwordClient = new ClientBuilder()
    //.withClientCredentialsFlow(authMiddlewareOptions)
    .withPasswordFlow(getPasswordParams({ email, password }))
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();

  const apiRootPassword = createApiBuilderFromCtpClient(
    passwordClient
  ).withProjectKey({
    projectKey: `${process.env.REACT_APP_USER_CTP_PROJECT_KEY}`,
  });

  return apiRootPassword;
};
