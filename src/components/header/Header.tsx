import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import "./Header.css";

function Logo() {
  return (
    <div className="logo">
      <Link to="/" className="logo__link">
        FRESH
      </Link>
    </div>
  );
}

const itemsMenu: MenuProps["items"] = [
  {
    label: (
      <Link to="/" className="nav__link">
        Home
      </Link>
    ),
    key: "home",
  },
  {
    label: (
      <Link to="/catalog" className="nav__link">
        Catalog
      </Link>
    ),
    key: "catalog",
  },
  {
    label: (
      <Link to="/about" className="nav__link">
        About Us
      </Link>
    ),
    key: "about",
  },
];

const Nav: React.FC = () => {
  return (
    <Menu
      theme="light"
      mode="horizontal"
      className="navigation"
      // defaultSelectedKeys={['home']}
      items={itemsMenu}
    />
  );
};

const itemsUserBar: MenuProps["items"] = [
  {
    label: "",
    key: "SubMenu",
    icon: <UserOutlined />,
    children: [
      {
        label: (
          <Link to="/login" className="nav__link">
            Log In
          </Link>
        ),
        key: "login",
      },
      {
        label: (
          <Link to="/registration" className="nav__link">
            Registration
          </Link>
        ),
        key: "registration",
      },
    ],
  },
];

const UserBar: React.FC = () => {
  return <Menu className="user-bar" mode="horizontal" items={itemsUserBar} />;
};

export default function Header() {
  return (
    <header className="header">
      <div className="header__wrapper">
        <Logo />
        <Nav />
        <UserBar />
      </div>
    </header>
  );
}
