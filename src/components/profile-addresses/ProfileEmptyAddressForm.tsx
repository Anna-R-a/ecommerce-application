import { Button, Cascader, Form, Input } from "antd";
import {
  postCodesRegEx,
  residences,
} from "../../pages/registration/DataForRegistrationForm";
import { useState } from "react";
import React from "react";
import { queryCustomer } from "../../api/customer/queryCustomer";
import { Address, ClientResponse, Customer } from "@commercetools/platform-sdk";
import { updateCustomer } from "../../api/customer/updateCustomer";
import { notify } from "../notification/notification";

export const ProfileEmptyAddressesForm = () => {
  const [form] = Form.useForm();
  const [customer, setCustomer] = useState<ClientResponse<Customer>>();
  const [country, setCountry] = useState("");

  React.useEffect(() => {
    const getCustomer = async () => {
      const id = localStorage.getItem("id");
      if (id) {
        setCustomer(await queryCustomer(id));
      }
    };
    getCustomer();
  }, []);

  const onFinish = (values: Address) => {
    const version = customer?.body.version;
    const customerId = customer?.body.id;
    if (version && customerId) {
      updateCustomer(customerId, version, [
        {
          action: "addAddress",
          address: {
            country: values.country[0],
            city: values.city,
            streetName: values.streetName,
            postalCode: values.postalCode,
          },
        },
      ]).then(() => {
        form.resetFields();
        notify("General data changed", "success");
      });
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      onValuesChange={(values) => {
        if (values.country) {
          setCountry(values.country);
        }
      }}
    >
      <Form.Item
        name="country"
        label="Country"
        rules={[
          {
            type: "array",
            required: true,
            message: "Please select your Country!",
          },
        ]}
      >
        <Cascader options={residences} />
      </Form.Item>
      <Form.Item
        name="city"
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
        hasFeedback
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="streetName"
        label="Street"
        rules={[
          {
            required: true,
            message: "Please input your street!",
            whitespace: true,
          },
        ]}
        hasFeedback
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="postalCode"
        label="Postalcode"
        rules={[
          {
            required: true,
            message: "Please input your postcode!",
          },
          {
            pattern: postCodesRegEx[country],
            message: "No valid postcode!",
          },
        ]}
        hasFeedback
      >
        <Input style={{ width: "100%" }} />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        className="registration-form-button button_primary"
      >
        add address
      </Button>
    </Form>
  );
};
