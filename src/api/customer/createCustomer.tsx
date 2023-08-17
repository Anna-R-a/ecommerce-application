import { MyCustomerSignin } from "@commercetools/platform-sdk";
import { apiRoot } from "../client/createClient";
import { apiRootPassword } from "../client/passwordFlow";

export const getProject = () => {
  return apiRoot.get().execute();
};

// const createCustomer = () => {
//   return apiRoot
//     .customers()
//     .post({
//       body: {
//         email: "sdk@example.com",
//         password: "examplePassword",
//       },
//     })
//     .execute();
// };

// // Create the customer and output the Customer ID
// createCustomer()
//   .then(({ body }) => {
//     console.log(body.customer.id);
//   })
//   .catch(console.error);

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

export const createCustomer = ({ email, password }: MyCustomerSignin) => {
  return apiRootPassword
    .customers()
    .post({
      body: {
        email,
        password,
      },
    })
    .execute();
};
