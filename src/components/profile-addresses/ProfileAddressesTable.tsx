import React, { useState } from "react";
import { queryCustomer } from "../../api/customer/queryCustomer";
import { Address, ClientResponse, Customer } from "@commercetools/platform-sdk";
import { Button, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ProfileAddressesForm } from "./ProfileAddressesForm";


export const ProfileAddressesTable: React.FC = () => {
    const [customer, setCustomer] = useState<ClientResponse<Customer>>();
    const [version, setVersion] = useState(0);
  
    React.useEffect(() => {
      const getCustomer = async () => {
        const id = localStorage.getItem("id");
        if (id) {
          setCustomer(await queryCustomer(id));
        }
      };
      getCustomer();
    }, [version]);

    interface DataType {
      key: string;
      city: string;
      streetName: string;
      country: string;
      postalCode: string;
    }

    function mapToDataType(data: Address[]) {
      const result: DataType[] = []
      data.forEach((adress)=>{
        result.push({
          key: adress.id || '',
          city: adress.city || '',
          streetName: adress.streetName || '',
          country: adress.country || '',
          postalCode: adress.postalCode || '',
        })
      })
      return result
    }

const columns: ColumnsType<DataType> = [
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
  },
  {
    title: 'Street',
    dataIndex: 'streetName',
    key: 'streetName',
  },
  {
    title: 'Postalcode',
    dataIndex: 'postalCode',
    key: 'postalCode',
  },
  {
    title: 'Status',
    key: 'key',
    dataIndex: 'key',
    render: (key) => {
         if (customer?.body.shippingAddressIds?.includes(key) && key === customer?.body.defaultShippingAddressId){
            return (
                <Tag color='geekblue' key={key}>
                  default shipping address
                </Tag>
            )
         }
         if(customer?.body.shippingAddressIds?.includes(key)){
            return (
            <Tag color='geekblue' key={key}>
              shipping address
            </Tag>
            )
         } 
         if (customer?.body.billingAddressIds?.includes(key) && key === customer?.body.defaultBillingAddressId){
            return (
                <Tag color='green' key={key}>
                 default billing address
                </Tag>
            )
         }
         if(customer?.body.billingAddressIds?.includes(key)){
            return (
            <Tag color='green' key={key}>
             billing address
            </Tag>
            )
         } 
        }
    },
    {
    title: 'Action',
    key: 'action',
    render: (_, record) =>{
        if(record.key === customer?.body.defaultShippingAddressId || record.key === customer?.body.defaultBillingAddressId){
            return(
                <Space size="middle">
                  <Button disabled>as default</Button>
                  <Button disabled>Delete</Button>
                </Space>
            )
        }else {
                return(
                    <Space size="middle">
                      <Button>as default</Button>
                      <Button>Delete</Button>
                    </Space>
                )
        }
    }
  },
];

    const AddressesTable: React.FC = () => <Table columns={columns} dataSource={mapToDataType(customer?.body.addresses || [])} expandable={{
      expandedRowRender: (record) => <ProfileAddressesForm  city={record.city || ''} country={record.country} streetName={record.streetName || ''} postalCode={record.postalCode || ''} id={record.key || ''}/>,
    }}/>;

    return(
        <>
        <AddressesTable />
        </>
    )
}