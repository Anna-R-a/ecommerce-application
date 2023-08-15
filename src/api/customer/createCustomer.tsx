import fetch from "node-fetch";
import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from "@commercetools/sdk-client-v2";
import { MyCustomerSignin, createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import { apiAdmin } from "../constants";

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: apiAdmin.CTP_AUTH_URL,
  projectKey: apiAdmin.CTP_PROJECT_KEY,
  credentials: {
    clientId: apiAdmin.CTP_CLIENT_ID,
    clientSecret: apiAdmin.CTP_CLIENT_SECRET,
  },
  scopes: [apiAdmin.CTP_SCOPES],
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiAdmin.CTP_API_URL,
  fetch,
};

export const projectKey = apiAdmin.CTP_PROJECT_KEY;

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: "{projectKey}",
});

export const getProject = () => {
  return apiRoot.get().execute();
};


const createCustomer = () => {
  return apiRoot
    .customers()
    .post({
      body: {
        email: "sdk@example.com",
        password: "examplePassword",
      },
    })
    .execute();
};

// Create the customer and output the Customer ID
createCustomer()
  .then(({ body }) => {
    console.log(body.customer.id);
  })
  .catch(console.error);

  
  export const getCustomer = async ({
    email,
    password
  }: MyCustomerSignin) => {
    return await apiRoot
        .me()
        .login()
        .post({
          body: {
            email,
            password,
          },
        })
        .execute()
  }
