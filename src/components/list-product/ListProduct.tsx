import React, { MouseEventHandler, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List } from "antd";
import { ProductProjection } from "@commercetools/platform-sdk";
import { ShoppingCartOutlined } from "@ant-design/icons";
import "./ListProduct.css";
import { addProductToCart, createCart, getActiveCart } from "../../api/api";

const { Meta } = Card;
type Props = { data: ProductProjection[] };

const ListProduct: React.FC<Props> = (props: Props) => {
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
        45
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


    const buttonRef = useRef(null);

  const addToCart = async (event: any) => {
    console.log("addToCart", event);
    let productId = "";
    if (event.target.title) {
      productId = event.target.title;
      event.target.setAttribute("disabled", "disabled");
    } else if (event.target.parentElement.title) {
      productId = event.target.parentElement.title;
      event.target.parentElement.setAttribute("disabled", "disabled");
    } else if (
      event.target.parentElement.parentElement.parentElement.parentElement.title
    ) {
      console.log(
        "event.target.parentElement.title",
        event.target.parentElement.parentElement.title
      );
      productId =
        event.target.parentElement.parentElement.parentElement.parentElement
          .title;
    }

    try {
      const activeCart = await getActiveCart();
      console.log("activeCart", activeCart);
      if (activeCart.statusCode === 200) {
        console.log("statusCode === 200");
        const fullCart = await addProductToCart(activeCart.body, productId);
        localStorage.setItem("activeCart", JSON.stringify(fullCart));
        localStorage.setItem("totalLineItemQuantity", `${fullCart.body.totalLineItemQuantity}`);
        console.log("fullCart", fullCart.body);
      }
    } catch (err: any) {
      if (err.statusCode === 404) {
        await createCart();
        const activeCart = await getActiveCart();

        const fullCart = await addProductToCart(activeCart.body, productId);
        localStorage.setItem("activeCart", JSON.stringify(fullCart));
        localStorage.setItem("totalLineItemQuantity", `${fullCart.body.totalLineItemQuantity}`);
        console.log("fullCart new", fullCart.body.lineItems);
      }
    }
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
      pagination={{ position: "bottom", align: "center", pageSize: 12 }}
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
                ref={buttonRef}
                type="primary"
                key={item.key}
                title={item.id}
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
