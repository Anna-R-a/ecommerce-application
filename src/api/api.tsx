import { apiRootAnonymous } from "./client/anonymousFlow";
import { apiRootPassword } from "./client/passwordFlow";


export const getProducts = async () => {
  const isLogged = localStorage.getItem("isLogged");
  if (isLogged) {
    return apiRootPassword.products().get().execute();
  }
  return apiRootAnonymous.products().get().execute();
};

export const load = async () => {
  const isLogged = localStorage.getItem("isLogged");
  if (isLogged) {
    return apiRootPassword.get().execute();
  }
  return apiRootAnonymous.get().execute();
};

export const getCategories = async () => {
  return apiRootAnonymous.categories().get().execute();
};


// export const createAnonymousCustomer = () => {
//   return apiRootAnonymous
//     .customers()
//     .post({
//       body: {
//         anonymousId: apiAdmin.CTP_ANONYMOUS_ID,
//         email: "",
//       },
//     })
//     .execute();
// };

// export const setToken = () =>
//   getProjectAnonym()
//     .then(async () => localStorage.setItem("acceessToken", `${await getCustomerToken()}`))
//     .then(() => console.log(localStorage));

