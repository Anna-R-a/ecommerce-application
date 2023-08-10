import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import "./Login.css";

const LoginPage: React.FC = () => {
    const onFinish = (values: any) => {
        console.log("Received values of form: ", values);
    };

    return (
        <Fragment>
            <h1>Log In</h1>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: "email",
                            message: "The input is not valid E-mail!",
                        },
                        {
                            required: true,
                            message: "Please input your E-mail!",
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <MailOutlined className="site-form-item-icon" />
                        }
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
                        { min: 6 },
                        {
                            validator: (_, value) =>
                                value && value.includes("A")
                                    ? Promise.resolve()
                                    : Promise.reject(
                                          "Password does not match criteria."
                                      ),
                        },
                    ]}
                >
                    <Input.Password
                        prefix={
                            <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                    >
                        Log in
                    </Button>
                    <div className="login-form-subText">
                        Or <Link to="/registration">register now!</Link>
                    </div>
                </Form.Item>
            </Form>
        </Fragment>
    );
};

export default LoginPage;
