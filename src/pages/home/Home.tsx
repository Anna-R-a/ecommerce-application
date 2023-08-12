import React from "react";
import { Carousel, Card, Col, Row } from "antd";
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
            <div className="carousel__home"></div>
            <div className="carousel__home"></div>
            <div className="carousel__home"></div>
        </Carousel>
    </div>
);

const titleStyle: React.CSSProperties = {
    boxShadow: "none",
};

const Advantages: React.FC = () => (
    <Row gutter={16}>
        <Col span={8}>
            <Card bordered={false} style={titleStyle}>
                <Meta
                    title="FREE DELIVERY"
                    avatar={<CarOutlined className="icon" />}
                    description="Consectetur adipi elit lorem ipsum dolor sit amet."
                />
            </Card>
        </Col>
        <Col span={8}>
            <Card bordered={false} style={titleStyle}>
                <Meta
                    title="QUALITY GUARANTEE"
                    avatar={<SafetyCertificateOutlined className="icon" />}
                    description="Consectetur adipi elit lorem ipsum dolor sit amet."
                />
            </Card>
        </Col>
        <Col span={8}>
            <Card bordered={false} style={titleStyle}>
                <Meta
                    title="DAILY OFFERS"
                    avatar={<DollarCircleOutlined className="icon" />}
                    description="Consectetur adipi elit lorem ipsum dolor sit amet."
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
        </>
    );
};

export default HomePage;
