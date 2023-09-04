import { CheckboxValueType } from "antd/es/checkbox/Group";
import { apiRootAnonymous } from "./client/anonymousFlow";
import { apiRoot } from "./client/createClient";

export const getProducts = () => {
  return apiRootAnonymous.products().get().execute();
};

export const getProductsBySearch = async (text: string) => {
  if (text) {
    return apiRootAnonymous
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
    return `variants.attributes.${item.name}.key:"${item.value.join('","')}"`;
  });
  if (filter.length > 0) {
    filterOptions.push(...filterAttributes);
  }

  sorting.name
    ? sortingOptions.push(`name.en ${sorting.name}`)
    : sorting.price
    ? sortingOptions.push(`price ${sorting.price}`)
    : sortingOptions.push("createdAt asc");

  return apiRootAnonymous
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: filterOptions,
        sort: sortingOptions,
      },
    })
    .execute();
};

// export const getProductGroups = async (childPathArgs: { key: string }) => {
//    const res = apiRoot.attributeGroups().withKey(childPathArgs).get().execute();

//    return apiRootAnonymous
//    .productProjections()
//    .search()
//    .get({
//      queryArgs: {
//        filter: `variants.attributes.${(await res).body.attributes[0]}.key:"${item.value.join('","')}"`,
//      },
//    })
//    .execute();
// };

export const getProductsAttributes = async (
  filter: { name: string; value: CheckboxValueType[] }[],
) => {
  const filterOptions = filter.map((item) => {
    return `variants.attributes.${item.name}.key:"${item.value.join('","')}"`;
  });
  return apiRootAnonymous
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: filterOptions,
      },
    })
    .execute();
};

export const getProductType = async (key: string) => {
  return apiRootAnonymous.productTypes().withKey({ key: key }).get().execute();
};

export const getCategories = async () => {
  return apiRootAnonymous.categories().get().execute();
};

export const getCategoriesStructure = async () => {
  return apiRootAnonymous
    .categories()
    .get({
      queryArgs: {
        expand: ["parent"],
      },
    })
    .execute();
};

export const getCustomers = async () => {
  return apiRoot.customers().get().execute();
};

export const getProjectDetails = () => {
  return apiRoot.get().execute();
};

export const getProductDetails = async (childPathArgs: { key: string }) => {
  return apiRoot.products().withKey(childPathArgs).get().execute();
};
