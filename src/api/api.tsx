import { apiRootAnonymous } from "./client/anonymousFlow";
import { apiRoot } from "./client/createClient";
// import { apiRootPassword } from "./client/passwordFlow";

export const getProducts = async () => {
  // const isLogged = localStorage.getItem("isLogged");
  // if (isLogged) {
  //   return apiRootPassword.products().get().execute();
  // }
  return apiRootAnonymous.products().get().execute();
};

export const getCategories = async () => {
  return apiRootAnonymous.categories().get().execute();
};

export const getCustomers = async () => {
  return apiRoot.customers().get().execute();
};

export const getProjectDetails = () => {
  return apiRoot.get().execute();
};
// module.exports = {
//   getCustomers,
// }
