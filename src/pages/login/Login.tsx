import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyCustomerSignin } from "@commercetools/platform-sdk";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { RuleObject } from "antd/es/form";
import { signInCustomer } from "../../api/customer/createCustomer";
import { ToastContainer } from "react-toastify";
import { notify } from "../../components/notification/notification";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const LoginPage: React.FC = () => {
  let navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const onFinish = (values: MyCustomerSignin) => {
    signInCustomer(values)
      .then(() => {
        localStorage.setItem("isLogged", "true");
        notify("Login Successful!", "success");
        setTimeout(goHome, 1500);
      })
      .catch((error) => {
        const errorCode = error.body.statusCode;
        if (errorCode.toString().slice(0, 1) === "4") {
          notify(
            "Account with the given email and password not found. Try again or register your account!",
            "error",
          );
        }
        if (errorCode.toString().slice(0, 1) === "5") {
          notify("Server Error. Try later!", "error");
        }
      });
  };

  function validatePassword(_: RuleObject, value: string): Promise<void> {
    const regexp =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=(.*[a-zA-Z]){2})(?=.*?[#?!@$%^&*-])\S{8,}$/;
    return regexp.test(value)
      ? Promise.resolve()
      : Promise.reject(
          "Password must be at least 8 characters, one uppercase and lowercase letter, digit and special character",
        );
  }

  return (
    <>
      <ToastContainer />
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
            className="login-form__button button_primary"
          >
            Log in
          </Button>
          <div className="login-form__subText">
            Or <Link to="/registration">register now</Link>!
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginPage;
