import { Button, DatePicker, Form, FormItemProps, Input } from "antd";
import moment from "moment";
import React from "react";
import type { RangePickerProps } from "antd/es/date-picker";
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

type ProfileFormProps = {
  onFinish: () => void;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
};

const dateFormat = "YYYY-MM-DD";

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  return current > moment().subtract(13, "year");
};

export const ProfileForm = ({
  onFinish,
  firstName,
  lastName,
  dateOfBirth,
}: ProfileFormProps) => {
  return (
    <Form name="form_item_path" layout="vertical" onFinish={onFinish}>
      <MyFormItem
        name="firstName"
        label="First Name"
        initialValue={firstName}
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
        initialValue={lastName}
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
        initialValue={dayjs(dateOfBirth, dateFormat)}
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
          defaultPickerValue={dayjs(dateOfBirth, dateFormat)}
        />
      </MyFormItem>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};
