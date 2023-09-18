import React, { useState } from "react";
import { queryCustomer } from "../../api/customer/queryCustomer";
import { Address, ClientResponse, Customer } from "@commercetools/platform-sdk";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ProfileAddressesForm } from "./ProfileAddressesForm";
import { ProfileEmptyAddressesForm } from "./ProfileEmptyAddressForm";
import { notify } from "../notification/notification";
import { updateCustomer } from "../../api/customer/updateCustomer";

interface DataType {
  key: string;
  city: string;
  streetName: string;
  country: string;
  postalCode: string;
}

function mapToDataType(data: Address[]) {
  const result: DataType[] = [];
  data.forEach((adress) => {
    result.push({
      key: adress.id || "",
      city: adress.city || "",
      streetName: adress.streetName || "",
      country: adress.country || "",
      postalCode: adress.postalCode || "",
    });
  });
  return result;
}

export const ProfileAddressesTable: React.FC = () => {
  const [customer, setCustomer] = useState<ClientResponse<Customer>>();
  const [click, setClick] = useState(false);
  const [version, setVersion] = useState(0);

  const updateAdresses = async () => {
    const id = localStorage.getItem("id");
    if (id) {
      setCustomer(await queryCustomer(id));
    }
    setVersion((v) => v + 1);
  };

  React.useEffect(() => {
    const getCustomer = async () => {
      const id = localStorage.getItem("id");
      if (id) {
        setCustomer(await queryCustomer(id));
      }
    };
    getCustomer();
  }, [version]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Street",
      dataIndex: "streetName",
      key: "streetName",
    },
    {
      title: "Postalcode",
      dataIndex: "postalCode",
      key: "postalCode",
    },
    {
      title: "Status",
      key: "key",
      dataIndex: "key",
      render: (key) => {
        if (
          customer?.body.shippingAddressIds?.includes(key) &&
          key === customer?.body.defaultShippingAddressId
        ) {
          return (
            <Tag color="geekblue" key={key}>
              default shipping
            </Tag>
          );
        }
        if (customer?.body.shippingAddressIds?.includes(key)) {
          return (
            <Tag color="geekblue" key={key}>
              shipping address
            </Tag>
          );
        }
        if (
          customer?.body.billingAddressIds?.includes(key) &&
          key === customer?.body.defaultBillingAddressId
        ) {
          return (
            <Tag color="green" key={key}>
              default billing
            </Tag>
          );
        }
        if (customer?.body.billingAddressIds?.includes(key)) {
          return (
            <Tag color="green" key={key}>
              billing address
            </Tag>
          );
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const deleteAdress = () => {
          const version = customer?.body.version;
          const customerId = customer?.body.id;
          if (version && customerId) {
            updateCustomer(customerId, version, [
              {
                action: "removeAddress",
                addressId: record.key,
              },
            ]).then(() => {
              notify("Address deleted", "success");
              setVersion((v) => v + 1);
            });
          }
        };

        const setDefault = () => {
          const version = customer?.body.version;
          const customerId = customer?.body.id;
          if (
            customer?.body.shippingAddressIds?.includes(record.key) &&
            version &&
            customerId
          ) {
            updateCustomer(customerId, version, [
              {
                action: "setDefaultShippingAddress",
                addressId: record.key,
              },
            ]).then(() => {
              notify("Address as default shipping", "success");
              setVersion((v) => v + 1);
            });
          }
          if (
            customer?.body.billingAddressIds?.includes(record.key) &&
            version &&
            customerId
          ) {
            updateCustomer(customerId, version, [
              {
                action: "setDefaultBillingAddress",
                addressId: record.key,
              },
            ]).then(() => {
              notify("Address as default billing", "success");
              setVersion((v) => v + 1);
            });
          }
        };

        if (
          record.key === customer?.body.defaultShippingAddressId ||
          record.key === customer?.body.defaultBillingAddressId
        ) {
          return (
            <Space size="small">
              <Button disabled>as default</Button>
              <Button onClick={deleteAdress}>Delete</Button>
            </Space>
          );
        } else {
          return (
            <Space size="small">
              <Button onClick={setDefault}>as default</Button>
              <Button onClick={deleteAdress}>Delete</Button>
            </Space>
          );
        }
      },
    },
  ];

  const onClick = () => {
    setClick((v) => !v);
  };

  const AddressesTable = () => (
    <Table
      scroll={{ x: true }}
      columns={columns}
      dataSource={mapToDataType(customer?.body.addresses || [])}
      expandable={{
        expandedRowRender: (record) => (
          <ProfileAddressesForm
            city={record.city || ""}
            country={record.country}
            streetName={record.streetName || ""}
            postalCode={record.postalCode || ""}
            id={record.key || ""}
            updateAdresses={updateAdresses}
          />
        ),
      }}
      footer={() => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {click && (
              <ProfileEmptyAddressesForm
                updateAdresses={updateAdresses}
                setClick={onClick}
              />
            )}
            {!click && (
              <Button
                type="primary"
                onClick={onClick}
                className="button_primary"
              >
                add new address
              </Button>
            )}
          </div>
        );
      }}
    />
  );

  return (
    <>
      <AddressesTable />
    </>
  );
};
