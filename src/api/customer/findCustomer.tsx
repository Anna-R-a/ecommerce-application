import { apiRoot } from "../client/createClient";

export const findCustomerByEmail = (customerEmail: string) => {
  return apiRoot
    .customers()
    .get({
      queryArgs: {
        where: `email="${customerEmail}"`,
      },
    })
    .execute();
};

// findCustomerByEmail("sdk12@example.com")
//   .then(({ body }) => {
//     if (body.results.length === 0) {
//       console.log("This email address has not been registered.");
//     } else {
//       console.log("thisCustomer", body.results[0].id);
//     }
//   })
//   .catch(console.error);
