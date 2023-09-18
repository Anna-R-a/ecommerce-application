import React from "react";
import { Carousel, Card, Col, Row, Divider } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Meta from "antd/es/card/Meta";
import {
  CarOutlined,
  DollarCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import "./Home.css";

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
    <h2 className="promo__title">Want 15% off? Use promo code</h2>
    <Paragraph copyable={{ text: "autumn2023" }} className="promo-code">
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
  return (
    <>
      <CarouselHome />
      <h1>Only FRESH Farmer Goods</h1>
      <Advantages />
      <Divider />
      <PromoCode />
    </>
  );
};

export default HomePage;
