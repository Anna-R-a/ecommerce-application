import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import "./Header.css";

const Logo: React.FC = () => {
  return (
    <div className="logo">
      <Link to="/" className="logo__link">
        <span className="logo__icon"></span>
        FRESH
      </Link>
    </div>
  );
};

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

const Nav: React.FC = () => {
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

const itemsUserBar: MenuProps["items"] = [
  {
    label: "",
    key: "SubMenu",
    icon: <UserOutlined className={"icon"} />,
    children: [
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
      {
        label: (
          <Link to="/profile" className="nav__link">
            Profile
          </Link>
        ),
        key: "/profile",
        style: { color: "#fff", backgroundColor: "#92bfc1" },
      },
    ],
  },
];

const UserBar: React.FC = () => {
  const location = useLocation();
  return (
    <Menu
      className="user-bar"
      mode="horizontal"
      items={itemsUserBar}
      selectedKeys={[location.pathname]}
    />
  );
};

export const Header = () => {
  return (
    <header className="header" data-testid="header">
      <div className="wrapper">
        <Logo />
        <Nav />
        <UserBar />
      </div>
    </header>
  );
}
