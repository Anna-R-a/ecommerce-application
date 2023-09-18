import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { LineItem, ProductProjection } from "@commercetools/platform-sdk";
import { addProductToCart, createCart } from "../../api/cart/cartItems";
import { Context } from "../context/Context";
import "./ListProduct.css";

const { Meta } = Card;
type Props = { data: ProductProjection[] };

const ListProduct: React.FC<Props> = (props: Props) => {
  const [context, setContext] = useContext(Context);

  const [cart, setCart] = useState<LineItem[]>(
    context ? context.lineItems : [],
  );

  const image = (item: ProductProjection) =>
    item.masterVariant.images ? item.masterVariant.images[0].url : "";

  const name = (item: ProductProjection) => item.name.en;

  const description = (item: ProductProjection) => {
    if (item.description) {
      const descriptionFull = item.description.en;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = descriptionFull;
      const descriptionShort = `${wrapper.childNodes[0].textContent?.slice(
        0,
        45,
      )}...`;
      return descriptionShort;
    }
  };

  const price = (item: ProductProjection) =>
    item.masterVariant.prices
      ? item.masterVariant.prices[0].value.centAmount / 100
      : 0;

  const priceDiscounted = (item: ProductProjection) =>
    item.masterVariant.prices
      ? item.masterVariant.prices[0].discounted
        ? item.masterVariant.prices[0].discounted?.value.centAmount / 100
        : 0
      : 0;

  const discount = (price: number, priceDiscounted: number) =>
    Math.round(((price - priceDiscounted) * 100) / price);

  const onDisabledButton = (id: string): boolean => {
    let disabled = false;
    cart.map((itemOnCart) =>
      itemOnCart.productId === id ? (disabled = true) : false,
    );
    return disabled;
  };

  const disableButtonByClick = (target: Element) => {
    target.closest(".button_primary")?.setAttribute("disabled", "disabled");
  };

  const addToCart = async (event: any) => {
    const { target } = event;
    const productId = target.closest(".button_primary")?.dataset.id;
    disableButtonByClick(target);

    if (!context) {
      await createCart();
    }
    const fullCart = await addProductToCart(productId);
    setCart(fullCart.body.lineItems);
    setContext(fullCart.body);
    localStorage.setItem("activeCart", JSON.stringify(fullCart.body));
  };

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      pagination={
        props.data.length > 12
          ? { position: "bottom", align: "center", pageSize: 12 }
          : false
      }
      dataSource={props.data}
      className="list__products"
      renderItem={(item) => (
        <List.Item className="product__item">
          <Card
            className="card__item"
            cover={
              <a href={`/products/${item.key}`}>
                <img alt={name(item)} src={image(item)} />
              </a>
            }
            actions={[
              <Button
                type="primary"
                key={item.key}
                data-id={item.id}
                disabled={onDisabledButton(item.id)}
                size="middle"
                className="button_primary"
                onClick={addToCart}
              >
                <ShoppingCartOutlined key="shoppingCart" /> Add to cart
              </Button>,
            ]}
          >
            <Link
              to={`/products/${item.key}`}
              key={item.key}
              className="product__link"
            >
              <Meta title={name(item)} description={description(item)} />
              <div className="product__price">
                <span className="price__basic">
                  {`$ ${priceDiscounted(item) || price(item)}`}
                </span>
                <span className="price__discounted">
                  {priceDiscounted(item) ? `$ ${price(item)}` : ""}
                </span>
                <span className="discount">
                  {priceDiscounted(item)
                    ? `-${discount(price(item), priceDiscounted(item))}%`
                    : ""}
                </span>
              </div>
            </Link>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default ListProduct;
