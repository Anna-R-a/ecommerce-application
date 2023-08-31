import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
// import SiderMenu from "../../components/sider-menu/SiderMenu";
import ListProduct from "../../components/list-product/ListProduct";
import type { MenuProps } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import { getCategories, getCategoriesStructure } from "../../api/api";
import "./Catalog.css";
import { Link, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

const CatalogPage: React.FC = () => {
  const location = useLocation();

  const [categories, setCategories] = useState<MenuProps["items"]>([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  type MenuItem = Required<MenuProps>["items"][number];
  const rootSubmenuKeys: string[] = [];

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
      setCurrentCategory(latestOpenKey);
    }
  };

  useEffect(() => {
    getCategories()
      .then((res) => {
        console.log(res.body.results);
        const allCategories = res.body.results;
        let structureCategories: {
          title: string;
          key: string;
          label: JSX.Element;
          children: MenuItem[];
        }[] = [];
        allCategories.forEach((item) => {
          if (!item.parent) {
            const menuItem = {
              title: item.id,
              key: `/${item.slug.en}`,
              label: (
                <Link to={`/catalog/${item.slug.en}`} className="menu__link">
                  {item.name.en}
                </Link>
              ),
              children: [],
            };
            structureCategories?.push(menuItem);
            rootSubmenuKeys.push(item.id);
          }
        });
        allCategories.forEach((item) => {
          if (item.parent) {
            const parentId = item.parent?.id;
            structureCategories?.forEach((itemParent) => {
              if (itemParent?.title === parentId && itemParent) {
                itemParent.children.push({
                  key: `/${item.slug.en}`,
                  label: (
                    <Link
                      to={`/catalog${itemParent.key}/${item.slug.en}`}
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
        setCategories(structureCategories);
        console.log("structureCategories", structureCategories);
      })
      .catch(console.error);
    // getCategoriesStructure()
    //   .then((result) => {
    //     console.log("getCategoriesStructure", result.body.results);
    // setCategories(res.body.results);
    //   })
    //   .catch(console.error);
  }, []);

  const onClickMenu = (info: MenuInfo) => {
    console.log("info", info.key);
    setCurrentCategory(info.key);
  };
  console.log("currentCategory", currentCategory);

  return (
    <Layout style={{ width: "100%" }} className="catalog__wrapper">
      {/* <SiderMenu /> */}
      <Sider width={200} style={{ background: "#fff" }}>
        <Menu
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          selectedKeys={[location.pathname]}
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
          <ListProduct />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CatalogPage;
