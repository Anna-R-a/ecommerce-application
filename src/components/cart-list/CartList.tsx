import React, { useState } from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LineItem } from "@commercetools/platform-sdk";
import {
  changeQuantityProductInCart,
  createCart,
  deleteCart,
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
  productKey: string;
}

function mapToDataType(data: LineItem[]) {
  const result: DataType[] = [];
  data.forEach((product) => {
    const price =
      product.price.discounted?.value.centAmount ||
      product.price.value.centAmount;
    result.push({
      key: product.id,
      name: product.name.en,
      image: product.variant.images?.[0].url || "",
      count: product.quantity,
      price: (price / 100).toFixed(2).toString() + " $",
      totalPrice:
        (product.totalPrice.centAmount / 100).toFixed(2).toString() + " $",
      productKey: product.productKey || "",
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
      render: (_, record) => {
        return <a href={`/products/${record.productKey}`}>{record.name}</a>;
      },
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
      getActiveCart().then((res: any) => {
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
        const isDisabled = () => {
          if(productsList.length === 0){
            return true
          }
          return false
        }

        const clearCart = () =>{
          if(localStorage.getItem('activeCart')){
            deleteCart().then(() => {
              localStorage.removeItem('activeCart')
              setProductList([])
            }
            )
          }
          if(localStorage.getItem('cart-customer')){
            deleteCart().then(()=>{
              createCart().then((res)=>{
                  localStorage.setItem('cart-customer', JSON.stringify(res.body))
              }).then(()=>{
                setVersion(prev => prev + 1)
              })
            })
          }

        }     

        return (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
          <p style={{ fontSize: 18 }}>
            Total Sum: {(totalPrice / 100).toFixed(2).toString()} $
          </p>
          <Button className="button_primary" type="primary" disabled={isDisabled()} onClick={clearCart}>Clear cart</Button>
        </div>
        );
      }}
    />
  );
};

export default CartList;
