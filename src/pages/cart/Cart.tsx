import React from "react";
import "./Cart.css";
import CartList from "../../components/cart-list/CartList";

const CartPage: React.FC = () => {
  return (
    <div className="container">
      <CartList />
    </div>
  );
};

export default CartPage;
