import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Modal, Row } from "antd";
import { LineItem, Product } from "@commercetools/platform-sdk";
import {
  addProductToCart,
  createCart,
  getActiveCart,
  getProductDetails,
  removeProductFromCart,
} from "../../api/api";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Product.css";
import { Carousel } from "react-responsive-carousel";
import { useParams } from "react-router-dom";

import { Context } from "../../components/context/Context";
import { notify } from "../../components/notification/notification";
import { ToastContainer } from "react-toastify";

const ProductPage: React.FC = () => {
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

  const [, setContext] = useContext(Context);
  const activeCart = localStorage.getItem("activeCart");
  const cartCustomer = localStorage.getItem("cart-customer");
  const productsOnCart = cartCustomer
    ? JSON.parse(cartCustomer).lineItems
    : activeCart
    ? JSON.parse(activeCart).lineItems
    : [];
  const [cart, setCart] = useState<LineItem[]>(productsOnCart);

  const isInCart = (id: string) => {
    return cart.find((item) => item.productId === id);
  };
  const lineItemId = isInCart(id)?.id!;

  const addItem = async (productId: string) => {
    if (!activeCart && !cartCustomer) {
      await createCart();
    }
    const fullCart = await addProductToCart(productId).then(() =>
      getActiveCart(),
    );
    setCart(fullCart.body.lineItems);
    setContext(fullCart.body.totalLineItemQuantity);

    if (cartCustomer) {
      localStorage.setItem("cart-customer", JSON.stringify(fullCart.body));
    } else {
      localStorage.setItem("activeCart", JSON.stringify(fullCart.body));
    }
  };

  const removeItem = async (lineItemId: string) => {
    const fullCart = await removeProductFromCart(lineItemId).then(() =>
      getActiveCart(),
    );
    setCart(fullCart.body.lineItems);
    setContext(fullCart.body.totalLineItemQuantity);

    if (cartCustomer) {
      localStorage.setItem("cart-customer", JSON.stringify(fullCart.body));
    } else {
      localStorage.setItem("activeCart", JSON.stringify(fullCart.body));
    }
  };

  return (
    <>
      <ToastContainer />
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
            {/* <div >{`Size: ${size}`}</div> */}
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
                type="primary"
                className="button button_remove"
                key={`${key}-add`}
                onClick={async () => {
                  await removeItem(lineItemId).then(() =>
                    notify("Product was removed successful!", "success")
                  ).catch(()=> notify("Removal operation fails", "error"));
                }}
                disabled={isInCart(id) ? false : true}
              >
                Remove from Cart
              </Button>

              <Button
                type="primary"
                className="button button_add"
                key={`${key}-remove`}
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
