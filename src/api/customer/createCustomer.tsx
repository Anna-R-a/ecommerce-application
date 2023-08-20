import { CustomerDraft, MyCustomerSignin } from "@commercetools/platform-sdk";
import { apiRoot } from "../client/createClient";
import { apiRootPassword } from "../client/passwordFlow";

export const getProject = () => {
  return apiRoot.get().execute();
};

export const createCustomer = (dataForRegitration: CustomerDraft) => {
  try{
    return apiRoot
    .customers()
    .post({
      body: {
        ...dataForRegitration
      },
    })
    .execute();
  } catch(e){
    console.log(e)
  }
  
};

export const signInCustomer = async ({ email, password }: MyCustomerSignin) => {
  return await apiRootPassword
    .me()
    .login()
    .post({
      body: {
        email,
        password,
      },
    })
    .execute();
};

