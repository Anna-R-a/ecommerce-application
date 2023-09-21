import { CheckboxValueType } from "antd/es/checkbox/Group";
import { apiRoot } from "./client/createClient";
import { apiRootClient } from "./client/defaultFlow";

export const getCategories = async () => {
  return apiRootClient.categories().get().execute();
};

export const getProductType = async (key: string) => {
  return apiRootClient.productTypes().withKey({ key: key }).get().execute();
};

export const getProductsFromCategory = async (
  categoryId: string[],
  sorting: { name: string; price: string },
  filter: { name: string; value: CheckboxValueType[] }[],
  [key1, key2]: [number, number],
  currentPage: number
) => {
  const sortingOptions = [];
  const allCategoriesID = [
    "241d5c5d-f8cc-45be-866f-14af2c0c150c",
    "fcf30caa-46ad-4ac8-b859-3fc0395b791c",
    "1836bc07-4722-42e4-a8cf-5ad943e8da0b",
  ];

  const filterOptions =
    +categoryId.join("") !== 0
      ? [`categories.id:"${categoryId.join('","')}"`]
      : [`categories.id:"${allCategoriesID.join('","')}"`];

  const filterAttributes = filter.map((item) => {
    if (item.value.length > 0) {
      return `variants.attributes.${item.name}.key:"${item.value.join('","')}"`;
    }
    return ``;
  });

  if (filter.length > 0) {
    filterOptions.push(...filterAttributes);
  }

  filterOptions.push(
    `variants.price.centAmount:range (${key1 * 100} to ${key2 * 100})`
  );

  sorting.name
    ? sortingOptions.push(`name.en ${sorting.name}`)
    : sorting.price
    ? sortingOptions.push(`price ${sorting.price}`)
    : sortingOptions.push("id asc");

  const countProductsPerPage = 12;

  return apiRootClient
    .productProjections()
    .search()
    .get({
      queryArgs: {
        limit: countProductsPerPage,
        offset: (currentPage - 1) * countProductsPerPage,
        filter: filterOptions,
        sort: sortingOptions,
      },
    })
    .execute();
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

export const getProductDetails = async (childPathArgs: { key: string }) => {
  return apiRoot.products().withKey(childPathArgs).get().execute();
};
