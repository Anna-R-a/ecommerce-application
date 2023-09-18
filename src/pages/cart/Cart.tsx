import React from "react";
import "./Cart.css";
import CartList from "../../components/cart-list/CartList";

const CartPage: React.FC = () => {
  return (
    <div className="container">
      <h1>Cart</h1>
      <CartList />
    </div>
  );
};

export default CartPage;
