import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Modal, Row } from "antd";
import { LineItem, Product } from "@commercetools/platform-sdk";
import { addProductToCart, createCart, getActiveCart, getProductDetails } from "../../api/api";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Product.css";
import { Carousel } from "react-responsive-carousel";
import { useParams } from "react-router-dom";
import { removeProductFromCart } from "../../api/cart/cartItems";
import { Context } from "../../components/context/Context";

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

  // const size =  productData?.masterData?.current?.masterVariant?.attributes
  //   ? productData?.masterData?.current?.masterVariant?.attributes[1].value.label
  //   :'';

  // const color =  productData?.masterData?.current?.masterVariant?.attributes
  // ? productData?.masterData?.current?.masterVariant?.attributes[1].value.label
  // :'';

  const [context, setContext] = useContext(Context);
  const activeCart = localStorage.getItem("activeCart");
  const cartCustomer = localStorage.getItem("cart-customer");
  const productsOnCart = cartCustomer
    ? JSON.parse(cartCustomer).lineItems
    : activeCart
    ? JSON.parse(activeCart).lineItems
    : [];
  const [cart, setCart] = useState<LineItem[]>(productsOnCart);
  console.log('cart', cart)
  const isInCart = (id: string) =>{
    return cart.find(item => item.productId === id);
  }

  const addItem = async (productId: string) => {
    if (!activeCart && !cartCustomer) {
      await createCart();
  }
  // const increseadCart = await addProductToCart(productId);
  // const fullCart = increseadCart;
  const fullCart =  await addProductToCart(productId).then(()=> getActiveCart()) ;
  setCart(fullCart.body.lineItems);
  setContext(fullCart.body.totalLineItemQuantity);
  
  if (cartCustomer) {
      localStorage.setItem("cart-customer", JSON.stringify(fullCart.body));
    } else {
      localStorage.setItem("activeCart", JSON.stringify(fullCart.body));
    }
  }

  const removeItem = async (productId: string) => {
  // const decreseadCart = await removeProductFromCart(productId);
  // const fullCart = decreseadCart;
  const fullCart =  await removeProductFromCart(productId).then(()=> getActiveCart()) 
  setCart(fullCart.body.lineItems);
  setContext(fullCart.body.totalLineItemQuantity);
  
  if (cartCustomer) {
      localStorage.setItem("cart-customer", JSON.stringify(fullCart.body));
    } else {
      localStorage.setItem("activeCart", JSON.stringify(fullCart.body));
    }
  }

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
            <div>
              {isInCart(id) 
            ? (<Button 
            type="primary" 
            className="button_primary" 
            key={`${key}`}
            onClick={async()=> {await removeItem(id);
              console.log('cart-remove', cart)}}
          >
            Remove
          </Button>)
          : (<Button 
          type="primary" 
          className="button_primary" 
          key={`${key}`}
          onClick={async()=> {await addItem(id);
          console.log('cart-add', cart)}}
        >
         Add to cart
        </Button>)
              }
            {/* <Button 
              type="primary" 
              className="button_primary" 
              key={`${key}`}
              onClick={async()=> await checkItem(id)}
            >
              {isInCart(id) ? "Remove" : "Add to cart"}
            </Button> */}
            </div>
            {/* <Button 
              type="primary" 
              className="button_primary" 
              key={`${key}`}
              onClick={()=>checkItem(id)}
            >
              Add to cart
            </Button> */}
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
