import React, { useContext, useState } from "react";
import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LineItem } from "@commercetools/platform-sdk";
import { Context } from "../context/Context";
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
  const [context, setContext] = useContext(Context);
  const [productsList, setProductList] = useState<LineItem[]>(
    context ? context.lineItems : []
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const [version, setVersion] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              }
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
            <Button onClick={increseCount} className="button_default">+</Button>
            <Button onClick={decreseCount} className="button_default">-</Button>
            <Button onClick={removeProduct} className="button_default">delete</Button>
          </Space>
        );
      },
    },
  ];

  // React.useEffect(() => {
  //   if (
  //     localStorage.getItem("activeCart") ||
  //     localStorage.getItem("cart-customer")
  //   ) {
  //     getActiveCart().then((res: any) => {
  //       setTotalPrice(res.body.totalPrice.centAmount);
  //       setProductList(res.body.lineItems);
  //       setContext(res.body);
  //     });
  //   }
  // }, [version]);

  React.useEffect(() => {
    if (context) {
      getActiveCart().then((res: any) => {
        setTotalPrice(res.body.totalPrice.centAmount);
        setProductList(res.body.lineItems);
        setContext(res.body);
      });
    }
  }, [context, setContext, version]);

  return (
    <Table
      scroll={{ x: true }}
      locale={{
        emptyText: (
          <div className="empty-cart-text">
            Your basket is empty. To select a product, go to the{" "}
            <a href="/catalog">Catalog</a>
          </div>
        ),
      }}
      columns={columns}
      dataSource={mapToDataType(productsList)}
      footer={() => {
        const isDisabled = () => {
          if (productsList.length === 0) {
            return true;
          }
          return false;
        };

        const showModal = () => {
          setIsModalOpen(true);
        };

        const handleOk = () => {
          if (localStorage.getItem("activeCart")) {
            deleteCart().then(() => {
              localStorage.removeItem("activeCart");
              setProductList([]);
              setTotalPrice(0);
              setContext(null);
            });
          }
          if (localStorage.getItem("cart-customer")) {
            deleteCart().then(() => {
              createCart()
                .then((res) => {
                  localStorage.setItem(
                    "cart-customer",
                    JSON.stringify(res.body)
                  );
                })
                .then(() => {
                  setVersion((prev) => prev + 1);
                });
            });
          }
          setIsModalOpen(false);
        };

        const handleCancel = () => {
          setIsModalOpen(false);
        };

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: 18 }}>
              Total Sum: {(totalPrice / 100).toFixed(2).toString()} $
            </p>
            <Button
              className="button_primary"
              type="primary"
              disabled={isDisabled()}
              onClick={showModal}
            >
              Clear cart
            </Button>
            <Modal
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              okButtonProps={{ className: "modal_button" }}
            >
              <p>Do you really want to empty the cart?</p>
            </Modal>
          </div>
        );
      }}
    />
  );
};

export default CartList;
