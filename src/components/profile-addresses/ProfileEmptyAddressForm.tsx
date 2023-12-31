import { Button, Cascader, Form, Input, Radio, RadioChangeEvent } from "antd";
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

type ProfileAddressesEmptyFormProps = {
  updateAdresses: () => void;
  setClick: () => void;
};

export const ProfileEmptyAddressesForm = ({
  updateAdresses,
  setClick,
}: ProfileAddressesEmptyFormProps) => {
  const [form] = Form.useForm();
  const [customer, setCustomer] = useState<ClientResponse<Customer>>();
  const [country, setCountry] = useState("");
  const [valueAddress, setValueAddress] = useState("shipping");

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
      ])
        .then((res) => {
          const id = res.body.addresses[res.body.addresses.length - 1].id;
          if (valueAddress === "shipping" && id) {
            updateCustomer(customerId, version + 1, [
              {
                action: "addShippingAddressId",
                addressId: id,
              },
            ]);
          } else if (valueAddress === "billing" && id) {
            updateCustomer(customerId, version + 1, [
              {
                action: "addBillingAddressId",
                addressId: id,
              },
            ]);
          }
          form.resetFields();
          notify("General data changed", "success");
        })
        .then(() => {
          updateAdresses();
          setClick();
        });
    }
  };

  const onChange = (e: RadioChangeEvent) => {
    setValueAddress(e.target.value);
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
      <Radio.Group onChange={onChange} defaultValue={valueAddress}>
        <Radio value="shipping">shipping address</Radio>
        <Radio value="billing">billing address</Radio>
      </Radio.Group>
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
