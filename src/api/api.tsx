import { CheckboxValueType } from "antd/es/checkbox/Group";
import { apiRootAnonymous } from "./client/anonymousFlow";
import { apiRoot } from "./client/createClient";
import { getTokenClient } from "./client/withTokenClient";
import { apiRootClient } from "./client/defaultFlow";

export const getProducts = () => {
  return apiRootClient.products().get().execute();
};

export const getProductsBySearch = async (text: string) => {
  if (text) {
    return apiRootClient
      .productProjections()
      .search()
      .get({
        queryArgs: {
          offset: 0,
          "text.en": text,
          fuzzy: true,
          fuzzyLevel: 1,
        },
      })
      .execute();
  }
};

export const getProductsFromCategory = async (
  categoryId: string[],
  sorting: { name: string; price: string },
  filter: { name: string; value: CheckboxValueType[] }[],
) => {
  const sortingOptions = [];
  const filterOptions = [`categories.id:"${categoryId.join('","')}"`];
  const filterAttributes = filter.map((item) => {
    if (item.value.length > 0) {
      return `variants.attributes.${item.name}.key:"${item.value.join('","')}"`;
    }
    return ``;
  });
  if (filter.length > 0) {
    filterOptions.push(...filterAttributes);
  }

  sorting.name
    ? sortingOptions.push(`name.en ${sorting.name}`)
    : sorting.price
    ? sortingOptions.push(`price ${sorting.price}`)
    : sortingOptions.push("createdAt asc");

  return apiRootClient
    .productProjections()
    .search()
    .get({
      queryArgs: {
        limit: 100,
        filter: filterOptions,
        sort: sortingOptions,
      },
    })
    .execute();
};

export const getProductPrices = async ([key1, key2]: [number, number]) => {
  return apiRootClient
    .productProjections()
    .search()
    .get({
      queryArgs: {
        limit: 100,
        "filter.query": [
          `variants.price.centAmount:range ( ${key1 * 100} to ${key2 * 100})`,
        ],
      },
    })
    .execute();
};

export const getProductType = async (key: string) => {
  return apiRootClient.productTypes().withKey({ key: key }).get().execute();
};

export const getCategories = async () => {
  return apiRootClient.categories().get().execute();
};

export const createCart = async () => {
  const tokenLoggedClient = getTokenClient();
  const tokenClient = tokenLoggedClient ? tokenLoggedClient : apiRootAnonymous;

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
  const tokenLoggedClient = getTokenClient();
  const tokenClient = tokenLoggedClient ? tokenLoggedClient : apiRootAnonymous;

  // const cartCustomer = localStorage.getItem("cart-customer");
  // if (cartCustomer) {
  //   const activeCart = localStorage.getItem("activeCart");
  //   const idCart = activeCart ? JSON.parse(activeCart).id : "";
  //   console.log("idCart", idCart);
  //   tokenClient.me().carts().replicate().post({body:{
  //     reference:{
  //       id: idCart,
  //       typeId:"cart"
  //     }
  //   }}).execute();
  // }

  return tokenClient.me().activeCart().get().execute();
};

export const addProductToCart = async (productId: string) => {
  const tokenLoggedClient = getTokenClient();
  const tokenClient = tokenLoggedClient ? tokenLoggedClient : apiRootAnonymous;

  const activeCart = await getActiveCart();
  const cartId = activeCart.body.id;
  const cartVersion = activeCart.body.version;

  return tokenClient
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cartVersion,
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

export const getProductDetails = async (childPathArgs: { key: string }) => {
  return apiRoot.products().withKey(childPathArgs).get().execute();
};
