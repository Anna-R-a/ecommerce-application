import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import { Menu, Button, Drawer } from "antd";
import {
  UserOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { MenuInfo } from "rc-menu/lib/interface";
import { Context } from "../context/Context";
import "./NavBar.css";

const itemsNav: MenuProps["items"] = [
  {
    label: (
      <Link to="/" className="nav__link" data-testid="home-link">
        Home
      </Link>
    ),
    key: "/",
  },
  {
    label: (
      <Link to="/catalog" className="nav__link" data-testid="catalog-link">
        Catalog
      </Link>
    ),
    key: "/catalog",
  },
  {
    label: (
      <Link to="/about" className="nav__link" data-testid="about-link">
        About
      </Link>
    ),
    key: "/about",
  },
];

const subMenuWithoutAuth = [
  {
    label: (
      <Link to="/login" className="nav__link">
        Log In
      </Link>
    ),
    key: "/login",
  },
  {
    label: (
      <Link to="/registration" className="nav__link">
        Registration
      </Link>
    ),
    key: "/registration",
  },
];

const subMenuWithAuth = [
  {
    label: (
      <Link to="/login" className="nav__link">
        Log Out
      </Link>
    ),
    key: "/login",
  },
  {
    label: (
      <Link to="/profile" className="profile">
        Profile
      </Link>
    ),
    key: "/profile",
  },
];

export const Nav: React.FC = () => {
  const location = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      className="navigation"
      items={itemsNav}
      selectedKeys={[location.pathname]}
    />
  );
};

export const UserBar: React.FC = () => {
  const location = useLocation();
  const [context, setContext] = useContext(Context);

  const handlerLogInOut = (info: MenuInfo) => {
    const isLogged = localStorage.getItem("isLogged");
    if (isLogged && info.key === "/login") {
      localStorage.clear();
      setContext(null);
    }
  };

  const itemsUserBar: MenuProps["items"] = [
    {
      label: "",
      key: "SubMenu",
      icon: <UserOutlined className={"icon"} />,
      children: localStorage.getItem("isLogged")
        ? subMenuWithAuth
        : subMenuWithoutAuth,
    },
  ];

  return (
    <div className="user-bar">
      <Link to={"/cart"}>
        <ShoppingCartOutlined key="shoppingCart" className="shoppingCart" />
        <span className="shoppingCart__count">
          {!context
            ? 0
            : context.totalLineItemQuantity
            ? context.totalLineItemQuantity
            : 0}
        </span>
      </Link>

      <Menu
        className="user-bar__navigation"
        mode="horizontal"
        items={itemsUserBar}
        selectedKeys={[location.pathname]}
        onClick={handlerLogInOut}
      />
    </div>
  );
};

export const NavDrawer: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [context, setContext] = useContext(Context);

  const handlerLogInOut = (info: MenuInfo) => {
    const isLogged = localStorage.getItem("isLogged");
    if (isLogged && info.key === "/login") {
      localStorage.clear();
      setContext(null);
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onCloseDrawer = () => {
    setOpen(false);
  };

  const onClose = (info: MenuInfo) => {
    handlerLogInOut(info);
    setOpen(false);
  };

  const itemsUserBar: MenuProps["items"] = [
    {
      label: "",
      key: "SubMenu",
      disabled: true,
      children: localStorage.getItem("isLogged")
        ? subMenuWithAuth
        : subMenuWithoutAuth,
    },
  ];

  return (
    <div className="user-bar">
      <Link to={"/cart"}>
        <ShoppingCartOutlined key="shoppingCart" className="shoppingCart" />
        <span className="shoppingCart__count">
          {!context
            ? 0
            : context.totalLineItemQuantity
            ? context.totalLineItemQuantity
            : 0}
        </span>
      </Link>
      <Button
        type="default"
        onClick={showDrawer}
        className="hamburger"
        icon={<MenuOutlined />}
      />
      <Drawer
        title="Menu"
        placement={"right"}
        width={320}
        onClose={onCloseDrawer}
        open={open}
      >
        <Menu
          theme="light"
          mode="vertical"
          className="navigation"
          items={itemsNav}
          selectedKeys={[location.pathname]}
          onClick={onClose}
        />

        <Menu
          className="user-bar__navigation"
          mode="inline"
          defaultOpenKeys={["SubMenu"]}
          items={itemsUserBar}
          selectedKeys={[location.pathname]}
          onClick={onClose}
        />
      </Drawer>
    </div>
  );
};
