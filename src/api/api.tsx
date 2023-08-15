import { apiRootAnonym, getProjectAnonym } from "./client/anonymous";
import { apiAdmin } from "./constants";
import { getToken } from "./token/getToken";

export const createAnonymousCustomer = () => {
  return apiRootAnonym
    .customers()
    .post({
      body: {
        anonymousId: apiAdmin.CTP_ANONYMOUS_ID,
        email: ""
      },
    })
    .execute();
};


export const setToken = () => getProjectAnonym()
.then(async () => localStorage.setItem('firstToken', `${await getToken()}`))
.then(() => console.log(localStorage))