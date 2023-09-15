import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { RangePickerProps } from "antd/es/date-picker";
import {
  Button,
  Cascader,
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
  Checkbox,
  Space,
} from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import moment from "moment";
import {
  RegistrationData,
  formItemLayout,
  postCodesRegEx,
  residences,
  tailFormItemLayout,
} from "./DataForRegistrationForm";

import {
  createCustomer,
  mapRegDataToRequest,
  signInCustomer,
} from "../../api/customer/createCustomer";
import { notify } from "../../components/notification/notification";
import { ToastContainer } from "react-toastify";
import { Context } from "../../components/context/Context";
import { createCart, getActiveCart } from "../../api/api";
import "./Registration.css";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

const RegistrationPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const [countryShipping, setCountryShipping] = useState("");
  const [countryBilling, setCountryBilling] = useState("");

  const [defaultShipping, setDefaultShipping] = useState({
    defaultShippingAddresses: false,
  });
  const [defaultBilling, setDefaultBilling] = useState({
    defaultBillingAddresses: false,
  });

  const [visibilityBilling, setVisibilityBilling] = useState("block");

  let navigate = useNavigate();

  const [, setContext] = useContext(Context);

  const goHome = () => {
    navigate("/");
  };

  const onDefaultShipping = (e: CheckboxChangeEvent) => {
    setDefaultShipping({ defaultShippingAddresses: e.target.checked });
  };

  const onDefaultBilling = (e: CheckboxChangeEvent) => {
    setDefaultBilling({ defaultBillingAddresses: e.target.checked });
  };

  const setActiveBilling = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setVisibilityBilling("none");
      form.setFieldValue("countryBilling", [
        `${form.getFieldValue("countryShipping")}`,
      ]);
      form.setFieldValue(
        "cityBilling",
        `${form.getFieldValue("cityShipping")}`
      );
      form.setFieldValue(
        "streetBilling",
        `${form.getFieldValue("streetShipping")}`
      );
      form.setFieldValue(
        "postcodeBilling",
        `${form.getFieldValue("postcodeShipping")}`
      );
    } else {
      setVisibilityBilling("block");
      form.setFieldValue("countryBilling", [""]);
      form.setFieldValue("cityBilling", "");
      form.setFieldValue("streetBilling", "");
      form.setFieldValue("postcodeBilling", "");
    }
  };

  const onFinish = (values: RegistrationData) => {
    setIsLoading(true);
    createCustomer(
      mapRegDataToRequest(values, [defaultShipping, defaultBilling])
    )
      .then(() => {
        signInCustomer(values).then(async (res) => {
          await createCart();
          const cartCustomer = (await getActiveCart()).body;
          console.log("cartCustomer", cartCustomer);
          localStorage.setItem("isLogged", "true");
          localStorage.setItem("id", res.body.customer.id);
          localStorage.setItem("cart-customer", JSON.stringify(cartCustomer));
          localStorage.removeItem("activeCart");

          setContext(0);
          notify("Registration Successful!", "success");
          setTimeout(goHome, 1500);
        });
      })
      .catch((error) => {
        const errorCode = error.body.statusCode;
        if (errorCode.toString().slice(0, 1) === "4") {
          notify("Account with the such email exists", "error");
        } else if (errorCode.toString().slice(0, 1) === "5") {
          notify("Server Error. Try later!", "error");
        }
      });
    setIsLoading(false);
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current > moment().subtract(13, "year");
  };

  return (
    <div className="container">
      <ToastContainer />
      <h1>Registration</h1>

      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{ residence: ["Poland"], prefix: "48" }}
        style={{ maxWidth: 600 }}
        scrollToFirstError
        onValuesChange={(values) => {
          if (values.countryShipping) {
            setCountryShipping(values.countryShipping[0]);
          }
          if (values.countryBilling) {
            setCountryBilling(values.countryBilling[0]);
          }
        }}
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "Please input a valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              min: 8,
              message: "Password must be at least 8 characters",
            },
            {
              pattern: new RegExp(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=(.*[a-zA-Z]){2})(?=.*?[#?!@$%^&*-])\S*$/
              ),
              message:
                "Password must be at least one uppercase and lowercase letter, digit and special character",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="firstName"
          label="First Name"
          tooltip="Input our First Name"
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
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last name"
          tooltip="Input our Last Name"
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
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: false, message: "Please select gender!" }]}
        >
          <Select placeholder="select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label="Date of birth"
          rules={[
            {
              required: true,
              message: "Please select our Date of birth!",
            },
          ]}
        >
          <DatePicker disabledDate={disabledDate} style={{ width: "100%" }} />
        </Form.Item>

        <Divider>Shipping address</Divider>
        <Form.Item
          name="countryShipping"
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
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="streetShipping"
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
          name="postcodeShipping"
          label="Postcode"
          rules={[
            {
              required: true,
              message: "Please input your postcode!",
            },
            {
              pattern: postCodesRegEx[countryShipping],
              message: "No valid postcode!",
            },
          ]}
          hasFeedback
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>

        <Space align="center" direction="vertical" style={{ width: "100%" }}>
          <Checkbox onChange={onDefaultShipping}>
            Set as default shipping address
          </Checkbox>

          <Checkbox onChange={setActiveBilling}>
            Use it as billing address
          </Checkbox>
        </Space>

        <div style={{ display: `${visibilityBilling}` }}>
          <Divider>Billing address</Divider>
          <Form.Item
            name="countryBilling"
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
            name="cityBilling"
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
            name="streetBilling"
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
            name="postcodeBilling"
            label="Postcode"
            rules={[
              {
                required: true,
                message: "Please input your postcode!",
              },
              {
                pattern: postCodesRegEx[countryBilling],
                message: "No valid postcode!",
              },
            ]}
            hasFeedback
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <Space
          align="center"
          direction="vertical"
          style={{ width: "100%", marginTop: "10px" }}
        >
          <Checkbox onChange={onDefaultBilling}>
            Set as default billing address
          </Checkbox>
        </Space>
        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            className="registration-form-button button_primary"
            loading={isLoading}
          >
            Register
          </Button>
          <div className="registration-form__subText">
            Already registered? <Link to="/login">Log In here</Link>!
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegistrationPage;
