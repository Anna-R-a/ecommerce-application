import { Button, Cascader, Form, Input } from "antd";
import {
  postCodesRegEx,
  residences,
} from "../../pages/registration/DataForRegistrationForm";
import { useState } from "react";
import { Address, ClientResponse, Customer } from "@commercetools/platform-sdk";
import { notify } from "../notification/notification";
import React from "react";
import { queryCustomer } from "../../api/customer/queryCustomer";
import { updateCustomer } from "../../api/customer/updateCustomer";

type ProfileAddressesFormProps = Address & {
  updateAdresses: () => void;
};

export const ProfileAddressesForm = ({
  updateAdresses,
  country,
  city,
  streetName,
  postalCode,
  id,
}: ProfileAddressesFormProps) => {
  const [customer, setCustomer] = useState<ClientResponse<Customer>>();
  const [countryChanged, setCountryChanged] = useState("");
  const [version, setVersion] = useState(0);

  React.useEffect(() => {
    const getCustomer = async () => {
      const id = localStorage.getItem("id");
      if (id) {
        setCustomer(await queryCustomer(id));
      }
    };
    getCustomer();
  }, [version]);

  const onFinish = (values: Address) => {
    const version = customer?.body.version;
    const customerId = customer?.body.id;
    if (version && customerId) {
      updateCustomer(customerId, version, [
        {
          action: "changeAddress",
          addressId: id,
          address: {
            country: values.country[0],
            city: values.city,
            streetName: values.streetName,
            postalCode: values.postalCode,
          },
        },
      ]).then(() => {
        updateAdresses();
        notify("General data changed", "success");
        setVersion((v) => v + 1);
      });
    }
  };

  return (
    <>
      <Form
        name={id}
        onFinish={onFinish}
        onValuesChange={(values) => {
          if (values.country) {
            setCountryChanged(values.country);
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
          initialValue={[country]}
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
          initialValue={city}
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
          initialValue={streetName}
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
              pattern: postCodesRegEx[countryChanged],
              message: "No valid postcode!",
            },
          ]}
          hasFeedback
          initialValue={postalCode}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="registration-form-button button_primary"
        >
          Change address
        </Button>
      </Form>
    </>
  );
};
