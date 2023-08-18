import { Button, Space, message } from "antd";

const ErrorMessage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const error = () => {
    messageApi.open({
      type: "error",
      content:
        "Account with the given email and password not found. Try again or register your account!",
    });
  };

  return (
    <>
      {contextHolder}
      <Space>
        <Button onClick={error}>Error</Button>
      </Space>
    </>
  );
};

export default ErrorMessage;
