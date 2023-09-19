import React, { useContext, useState } from "react";
import { Button, Form, Input, Modal, Space, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LineItem } from "@commercetools/platform-sdk";
import { Context } from "../context/Context";
import {
  changeQuantityProductInCart,
  deleteCart,
  getActiveCart,
  removeProductFromCart,
  addDiscountToCart,
} from "../../api/cart/cartItems";
import "./cart-list.css";

interface DataType {
  key: string;
  name: string;
  image: string;
  count: number;
  price: string;
  totalPrice: string;
  productKey: string;
  discountPrice: string;
}

function mapToDataType(data: LineItem[]) {
  const result: DataType[] = [];
  data.forEach((product) => {
    const price = product.price.value.centAmount;
    let priceWithDiscount = "";
    const discount = product.price.discounted?.value.centAmount;
    if (discount) {
      priceWithDiscount = (discount / 100).toFixed(2).toString() + " $";
    }
    if (product.discountedPricePerQuantity.length) {
      priceWithDiscount =
        (
          product.discountedPricePerQuantity[0].discountedPrice.value
            .centAmount / 100
        )
          .toFixed(2)
          .toString() + " $";
    }
    result.push({
      key: product.id,
      name: product.name.en,
      image: product.variant.images?.[0].url || "",
      count: product.quantity,
      price: (price / 100).toFixed(2).toString() + " $",
      totalPrice:
        (product.totalPrice.centAmount / 100).toFixed(2).toString() + " $",
      productKey: product.productKey || "",
      discountPrice: priceWithDiscount,
    });
  });
  return result;
}

const CartList = () => {
  const [context, setContext] = useContext(Context);
  const [productsList, setProductList] = useState<LineItem[]>(
    context ? context.lineItems : [],
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const [version, setVersion] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

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
      title: "Price with Discount",
      dataIndex: "discountPrice",
      key: "discountPrice",
      render: (_, record) => {
        return <b>{record.discountPrice}</b>;
      },
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
        const increaseCount = () => {
          changeQuantityProductInCart(record.key, record.count + 1).then(() => {
            setVersion((prev) => prev + 1);
          });
        };

        const decreaseCount = () => {
          if (record.count > 1) {
            changeQuantityProductInCart(record.key, record.count - 1).then(
              () => {
                setVersion((prev) => prev + 1);
              },
            );
          }
          if (record.count === 1) {
            removeProductFromCart(record.key).then(() => {
              if (productsList.length === 1) {
                localStorage.removeItem("activeCart");
              }
              setVersion((prev) => prev + 1);
            });
          }
        };

        const removeProduct = () => {
          removeProductFromCart(record.key).then(() => {
            if (productsList.length === 1) {
              localStorage.removeItem("activeCart");
            }
            setVersion((prev) => prev + 1);
          });
        };

        return (
          <Space size="small">
            <Button onClick={increaseCount} className="button_default">
              +
            </Button>
            <Button onClick={decreaseCount} className="button_default">
              -
            </Button>
            <Button onClick={removeProduct} className="button_default">
              delete
            </Button>
          </Space>
        );
      },
    },
  ];

  React.useEffect(() => {
    if (context) {
      getActiveCart().then((res: any) => {
        setTotalPrice(res.body.totalPrice.centAmount);
        setProductList(res.body.lineItems);
        setContext(res.body);
      });
    }
  }, [version]);

  return (
    <Table
      pagination={false}
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

        const showModalClearCart = () => {
          setIsModalOpen(true);
        };

        const showAddOrder = () => {
          if (localStorage.getItem("activeCart")) {
            deleteCart().then(() => {
              localStorage.removeItem("activeCart");
              setProductList([]);
              setTotalPrice(0);
              setContext(null);
            });
          }
          message.success("The order has been created!");
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
          setIsModalOpen(false);
        };

        const handleCancel = () => {
          setIsModalOpen(false);
        };

        const applyDiscountCode = (value: { promoCode: string }) => {
          addDiscountToCart(form.getFieldValue("promoCode"))
            .then(() => {
              message.success("Promo code applied!");
              setVersion((prev) => prev + 1);
            })
            .catch(() => {
              message.error("Promo code not found!");
            });
        };

        const onFailedApplyCode = () => {
          message.error("Promo code not found!");
        };

        const onChange = () => {
          setDisabled(false);
        };

        return (
          <div className="table-footer">
            <div className="table-footer__promo">
              <Form
                onChange={onChange}
                form={form}
                className="table-footer__promo"
                layout="horizontal"
                onFinish={applyDiscountCode}
                onFinishFailed={onFailedApplyCode}
              >
                <Form.Item name="promoCode">
                  <Input
                    placeholder="Promo code"
                    className="table-footer__input"
                  />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="button_primary"
                      disabled={disabled}
                    >
                      Apply promo code
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
            <p style={{ fontSize: 18 }}>
              Total Sum: {(totalPrice / 100).toFixed(2).toString()} $
            </p>
            <div className="table-footer__action">
              <Button
                className="button_primary"
                type="primary"
                disabled={isDisabled()}
                onClick={showModalClearCart}
              >
                Clear cart
              </Button>
              <Button
                className="button_primary"
                type="primary"
                disabled={isDisabled()}
                onClick={showAddOrder}
              >
                Add order
              </Button>
              <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{ className: "modal_button button_primary" }}
                cancelButtonProps={{ className: "button_default" }}
              >
                <p>Do you really want to empty the cart?</p>
              </Modal>
            </div>
          </div>
        );
      }}
    />
  );
};

export default CartList;
