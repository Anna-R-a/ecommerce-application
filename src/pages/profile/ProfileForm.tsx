import { Button, Cascader, Checkbox, DatePicker, Divider, Form, FormItemProps, Input, Space } from "antd";
import moment from "moment";
import React from "react";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { BaseAddress } from "@commercetools/platform-sdk";
import { postCodesRegEx, residences } from "../registration/DataForRegistrationForm";

const MyFormItemContext = React.createContext<(string | number)[]>([]);

function toArr(
  str: string | number | (string | number)[],
): (string | number)[] {
  return Array.isArray(str) ? str : [str];
}

const MyFormItem = ({ name, ...props }: FormItemProps) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName =
    name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;

  return <Form.Item name={concatName} {...props} />;
};

type ProfileFormProps = {
  onFinish: () => void;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: BaseAddress[];
  billingAddressIds: string[];
  shippingAddressIds: string[];
  defaultBillingAddressId:string;
  defaultShippingAddressId:string;
};

const dateFormat = "YYYY-MM-DD";

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  return current > moment().subtract(13, "year");
};

export const ProfileForm = ({
  onFinish,
  firstName,
  lastName,
  dateOfBirth,
  addresses,
  billingAddressIds,
  shippingAddressIds,
  defaultBillingAddressId,
  defaultShippingAddressId,
}: ProfileFormProps) => {
  const shippingAddresses = addresses.map((address)=> {
    const id = address.id
    if(id && shippingAddressIds.includes(id)){
      return (
        <div key={address.id}>
        <Form.Item
          key={address.id}
          name="countryShipping"
          label="Country"
          rules={[
            {
              type: "array",
              required: true,
              message: "Please select your Country!",
            },
          ]}
          initialValue={address.country}
        >
          <Cascader options={residences} />
        </Form.Item><Form.Item
          name="cityShipping"
          label="City"
          rules={[
            {
              pattern: new RegExp(/^[A-Za-zА-Яа-яЁё]*$/),
              message: "No space, numbers or special characters allowed",
            },
            {
              required: true,
              message: "Please input your City!",
              whitespace: true,
            },
          ]}
          initialValue={address.city}
          hasFeedback
        >
            <Input />
          </Form.Item><Form.Item
            name="streetShipping"
            label="Street"
            rules={[
              {
                required: true,
                message: "Please input your street!",
                whitespace: true,
              },
            ]}
            initialValue={address.streetName}
            hasFeedback
          >
            <Input />
          </Form.Item><Form.Item
            name="postcodeShipping"
            label="Postcode"
            rules={[
              {
                required: true,
                message: "Please input your postcode!",
              },
              {
                pattern: postCodesRegEx[address.country],
                message: "No valid postcode!",
              },
            ]}
            initialValue={address.postalCode}
            hasFeedback
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Space align="center" direction="vertical" style={{ width: "100%" }}>
            <Checkbox>
              Set as default shipping address
            </Checkbox>

            <Checkbox>
              Use it as billing address
            </Checkbox>
          </Space>
        </div>
      )
    }
  })
  return (
    <Form name="form_item_path" layout="vertical" onFinish={onFinish}>
      <MyFormItem
        name="firstName"
        label="First Name"
        initialValue={firstName}
        rules={[
          {
            pattern: new RegExp(/^[A-Za-zА-Яа-яЁё]*$/),
            message: "No space, numbers or special characters allowed",
          },
          {
            required: true,
            message: "Please input your First name!",
            whitespace: true,
          },
        ]}
        hasFeedback
      >
        <Input />
      </MyFormItem>
      <MyFormItem
        name="lastName"
        label="Last Name"
        initialValue={lastName}
        rules={[
          {
            pattern: new RegExp(/^[A-Za-zА-Яа-яЁё]*$/),
            message: "No space, numbers or special characters allowed",
          },
          {
            required: true,
            message: "Please input your Last name!",
            whitespace: true,
          },
        ]}
        hasFeedback
      >
        <Input />
      </MyFormItem>
      <MyFormItem
        name="dateOfBirth"
        label="Date of birth"
        initialValue={dayjs(dateOfBirth, dateFormat)}
        rules={[
          {
            required: true,
            message: "Please select our Date of birth!",
          },
        ]}
      >
        <DatePicker
          disabledDate={disabledDate}
          style={{ width: "100%" }}
          defaultPickerValue={dayjs(dateOfBirth, dateFormat)}
        />
      </MyFormItem>

      <Divider>Shipping addresses</Divider>
      {shippingAddresses}

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};
