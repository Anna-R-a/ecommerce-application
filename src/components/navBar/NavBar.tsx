import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, Button, Drawer } from "antd";
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

const subMenu = [
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
    },
];

const itemsUserBar: MenuProps["items"] = [
    {
        label: "",
        key: "SubMenu",
        icon: <UserOutlined className={"icon"} />,
        children: subMenu,
    },
];

const itemsUserBarHamburger: MenuProps["items"] = [
    {
        label: "",
        key: "SubMenu",
        disabled: true,
        children: subMenu,
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
    return (
        <Menu
            className="user-bar"
            mode="horizontal"
            items={itemsUserBar}
            selectedKeys={[location.pathname]}
        />
    );
};

export const NavDrawer: React.FC = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

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
                onClose={onClose}
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
                    defaultOpenKeys={['SubMenu']}
                    items={itemsUserBarHamburger}
                    selectedKeys={[location.pathname]}
                    onClick={onClose}
                />
            </Drawer>
        </>
    );
};
