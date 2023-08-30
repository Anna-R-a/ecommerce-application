import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "antd";
import { Product } from "@commercetools/platform-sdk";
import { getProductDetails } from "../../api/api";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Product.css";
import { Carousel } from "react-responsive-carousel";

const ProductPage = () => {
  // const { name, image, price, description } = product;

  const keyProduct = "tomatoes-red-1";

  const [productData, setProductData] = useState<Product>();

  useEffect(() => {
    getProductDetails({ key: `${keyProduct}` })
      .then((res) => {
        console.log(res.body);
        setProductData(res.body);
      })
      .catch(console.error);
  });
  const name = productData?.masterData?.current?.name?.en;
  const images = productData?.masterData?.current?.masterVariant?.images?.length
    ? productData?.masterData?.current?.masterVariant?.images
    : [];
  const description = productData?.masterData?.current?.description
    ? productData?.masterData?.current?.description.en
    : "";
  const price = productData?.masterData?.current?.masterVariant?.prices
    ? productData?.masterData?.current?.masterVariant?.prices[0].value
        .centAmount
    : 0;

  return (
    <>
      <Row>
        <Col span={24}>
          <h1 className="name">{name}</h1>
        </Col>
      </Row>
      <Row>
        <Col span={8} className="image-column">
          <div>
            <Carousel showArrows={true}>
              {images.map((image, i) => (
                <div key={i} className="images">
                  <img alt={`${i}`} src={`${image.url}`} />
                </div>
              ))}
            </Carousel>
          </div>
        </Col>
        <Col span={8} className="description">
          <Card className="description-block">
            <h3>{description}</h3>
          </Card>
        </Col>
        <Col span={8} className="price">
          <Card className="price-block">
            <h3>
              {(price / 100).toFixed(2).toString().replace(".", ",") + " $/kg"}
            </h3>
            <Button type="primary">Add to cart</Button>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductPage;
