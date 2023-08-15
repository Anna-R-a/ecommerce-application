import { apiRoot } from "../createClient";

// Search for Customers whose email address matches the Query Predicate
export const returnCustomerByEmail = (customerEmail: string) => {
  return apiRoot
    .customers()
    .get({
      queryArgs: {
        where: `email="${customerEmail}"`,
      },
    })
    .execute();
};

returnCustomerByEmail("sdk12@example.com")
  .then(({ body }) => {
    // As email addresses must be unique, either 0 or 1 Customers will be returned.
    // If 0, then no Customer exists with this email address.
    if (body.results.length === 0) {
      console.log("This email address has not been registered.");
    } else {
      // Since there can be only one Customer resource in the result, it must be the first entry of the results array. This outputs the Customer's id.
      console.log("thisCust", body.results[0].id);
    }
  })
  .catch(console.error);
