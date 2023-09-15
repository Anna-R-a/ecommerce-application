import React, { useState } from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LineItem } from "@commercetools/platform-sdk";
import { getActiveCart } from "../../api/api";
import "./cart-list.css";

interface DataType {
  key: string;
  name: string;
  image: string;
  count: number;
  price: string;
  totalPrice: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (_, record) => {
      return (
        <img className="cart-image" src={record.image} alt={record.name}></img>
      );
    },
  },
  {
    title: "Count",
    dataIndex: "count",
    key: "count",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Total price",
    key: "totalPrice",
    dataIndex: "totalPrice",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="small">
        <Button>+</Button>
        <Button>-</Button>
        <Button>delete</Button>
      </Space>
    ),
  },
];

function mapToDataType(data: LineItem[]) {
  const result: DataType[] = [];
  data.forEach((product) => {
    result.push({
      key: product.id,
      name: product.name.en,
      image: product.variant.images?.[0].url || "",
      count: product.quantity,
      price:
        (product.price.value.centAmount / 100).toFixed(2).toString() + " $",
      totalPrice:
        (product.totalPrice.centAmount / 100).toFixed(2).toString() + " $",
    });
  });
  return result;
}

const CartList = () => {
  const [productsList, setProductList] = useState<LineItem[]>([]);
  React.useEffect(() => {
    if (
      localStorage.getItem("activeCart") ||
      localStorage.getItem("cart-customer")
    ) {
      getActiveCart().then((res) => {
        setProductList(res.body.lineItems);
      });
    }
  }, []);

  console.log(productsList);

  return <Table columns={columns} dataSource={mapToDataType(productsList)} />;
};

export default CartList;
