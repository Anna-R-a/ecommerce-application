import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
// import SiderMenu from "../../components/sider-menu/SiderMenu";
import ListProduct from "../../components/list-product/ListProduct";
import { getCategories } from "../../api/api";
import { MenuInfo } from "rc-menu/lib/interface";
import { Category } from "@commercetools/platform-sdk";
import "./Catalog.css";

const { Sider, Content } = Layout;

type Props = { default: boolean };

const CatalogPage: React.FC<Props> = (props: Props) => {
  const currentCategoryLS = localStorage.getItem("currentCategory");
  const currentCategory = currentCategoryLS ? currentCategoryLS : "";

  const [categories, setCategories] = useState<MenuProps["items"]>([]);
  const [selectCategory, setSelectCategory] = useState(currentCategory);
  const [openKeys, setOpenKeys] = useState<string[]>([currentCategory]);

  useEffect(() => {
    if (props.default) {
      setSelectCategory("default");
      setOpenKeys([""]);
      // setSelectCategory("241d5c5d-f8cc-45be-866f-14af2c0c150c");
      // setOpenKeys(["241d5c5d-f8cc-45be-866f-14af2c0c150c"]);
    }
  }, [props.default]);

  type MenuItem = Required<MenuProps>["items"][number];
  type StructureMenu = {
    title: string;
    key: string;
    label: JSX.Element;
    children: MenuItem[];
    onTitleClick: ({ key }: { key: string }) => void;
  }[];

  const rootSubmenuKeys: string[] = [];

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    console.log("keys", keys);
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
      setSelectCategory(latestOpenKey);
    }
    // if (latestOpenKey && rootSubmenuKeys.find((key) => openKeys.indexOf(key) === -1)) {
    //   setOpenKeys([latestOpenKey]);
    //   setSelectCategory(latestOpenKey);
    // } else {
    //   setOpenKeys([keys[1]]);
    //   setSelectCategory(keys[0]);
    // }
  };

  const onClickMenu = (info: MenuInfo) => {
    setSelectCategory(info.key);
  };

  const createStructureMenu = (allCategories: Category[]) => {
    let treeCategories: StructureMenu = [];
    allCategories.forEach((item) => {
      if (!item.parent) {
        const menuItem = {
          title: `/${item.slug.en}`,
          key: item.id,
          label: (
            <Link to={`/catalog/${item.slug.en}`} className="menu__link">
              {item.name.en}
            </Link>
          ),
          children: [],
          onTitleClick: ({ key }: { key: string }) => setSelectCategory(key),
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
    return treeCategories;
  };

  useEffect(() => {
    getCategories()
      .then((res) => {
        //createStructureMenu(res.body.results);
        setCategories(createStructureMenu(res.body.results));
      })
      .catch(console.error);
      setSelectCategory(currentCategory);
      console.log("OpenKeys", openKeys);
      setOpenKeys([currentCategory]);
  }, []);

  return (
    <Layout style={{ width: "100%" }} className="catalog__wrapper">
      {/* <SiderMenu /> */}
      <Sider width={200} style={{ background: "#fff" }}>
        <Menu
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          selectedKeys={[selectCategory]}
          defaultSelectedKeys={[selectCategory]}
          defaultOpenKeys={openKeys}
          //selectedKeys={[location.pathname]}
          className="sider-menu"
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
          <ListProduct selectCategory={selectCategory} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CatalogPage;
