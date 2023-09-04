import {
  CustomerChangePassword,
  MyCustomerUpdateAction,
} from "@commercetools/platform-sdk";
import { apiRoot } from "../client/createClient";

export const updateCustomer = async (
  id: string,
  version: number,
  actions: MyCustomerUpdateAction[],
) => {
  return await apiRoot
    .customers()
    .withId({ ID: id })
    .post({
      body: {
        version: version,
        actions: [...actions],
      },
    })
    .execute();
};

export const updatePassword = async (actions: CustomerChangePassword) => {
  return await apiRoot
    .customers()
    .password()
    .post({
      body: actions,
    })
    .execute();
};
