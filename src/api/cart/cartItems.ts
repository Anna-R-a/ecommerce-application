import { getTokenClient } from "../client/withTokenClient";
import { apiRootAnonymous } from "../client/anonymousFlow";

const getTokenClientByFlow = () => {
  const tokenLoggedClient = getTokenClient();
  return tokenLoggedClient ? tokenLoggedClient : apiRootAnonymous;
};

export const createCart = async () => {
  const tokenClient = getTokenClientByFlow();

  return tokenClient
    .me()
    .carts()
    .post({
      body: {
        currency: "USD",
      },
    })
    .execute();
};

export const getActiveCart = async () => {
  const tokenClient = getTokenClientByFlow();

  return tokenClient.me().activeCart().get().execute();
};

export const deleteCart = async () => {
  const tokenClient = getTokenClientByFlow();
  const activeCart = await getActiveCart();

  return tokenClient
    .me()
    .carts()
    .withId({ ID: activeCart.body.id })
    .delete({
      queryArgs: {
        version: activeCart.body.version,
      },
    })
    .execute();
};

export const addProductToCart = async (productId: string) => {
  const tokenClient = getTokenClientByFlow();
  const activeCart = await getActiveCart();

  return tokenClient
    .me()
    .carts()
    .withId({ ID: activeCart.body.id })
    .post({
      body: {
        version: activeCart.body.version,
        actions: [
          {
            action: "addLineItem",
            productId: productId,
          },
        ],
      },
    })
    .execute();
};

export const removeProductFromCart = async (lineItemId: string) => {
  const tokenClient = getTokenClientByFlow();
  const activeCart = await getActiveCart();

  return tokenClient
    .me()
    .carts()
    .withId({ ID: activeCart.body.id })
    .post({
      body: {
        version: activeCart.body.version,
        actions: [
          {
            action: "removeLineItem",
            lineItemId: lineItemId,
          },
        ],
      },
    })
    .execute();
};

export const changeQuantityProductInCart = async (
  productId: string,
  quantity: number,
) => {
  const tokenClient = getTokenClientByFlow();
  const activeCart = await getActiveCart();

  return tokenClient
    .me()
    .carts()
    .withId({ ID: activeCart.body.id })
    .post({
      body: {
        version: activeCart.body.version,
        actions: [
          {
            action: "changeLineItemQuantity",
            lineItemId: productId,
            quantity: quantity,
          },
        ],
      },
    })
    .execute();
};
