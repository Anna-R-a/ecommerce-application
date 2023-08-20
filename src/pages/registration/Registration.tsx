import React, { Fragment, useState } from "react";
import type { RangePickerProps } from "antd/es/date-picker";
import { Button, Cascader, DatePicker, Form, Input, Select } from "antd";
import "./Registration.css";
import moment from "moment";
import {
  RegistrationData,
  formItemLayout,
  postCodesRegEx,
  residences,
  tailFormItemLayout,
} from "./DataForRegistrationForm";
import { Link, useNavigate } from "react-router-dom";
import {
  createCustomer,
  mapRegDataToRequest,
} from "../../api/customer/createCustomer";
import { notify } from "../../components/notification/notification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

const RegistrationPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const [country, setCountry] = useState("");

  let navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const onFinish = (values: RegistrationData) => {
    setIsLoading(true);
    createCustomer(mapRegDataToRequest(values))
      .then((res) => {
        console.log("Get Customer", res.body.customer);
        notify("Registration Successful!", "success");
        setTimeout(goHome, 1500);
      })
      .catch((error) => {
        const errorCode = error.body.statusCode;
        if (errorCode.toString().slice(0, 1) === "4") {
          notify("Account with the such an email exists", "error");
        }
        if (errorCode.toString().slice(0, 1) === "5") {
          notify("Server Error. Try later!", "error");
        }
      });
    setIsLoading(false);
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current > moment().subtract(13, "year");
  };

  return (
    <Fragment>
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
          if (values.country) {
            setCountry(values.country[0]);
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
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=(.*[a-zA-Z]){2})(?=.*?[#?!@$%^&*-])\S*$/,
              ),
              message:
                "Password at least one uppercase and lowercase letter, digit and special character",
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
                  new Error("The new password that you entered do not match!"),
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
          name="street"
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
          name="postcode"
          label="Postcode"
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
    </Fragment>
  );
};

export default RegistrationPage;
