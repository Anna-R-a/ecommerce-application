import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import { defaultClient } from "../api/client/createClient";

require("dotenv").config();

export const projectKey = "demo";
const fetch = require("node-fetch");

describe("Test cart", () => {
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

  test("should create cart", async () => {
    const createNewCart = async () => {
      return apiRootTest
        .me()
        .carts()
        .post({
          body: {
            currency: "USD",
          },
        })
        .clientRequest();
    };
    const newCart = await createNewCart();
    expect(newCart).toBeTruthy();
    expect(newCart.body).toBeTruthy();
  });

  test("should get active cart", async () => {
    const getNewCart = async () => {
      return apiRootTest.me().activeCart().get().clientRequest();
    };
    const newCart = await getNewCart();
    expect(newCart).toBeTruthy();
  });

  test("should get products", async () => {
    const getProducts = async () => {
      return apiRootTest.products().get().clientRequest();
    };
    const newList = await getProducts();
    expect(newList).toBeTruthy();
  });
});
