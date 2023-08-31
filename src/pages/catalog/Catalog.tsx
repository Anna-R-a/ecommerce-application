import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
// import SiderMenu from "../../components/sider-menu/SiderMenu";
import ListProduct from "../../components/list-product/ListProduct";
import type { MenuProps } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import { getCategories, getCategoriesStructure } from "../../api/api";
import "./Catalog.css";
import { Link, useLocation } from "react-router-dom";
import { Category } from "@commercetools/platform-sdk";

const { Sider, Content } = Layout;

const CatalogPage: React.FC = () => {
  //const location = useLocation();

  const [categories, setCategories] = useState<MenuProps["items"]>([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  type MenuItem = Required<MenuProps>["items"][number];
  type StructureMenu = {
    title: string;
    key: string;
    label: JSX.Element;
    children: MenuItem[];
  }[];

  const rootSubmenuKeys: string[] = [];

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
      console.log("latestOpenKey", latestOpenKey);
      setCurrentCategory(latestOpenKey);
    }
  };

  const createStructureMenu = (allCategories: Category[]) => {
    let treeCategories: StructureMenu = [];
    allCategories.forEach((item) => {
      if (!item.parent) {
        const menuItem = {
          title: `/${item.slug.en}`,
          key: item.id,
          //key: `/${item.slug.en}`,
          label: (
            <Link to={`/catalog/${item.slug.en}`} className="menu__link">
              {item.name.en}
            </Link>
          ),
          children: [],
        };
        treeCategories?.push(menuItem);
        rootSubmenuKeys.push(item.id);
      }
    });
    allCategories.forEach((item) => {
      if (item.parent) {
        const parentId = item.parent?.id;
        treeCategories?.forEach((itemParent) => {
          if (itemParent?.key === parentId && itemParent) {
            itemParent.children.push({
              key: item.id,
              label: (
                <Link
                  to={`/catalog${itemParent.title}/${item.slug.en}`}
                  className="menu-children__link"
                >
                  {item.name.en}
                </Link>
              ),
            });
          }
        });
      }
    });
    console.log("structureCategories", treeCategories);
    setCategories(treeCategories);
    //return treeCategories;
  };

  useEffect(() => {
    getCategories()
      .then((res) => {
        createStructureMenu(res.body.results);
        //setCategories(treeCategories);
      })
      .catch(console.error);
  }, []);

  const onClickMenu = (info: MenuInfo) => {
    setCurrentCategory(info.key);
  };

  return (
    <Layout style={{ width: "100%" }} className="catalog__wrapper">
      {/* <SiderMenu /> */}
      <Sider width={200} style={{ background: "#fff" }}>
        <Menu
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          selectedKeys={[currentCategory]}
          //selectedKeys={[location.pathname]}
          style={{ height: "100%", borderRight: 0 }}
          items={categories}
          onClick={onClickMenu}
        />
      </Sider>
      <Layout style={{ padding: "0 24px 24px", background: "#fff" }}>
        {/* <Breadcrumbs /> */}
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: "#fff",
          }}
        >
          <ListProduct currentCategory={currentCategory} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CatalogPage;
