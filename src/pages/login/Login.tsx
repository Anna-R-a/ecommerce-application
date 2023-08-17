import React from "react";
import { Link } from "react-router-dom";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { RuleObject } from "antd/es/form";
import "./Login.css";
import { signInCustomer } from "../../api/customer/createCustomer";
import { findCustomerByEmail } from "../../api/customer/findCustomer";

const LoginPage: React.FC = () => {
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    findCustomerByEmail(values.email)
      .then(({ body }) => {
        if (body.results.length === 0) {
          console.log("This email address has not been registered.");
          signInCustomer(values)
          .then((res) => {
            localStorage.setItem("isLogged", "true");
            console.log("Get Customer", res.body.customer);
          })
        .catch((error) => console.log("error.message", error.message));
        } else {
        console.log("thisCustomer", body.results[0].id);
        }
  })
  .catch(console.error)
    
  };

  function validatePassword(_: RuleObject, value: string): Promise<void> {
    const regexp =
      /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const valueTrimming = value?.trim();
    return value && value === valueTrimming && regexp.test(valueTrimming)
      ? Promise.resolve()
      : Promise.reject(
          "Make sure it's at least 8 characters, one uppercase and lowercase letter, digit and special character",
        );
  }

  return (
    <>
      <h1>Log In</h1>
      <Form
        name="login-form"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        data-testid={"form"}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your E-mail!",
            },
            {
              type: "email",
              message: "Please input a valid E-mail!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
            { validator: validatePassword },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form__button"
          >
            Log in
          </Button>
          <div className="login-form__subText">
            Or <Link to="/registration">register now!</Link>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginPage;
