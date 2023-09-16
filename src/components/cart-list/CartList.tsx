import React, { useState } from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LineItem } from "@commercetools/platform-sdk";
import {
  changeQuantityProductInCart,
  getActiveCart,
  removeProductFromCart,
} from "../../api/api";
import "./cart-list.css";

interface DataType {
  key: string;
  name: string;
  image: string;
  count: number;
  price: string;
  totalPrice: string;
}

function mapToDataType(data: LineItem[]) {
  const result: DataType[] = [];
  data.forEach((product) => {
    const price = product.price.discounted?.value.centAmount || product.price.value.centAmount;
    result.push({
      key: product.id,
      name: product.name.en,
      image: product.variant.images?.[0].url || "",
      count: product.quantity,
      price:
        (price/ 100).toFixed(2).toString() + " $",
      totalPrice:
        (product.totalPrice.centAmount / 100).toFixed(2).toString() + " $",
    });
  });
  return result;
}

const CartList = () => {
  const [productsList, setProductList] = useState<LineItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [version, setVersion] = useState(0);

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
          <img
            className="cart-image"
            src={record.image}
            alt={record.name}
          ></img>
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
      render: (_, record) => {
        const increseCount = () => {
          changeQuantityProductInCart(record.key, record.count + 1).then(() => {
            setVersion((prev) => prev + 1);
          });
        };

        const decreseCount = () => {
          if (record.count > 1) {
            changeQuantityProductInCart(record.key, record.count - 1).then(
              () => {
                setVersion((prev) => prev + 1);
              },
            );
          }
        };

        const removeProduct = () => {
          removeProductFromCart(record.key).then(() => {
            setVersion((prev) => prev + 1);
          });
        };

        return (
          <Space size="small">
            <Button onClick={increseCount}>+</Button>
            <Button onClick={decreseCount}>-</Button>
            <Button onClick={removeProduct}>delete</Button>
          </Space>
        );
      },
    },
  ];

  React.useEffect(() => {
    if (
      localStorage.getItem("activeCart") ||
      localStorage.getItem("cart-customer")
    ) {
      getActiveCart().then((res) => {
        setTotalPrice(res.body.totalPrice.centAmount);
        setProductList(res.body.lineItems);
      });
    }
  }, [version]);

  return (
    <Table
      columns={columns}
      dataSource={mapToDataType(productsList)}
      footer={() => {
        return (
          <p style={{ fontSize: 18 }}>
            Total Sum: {(totalPrice / 100).toFixed(2).toString()} $
          </p>
        );
      }}
    />
  );
};

export default CartList;
