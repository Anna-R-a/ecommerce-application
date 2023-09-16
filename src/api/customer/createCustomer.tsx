import {
  BaseAddress,
  CustomerDraft,
  MyCustomerSignin,
} from "@commercetools/platform-sdk";
import { apiRoot } from "../client/createClient";
import { createPasswordClient } from "../client/passwordFlow";
import {
  RegistrationData,
  DefaultAddressesParams,
} from "../../pages/registration/DataForRegistrationForm";

export function mapRegDataToRequest(
  data: RegistrationData,
  defaultAddresses: DefaultAddressesParams,
): CustomerDraft {
  const {
    email,
    firstName,
    lastName,
    password,
    dateOfBirth,
    countryShipping,
    cityShipping,
    streetShipping,
    postcodeShipping,
    countryBilling,
    cityBilling,
    streetBilling,
    postcodeBilling,
  } = data;

  const addressShipping: BaseAddress = {
    key: "addressShipping",
    country: countryShipping[0],
    postalCode: postcodeShipping,
    city: cityShipping,
    streetName: streetShipping,
  };

  const addressBilling: BaseAddress = {
    key: "addressBilling",
    country: countryBilling[0],
    postalCode: postcodeBilling,
    city: cityBilling,
    streetName: streetBilling,
  };

  return {
    email,
    firstName,
    lastName,
    password,
    dateOfBirth: dateOfBirth.toISOString().split("T")[0],
    addresses: [addressShipping, addressBilling],
    shippingAddresses: [0],
    defaultShippingAddress: defaultAddresses[0].defaultShippingAddresses
      ? 0
      : undefined,
    billingAddresses: [1],
    defaultBillingAddress: defaultAddresses[1].defaultBillingAddresses
      ? 1
      : undefined,
  };
}

export const createCustomer = async (body: CustomerDraft) => {
  return await apiRoot
    .customers()
    .post({
      body,
    })
    .execute();
};

export const signInCustomer = async ({ email, password }: MyCustomerSignin) => {
  return await createPasswordClient({ email, password })
    .me()
    .login()
    .post({
      body: {
        email,
        password,
        activeCartSignInMode: "MergeWithExistingCustomerCart",
        updateProductData: true
      },
    })
    .execute();
};


