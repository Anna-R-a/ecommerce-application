import React, { useState } from "react";
import { updateCustomer } from "../../api/customer/updateCustomer";
import { ClientResponse, Customer } from "@commercetools/platform-sdk";
import { ProfileForm } from "./ProfileForm";
import { queryCustomer } from "../../api/customer/queryCustomer";

const ProfilPage: React.FC = () => {
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
        <ProfileForm
          onFinish={onFinish}
          firstName={customer?.body.firstName || ""}
          lastName={customer?.body.lastName || ""}
          dateOfBirth={customer?.body.dateOfBirth || ""}
        />
      )}
    </>
  );
};

export default ProfilPage;
