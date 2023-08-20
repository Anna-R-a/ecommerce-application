import {
  BaseAddress,
  CustomerDraft,
  MyCustomerSignin,
} from "@commercetools/platform-sdk";
import { apiRoot } from "../client/createClient";
import { apiRootPassword } from "../client/passwordFlow";
import { RegistrationData } from "../../pages/registration/DataForRegistrationForm";

export const getProject = () => {
  return apiRoot.get().execute();
};

export function mapRegDataToRequest(data: RegistrationData): CustomerDraft {
  const {
    email,
    firstName,
    lastName,
    password,
    dateOfBirth,
    country,
    postcode,
    city,
    street,
  } = data;
  const address: BaseAddress = {
    country: country[0],
    postalCode: postcode,
    city,
    streetName: street,
  };
  return {
    email,
    firstName,
    lastName,
    password,
    dateOfBirth: dateOfBirth.toISOString().split("T")[0],
    addresses: [address],
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
