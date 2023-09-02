import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, List } from "antd";
import { ProductProjection } from "@commercetools/platform-sdk";
import { getProductsFromCategory } from "../../api/api";
import "./ListProduct.css";

const { Meta } = Card;

type Props = { selectCategory: string };

const ListProduct: React.FC<Props> = (props: Props) => {
  const [categoriesId, setCategoriesId] = useState(props.selectCategory);
  const [data, setData] = useState<ProductProjection[]>([]);
  const categories = ["241d5c5d-f8cc-45be-866f-14af2c0c150c", "fcf30caa-46ad-4ac8-b859-3fc0395b791c", "1836bc07-4722-42e4-a8cf-5ad943e8da0b"];

  useEffect(() => {
    if (props.selectCategory === "default") {
      setData([]);
      // console.log('categories', categories);
      // categories.forEach((categoryId) => {
      //   getProductsFromCategory(categoryId)
      //   .then((res) => {
      //     setData((prev) => {
      //       // if (prev) {
      //       //   prev.push(...res.body.results)
      //       //   console.log('prev', prev);
      //       //   return prev;
      //       // } else {
      //         return res.body.results;
      //       //}
      //     });
      //   })
      //   .catch(console.error);
      // })

    } else {
      setCategoriesId(props.selectCategory);
      localStorage.setItem("currentCategory", props.selectCategory);
      getProductsFromCategory(categoriesId)
        .then((res) => {
          setData(res.body.results);
        })
        .catch(console.error);
    }
  }, [categoriesId, props.selectCategory]);

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
      pagination={{ position: "bottom", align: "center" }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Link to={`/products/${item.key}`} className="product__link">
            <Card
              className="card__item"
              cover={<img alt={name(item)} src={image(item)} />}
              actions={
                [
                  // <Button
                  //   type="primary"
                  //   key="shoppingCart"
                  //   title="In cart"
                  //   size="middle"
                  //   className="button_primary"
                  // >
                  //   <ShoppingCartOutlined key="shoppingCart" />
                  // </Button>,
                ]
              }
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
            </Card>
          </Link>
        </List.Item>
      )}
    />
  );
};

export default ListProduct;
