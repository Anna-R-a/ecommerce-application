import React, { useEffect, useState } from "react";
import { Carousel, Card, Col, Row, Divider } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Meta from "antd/es/card/Meta";
import {
  CarOutlined,
  DollarCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import "./Home.css";
import ListProduct from "../../components/list-product/ListProduct";
import { getProductsFromCategory } from "../../api/api";
import { ProductProjection } from "@commercetools/platform-sdk";

const CarouselHome: React.FC = () => (
  <div className="carousel">
    <Carousel autoplay>
      <div className="carousel__home slide_1"></div>
      <div className="carousel__home slide_2"></div>
    </Carousel>
  </div>
);

const PromoCode: React.FC = () => (
  <div className="promo__container">
    <h2 className="promo__title">Want 10% off? Use promo code</h2>
    <Paragraph copyable className="promo-code">
      autumn2023
    </Paragraph>
  </div>
);

const Advantages: React.FC = () => (
  <Row gutter={16} className="advantages__row">
    <Col span={8} className="advantages__col">
      <Card bordered={false} className="advantages__card">
        <Meta
          title="FREE DELIVERY"
          avatar={<CarOutlined className="icon" />}
          description="Well-functioning logistics allows us to deliver orders free of charge."
        />
      </Card>
    </Col>
    <Col span={8} className="advantages__col">
      <Card bordered={false} className="advantages__card">
        <Meta
          title="QUALITY GUARANTEE"
          avatar={<SafetyCertificateOutlined className="icon" />}
          description="Only natural and fresh products without GMOs. We provide a quality certificate."
        />
      </Card>
    </Col>
    <Col span={8} className="advantages__col">
      <Card bordered={false} className="advantages__card">
        <Meta
          title="DAILY OFFERS"
          avatar={<DollarCircleOutlined className="icon" />}
          description="Daily promotions with discounts of up to 20% for regular customers."
        />
      </Card>
    </Col>
  </Row>
);

const HomePage: React.FC = () => {
  const [ data, setData ] = useState<ProductProjection[]>([]);
  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  }

  useEffect(() => {
    getProductsFromCategory([], { name: "", price: "" }, [], [0, 15]).then((res) => {
      const products: ProductProjection[] = res.body.results;
      const productsHome: ProductProjection[] =  [];

      while (productsHome.length !== 4) {
        const product = products[getRandomInt(products.length - 1)];
        if (!productsHome.find(item => item.id === product.id)) {
          productsHome.push(product);
        }
      }
      setData(productsHome);
    })
  }, [])

  return (
    <div className="container">
      <CarouselHome />
      <h1>Only FRESH Farmer Goods</h1>
      <Advantages />
      <Divider />
      <PromoCode />
      <Divider />
      <h2>Our Goods</h2>
      <ListProduct data={data} />
    </div>
  );
};

export default HomePage;
