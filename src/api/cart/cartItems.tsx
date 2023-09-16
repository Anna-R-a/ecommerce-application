import {  getActiveCart } from "../api"
import { getTokenClient } from "../client/withTokenClient";
import { apiRootAnonymous } from "../client/anonymousFlow";


export const removeProductFromCart = async(lineItemId: string) => {

  const tokenLoggedClient = getTokenClient();
  const tokenClient = tokenLoggedClient ? tokenLoggedClient : apiRootAnonymous;

  const activeCart = await getActiveCart();
  const cartId = activeCart.body.id;
  const cartVersion = activeCart.body.version;
    return tokenClient
      ?.me()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: "removeLineItem",
              lineItemId: lineItemId,
            },
          ],
        },
      })
      .execute();
  }


