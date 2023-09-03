import React, { useEffect, useState } from "react";
import { Button, Card, Col,  Modal, Row } from "antd";
import { Product } from "@commercetools/platform-sdk";
import { getProductDetails } from "../../api/api";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Product.css";
import { Carousel } from "react-responsive-carousel";
import { useParams } from "react-router-dom";

const ProductPage: React.FC = () => {
  const [productData, setProductData] = useState<Product>();
  const { key } = useParams();
  
  const [slide, setSlide] = useState(0)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    getProductDetails({ key: `${key}` })
      .then((res) => {
        setProductData(res.body);
      })
      .catch(console.error);
  }, [key]);

  const name = productData?.masterData?.current?.name?.en;
  const images = productData?.masterData?.current?.masterVariant?.images?.length
    ? productData?.masterData?.current?.masterVariant?.images
    : [];

  const description = productData?.masterData?.current?.description
    ? productData?.masterData?.current?.description.en
    : "";

  const price = productData?.masterData?.current?.masterVariant?.prices
    ? productData?.masterData?.current?.masterVariant?.prices[0].value
        .centAmount / 100
    : 0;

  const priceDiscounted = productData?.masterData?.current?.masterVariant.prices
    ? productData?.masterData?.current?.masterVariant.prices[0].discounted
      ? productData?.masterData?.current?.masterVariant.prices[0].discounted
          ?.value.centAmount / 100
      : 0
    : 0;
  const discount = Math.ceil((1 - priceDiscounted / price) * 100);


  return (
    <>
      <Row>
        <Col span={24}>
          <h1 className="name">{name}</h1>
        </Col>
      </Row>
      <Row gutter={16} className="cols">
        <Col span={8} className="image-column">
          <div>
            <Carousel 
            showArrows={images.length>1}
            showThumbs={images.length>1}
            showIndicators={images.length>1}
            useKeyboardArrows
            onClickItem={(index) => {
              setSlide(index);
              showModal();
            }}>
              {images.map((image, i) => (
                <div key={i} className="images" >
                  <img alt={`${i}`} src={`${image.url}`} />
                </div>
              ))}
            </Carousel>
          </div>
        </Col>
        <Col span={8} className="description">
          <Card className="description-block">
            <div dangerouslySetInnerHTML={{ __html: `${description}` }}></div>
          </Card>
        </Col>
        <Col span={8} className="price">
          <Card className="price-block">
            <div className="price-info">
              <p className="price-text">
                {`${priceDiscounted || price} $/kg    `}
              </p>
              <p className="price-discounted">
                {priceDiscounted ? `${price} $/kg` : ""}
              </p>
              <p className="discount">
                {priceDiscounted ? `- ${discount} %` : ""}
              </p>
            </div>
            <Button type="primary">Add to cart</Button>
          </Card>
        </Col>
      </Row>
      <>
        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          className="modal-window"
          width={700}
          footer={[]}
        >
          <Carousel 
          showArrows={images.length>1}
          showThumbs={images.length>1}
          showIndicators={images.length>1}
          useKeyboardArrows 
          selectedItem={slide}    
          >
            {images.map((image, i) => (
              <div key={i} className="images">
                <img alt={`${i}`} src={`${image.url}`} />
              </div>
            ))}
          </Carousel>
        </Modal>
      </>
      </>
  );
};

export default ProductPage;
