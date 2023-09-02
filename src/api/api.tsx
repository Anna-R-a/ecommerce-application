import { CheckboxValueType } from "antd/es/checkbox/Group";
import { apiRootAnonymous } from "./client/anonymousFlow";
import { apiRoot } from "./client/createClient";
// import { apiRootPassword } from "./client/passwordFlow";

export const getProducts = () => {
  return apiRootAnonymous.products().get().execute();
};

export const getProductsFromCategory = async (categoryId: string) => {
  return apiRootAnonymous
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: [`categories.id:"${categoryId}"`],
      },
    })
    .execute();
};

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
