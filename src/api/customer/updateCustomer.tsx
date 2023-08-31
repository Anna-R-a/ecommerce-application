import { MyCustomerUpdateAction } from "@commercetools/platform-sdk";
import { apiRoot } from "../client/createClient";

export const updateCustomer = async (
  version: number,
  actions: MyCustomerUpdateAction[],
) => {
  return await apiRoot
    .me()
    .post({
      body: {
        version: version,
        actions: [...actions],
      },
    })
    .execute();
};
