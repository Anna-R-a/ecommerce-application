import {
  CustomerDraft,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";
import { customerData } from "../api/customer/customerData";
import { defaultClient } from "../api/client/createClient";

require("dotenv").config();

export const projectKey = "demo";
const fetch = require("node-fetch");

describe("client builder", () => {
  const authMiddlewareOptions = {
    host: "https://auth.europe-west1.gcp.commercetools.com",
    projectKey: process.env.REACT_APP_ADMIN_CTP_PROJECT_KEY || projectKey,
    credentials: {
      clientId: process.env.REACT_APP_ADMIN_CTP_CLIENT_ID || "",
      clientSecret: process.env.REACT_APP_ADMIN_CTP_CLIENT_SECRET || "",
    },
    oauthUri: process.env.REACT_APP_ADMIN_CTP_AUTH_URL || "",
    scopes: ["manage_project:demo-1"],
    fetch,
  };

  const httpMiddlewareOptions = {
    host: "https://api.europe-west1.gcp.commercetools.com",
    fetch,
  };

  const client = defaultClient(
    httpMiddlewareOptions.host,
    authMiddlewareOptions.credentials,
    authMiddlewareOptions.host,
    authMiddlewareOptions.projectKey,
  )
    .withHttpMiddleware(httpMiddlewareOptions)
    .withClientCredentialsFlow(authMiddlewareOptions)
    .build();
  const apiRootTest = createApiBuilderFromCtpClient(client).withProjectKey({
    projectKey,
  });

  test("should create customer", async () => {
    const createNewCustomer = async (body: CustomerDraft) => {
      return apiRootTest
        .customers()
        .post({
          body,
        })
        .clientRequest();
    };
    const createNewCustomer2 = async (body: CustomerDraft) => {
      return apiRootTest
        .customers()
        .post({
          body,
        })
        .execute();
    };
    expect(createNewCustomer2).toBeTruthy();
    const newCustomer = await createNewCustomer(customerData.customer);
    expect(newCustomer.body).toBeTruthy();
    expect(newCustomer.body.firstName).toBe("John");
    expect(newCustomer.body.email).toBe("johndoe@example.com");
  });
});
