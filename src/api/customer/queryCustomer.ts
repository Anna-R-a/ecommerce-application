import { apiRoot } from "../client/createClient";

export const queryCustomer = (customerID: string) => {
  return apiRoot.customers().withId({ ID: customerID }).get().execute();
};
