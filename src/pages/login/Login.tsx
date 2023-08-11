import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { RuleObject } from "antd/es/form";
import "./Login.css";

const LoginPage: React.FC = () => {
    const onFinish = (values: any) => {
        console.log("Received values of form: ", values);
    };

    function validatePassword(_: RuleObject, value: string): Promise<void> {
        const regexp = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        const valueTrimming = value?.trim();
        return value && value === valueTrimming && regexp.test(valueTrimming)
            ? Promise.resolve()
            : Promise.reject(
                  "Make sure it's at least 8 characters, one uppercase and lowercase letter, digit and special character"
              );
    }

    return (
        <Fragment>
            <h1>Log In</h1>
            <Form
                name="login-form"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
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
        </Fragment>
    );
};

export default LoginPage;
