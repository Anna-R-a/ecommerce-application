import React from "react";
import ProfileTabs from "../../components/profile-tabs/profileTabs";

const ProfilPage: React.FC = () => {
  // const [customer, setCustomer] = useState<ClientResponse<Customer>>();
  // const [isLoading, setIsLoading] = useState(false);

  // React.useEffect(() => {
  //   const getCustomer = async () => {
  //     const id = localStorage.getItem("id");
  //     if (id) {
  //       setCustomer(await queryCustomer(id));
  //     }
  //     setIsLoading(true);
  //   };
  //   getCustomer();
  // }, []);

  // const onFinish = () => {};
  return (
    <>
      <ProfileTabs />
      {/* {isLoading && (
        <ProfileForm
          onFinish={onFinish}
          firstName={customer?.body.firstName || ""}
          lastName={customer?.body.lastName || ""}
          dateOfBirth={customer?.body.dateOfBirth || ""}
          addresses={customer?.body.addresses as BaseAddress[]}
          billingAddressIds={customer?.body.billingAddressIds || []}
          shippingAddressIds={customer?.body.shippingAddressIds || []}
          defaultBillingAddressId={customer?.body.defaultBillingAddressId || ''}
          defaultShippingAddressId={customer?.body.defaultShippingAddressId || ''}
        />
      )} */}
    </>
  );
};

export default ProfilPage;
