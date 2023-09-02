import { ClientResponse, Customer } from "@commercetools/platform-sdk";
import React, { useState } from "react";
import { queryCustomer } from "../../api/customer/queryCustomer";
import { Button, DatePicker, Form, FormItemProps, Input } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import moment from "moment";
import dayjs from "dayjs";

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

export const ProfileGeneralForm: React.FC = () => {
  const [customer, setCustomer] = useState<ClientResponse<Customer>>();
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const getCustomer = async () => {
      const id = localStorage.getItem("id");
      if (id) {
        setCustomer(await queryCustomer(id));
      }
      setIsLoading(true);
    };
    getCustomer();
  }, []);

  const onFinish = () => {};

  return (
    <>
      {isLoading && (
        <Form name="form_item_path" layout="vertical" onFinish={onFinish}>
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

          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      )}
    </>
  );
};
