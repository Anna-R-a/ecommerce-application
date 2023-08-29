import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import { Menu, Button, Drawer } from "antd";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import { MenuInfo } from "rc-menu/lib/interface";
import "./NavBar.css";

const itemsNav: MenuProps["items"] = [
  {
    label: (
      <Link to="/" className="nav__link">
        Home
      </Link>
    ),
    key: "/",
  },
  {
    label: (
      <Link to="/catalog" className="nav__link">
        Catalog
      </Link>
    ),
    key: "/catalog",
  },
  {
    label: "About Us",
    key: "/about",
    disabled: true,
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
    label: "Profile",
    key: "/profile",
    disabled: true,
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

const handlerLogInOut = (info: MenuInfo) => {
  const isLogged = localStorage.getItem("isLogged");
  if (isLogged && info.key === "/login") {
    localStorage.clear();
  }
};

export const UserBar: React.FC = () => {
  const location = useLocation();

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
    <Menu
      className="user-bar"
      mode="horizontal"
      items={itemsUserBar}
      selectedKeys={[location.pathname]}
      onClick={handlerLogInOut}
    />
  );
};

export const NavDrawer: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

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
    <>
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
          className="user-bar"
          mode="inline"
          defaultOpenKeys={["SubMenu"]}
          items={itemsUserBar}
          selectedKeys={[location.pathname]}
          onClick={onClose}
        />
      </Drawer>
    </>
  );
};
