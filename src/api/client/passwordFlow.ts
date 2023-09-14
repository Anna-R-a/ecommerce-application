import {
  //AuthMiddlewareOptions,
  ClientBuilder,
  ExistingTokenMiddlewareOptions,
  HttpMiddlewareOptions,
  //TokenCache,
} from "@commercetools/sdk-client-v2";
import { createTokenCache } from "../token/tokenCache";
import {
  CustomerSignin,
  MyCustomerSignin,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

const tokenCache = createTokenCache();

const getPasswordParams = ({ email, password }: CustomerSignin) => {
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

const accessToken = localStorage.getItem("accessToken");
const authorization = accessToken ? JSON.parse(accessToken).access_token : null;
const options: ExistingTokenMiddlewareOptions = {
  force: true,
};

export const createPasswordClient = ({ email, password }: MyCustomerSignin) => {
  const passwordClient = new ClientBuilder()
    //.withClientCredentialsFlow(authMiddlewareOptions)
    .withExistingTokenFlow(authorization, options)
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
