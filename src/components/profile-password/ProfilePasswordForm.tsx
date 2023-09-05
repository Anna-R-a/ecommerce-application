import { ClientResponse, Customer } from "@commercetools/platform-sdk";
import React, { useState } from "react";
import { queryCustomer } from "../../api/customer/queryCustomer";
import { Button, Form, Input } from "antd";
import { updatePassword } from "../../api/customer/updateCustomer";
import { notify } from "../notification/notification";

type PasswordDataForm = {
  newPassword: string;
  currentPassword: string;
};

export const ProfilePasswordForm: React.FC = () => {
  const [form] = Form.useForm();
  const [customer, setCustomer] = useState<ClientResponse<Customer>>();
  const [isLoading, setIsLoading] = useState(false);
  const [version, setVersion] = useState(0);
  const [disabled, setDisabled] = useState(true);

  React.useEffect(() => {
    const getCustomer = async () => {
      const id = localStorage.getItem("id");
      if (id) {
        setCustomer(await queryCustomer(id));
      }
      setIsLoading(true);
    };
    getCustomer();
  }, [version]);

  const onFinish = (values: PasswordDataForm) => {
    const customerVersion = customer?.body.version;
    const id = customer?.body.id;
    const { currentPassword, newPassword } = values;
    if (customerVersion && id) {
      updatePassword({
        id: id,
        version: customerVersion,
        newPassword,
        currentPassword,
      })
        .then(() => {
          form.resetFields();
          setVersion((v) => v + 1);
          notify("Password changed", "success");
        })
        .catch(() => {
          notify("Password change failed", "warning");
        });
    }
  };

  return (
    <>
      {isLoading && (
        <Form
          name="form_password"
          layout="vertical"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
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
            name="newPassword"
            label="New Password"
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
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    setDisabled(false);
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
          <Button
            type="primary"
            htmlType="submit"
            disabled={disabled}
            className="button_primary"
          >
            Save new password
          </Button>
        </Form>
      )}
    </>
  );
};
