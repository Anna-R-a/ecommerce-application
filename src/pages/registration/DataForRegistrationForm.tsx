import type { CascaderProps } from "antd";
import { Moment } from "moment";

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}

export const residences: CascaderProps<DataNodeType>["options"] = [
  {
    value: "PL",
    label: "Poland",
  },
  {
    value: "LT",
    label: "Lithuania",
  },
  {
    value: "FR",
    label: "France",
  },
  {
    value: "DE",
    label: "Germany",
  },
  {
    value: "ES",
    label: "Spain",
  },
];

export const postCodesRegEx: Record<string, RegExp> = {
  PL: new RegExp(/^\d{2}[- ]{0,1}\d{3}$/),
  LT: new RegExp(/^[Ll][Tt][- ]{0,1}\d{5}$/),
  FR: new RegExp(/^\d{5}$/),
  DE: new RegExp(/^\d{5}$/),
  ES: new RegExp(/^\d{5}$/),
};

export const formItemLayout = {
  labelCol: {
    xs: { span: 20 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 16 },
  },
};

export const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 4,
    },
  },
};

export type RegistrationData = {
  email: string;
  password: string;
  confirm: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Moment;
  countryShipping: string[];
  cityShipping: string;
  streetShipping: string;
  postcodeShipping: string;
  countryBilling: string[];
  cityBilling: string;
  streetBilling: string;
  postcodeBilling: string;
};

export type DefaultAddressesParams = [
  { defaultShippingAddresses: boolean },
  { defaultBillingAddresses: boolean },
];
