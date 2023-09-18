import { apiRoot } from "../client/createClient";

// Return a Customer based on their ID
export const queryCustomer = (customerID: string) => {
  return apiRoot.customers().withId({ ID: customerID }).get().execute();
};

// Query the Customer and output the Customer's email address
// queryCustomer("{customerID}")
//   .then(({ body }) => {
//     return body;
//   })
//   .catch(console.error);
