import React from "react";
import { Link } from "react-router-dom";
import { Carousel, Card, Col, Row, Button, Space } from "antd";
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

const Navigation: React.FC = () => (
  <Space direction="horizontal" className="navigation__home">
    <Link to="/">
      <Button type="primary" className="button_primary" block>
        Home
      </Button>
    </Link>
    <Link to="/login">
      <Button type="primary" className="button_primary" block>
        Login page
      </Button>
    </Link>
    <Link to="/registration">
      <Button type="primary" className="button_primary" block>
        Registration
      </Button>
    </Link>
    <Link to="/product">
      <Button type="primary" className="button_primary" block>
        Product
      </Button>
    </Link>
  </Space>
);

const HomePage: React.FC = () => {
  return (
    <>
      <CarouselHome />
      <Navigation />
      <h1>Only FRESH Farmer Goods</h1>
      <Advantages />
    </>
  );
};

export default HomePage;
