import { ClientResponse, Customer } from "@commercetools/platform-sdk";
import React, { useState } from "react";
import { queryCustomer } from "../../api/customer/queryCustomer";
import { Button, DatePicker, Form, FormItemProps, Input } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import moment from "moment";
import dayjs from "dayjs";
import { updateCustomer } from "../../api/customer/updateCustomer";
import { Moment } from "moment";

const MyFormItemContext = React.createContext<(string | number)[]>([]);

function toArr(
  str: string | number | (string | number)[],
): (string | number)[] {
  return Array.isArray(str) ? str : [str];
}

const MyFormItem = ({ name, ...props }: FormItemProps) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName =
    name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;

  return <Form.Item name={concatName} {...props} />;
};

const dateFormat = "YYYY-MM-DD";

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  return current > moment().subtract(13, "year");
};

type GeneralDataForm = {
  dateOfBirth: Moment;
  firstName: string;
  lastName: string;
  email: string;
};

export const ProfileGeneralForm: React.FC = () => {
  const [customer, setCustomer] = useState<ClientResponse<Customer>>();
  const [isLoading, setIsLoading] = useState(false);
  const [version, setVersion] = useState(0);
  const [disabled, setDisabled] = useState(true)

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

  const onFinish = (values: GeneralDataForm) => {
    const version = customer?.body.version;
    const id = customer?.body.id;
    if (version && id) {
      updateCustomer(id, version, [
        {
          action: "setFirstName",
          firstName: values.firstName,
        },
        {
          action: "setLastName",
          lastName: values.lastName,
        },
        {
          action: "setDateOfBirth",
          dateOfBirth: values.dateOfBirth.toISOString().split("T")[0],
        },
        {
          action: "changeEmail",
          email: values.email,
        },
      ]).then(() => {
        setVersion((v) => v + 1);
      });
    }
  };

  const onChange = ()=>{
    setDisabled(false)
  }

  return (
    <>
      {isLoading && (
        <Form name="form_item_path" layout="vertical" onFinish={onFinish} onChange={onChange}>
          <MyFormItem
            name="firstName"
            label="First Name"
            initialValue={customer?.body.firstName}
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
          </MyFormItem>
          <MyFormItem
            name="lastName"
            label="Last Name"
            initialValue={customer?.body.lastName}
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
          </MyFormItem>
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
            initialValue={customer?.body.email}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <MyFormItem
            name="dateOfBirth"
            label="Date of birth"
            initialValue={dayjs(customer?.body.dateOfBirth, dateFormat)}
            rules={[
              {
                required: true,
                message: "Please select our Date of birth!",
              },
            ]}
          >
            <DatePicker
              disabledDate={disabledDate}
              style={{ width: "100%" }}
              defaultPickerValue={dayjs(customer?.body.dateOfBirth, dateFormat)}
            />
          </MyFormItem>

          <Button type="primary" htmlType="submit" disabled={disabled}>
            Save changes
          </Button>
        </Form>
      )}
    </>
  );
};
