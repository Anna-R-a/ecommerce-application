import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Modal, Row, message } from "antd";
import { LineItem, Product } from "@commercetools/platform-sdk";
import { getProductDetails } from "../../api/api";
import {
  addProductToCart,
  createCart,
  removeProductFromCart,
} from "../../api/cart/cartItems";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Product.css";
import { Carousel } from "react-responsive-carousel";
import { useParams } from "react-router-dom";
import { Context } from "../../components/context/Context";

const ProductPage: React.FC = () => {
  const [context, setContext] = useContext(Context);

  const [cart, setCart] = useState<LineItem[]>(
    context ? context.lineItems : [],
  );

  const [productData, setProductData] = useState<Product>();
  const { key } = useParams();

  const [slide, setSlide] = useState(0);

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
  const id = productData?.id!;
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

  const isInCart = (id: string) => {
    return cart.find((item) => item.productId === id);
  };
  const lineItemId = isInCart(id)?.id!;

  const addItem = async (productId: string) => {
    if (!context) {
      await createCart();
    }
    const fullCart = await addProductToCart(productId);
    setCart(fullCart.body.lineItems);
    setContext(fullCart.body);
    localStorage.setItem("activeCart", JSON.stringify(fullCart.body));
  };

  const removeItem = async (lineItemId: string) => {
    const fullCart = await removeProductFromCart(lineItemId);
    setCart(fullCart.body.lineItems);
    setContext(fullCart.body);
    localStorage.setItem("activeCart", JSON.stringify(fullCart.body));
  };

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
              showArrows={images.length > 1}
              showThumbs={images.length > 1}
              showIndicators={images.length > 1}
              useKeyboardArrows
              onClickItem={(index: React.SetStateAction<number>) => {
                setSlide(index);
                showModal();
              }}
            >
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
            <div dangerouslySetInnerHTML={{ __html: `${description}` }}></div>
          </Card>
        </Col>
        <Col span={8} className="price">
          <Card className="price-block">
            <div className="price-info">
              <p className="price-text">
                {`$ ${priceDiscounted || price} per kg`}
              </p>
              <p className="price-discounted">
                {priceDiscounted ? `$ ${price} per kg` : ""}
              </p>
              <p className="discount">
                {priceDiscounted ? `- ${discount} %` : ""}
              </p>
            </div>
            <div className="buttons">
              <Button
                data-testid="add-button"
                type="primary"
                className="button button_remove button_primary"
                key={`${key}-remove`}
                onClick={async () => {
                  await removeItem(lineItemId)
                    .then(() => message.success("Product was removed!"))
                    .catch(() => message.error("Removal operation fails"));
                }}
                disabled={isInCart(id) ? false : true}
              >
                Remove from Cart
              </Button>

              <Button
                type="primary"
                className="button button_add button_primary"
                key={`${key}-add`}
                onClick={async () => {
                  await addItem(id);
                }}
                disabled={isInCart(id) ? true : false}
              >
                Add to Cart
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      <>
        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          className="modal-window"
          width={650}
          footer={[]}
        >
          <Carousel
            showStatus={false}
            showArrows={images.length > 1}
            showThumbs={images.length > 1}
            showIndicators={images.length > 1}
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
