import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Checkbox, Layout, Menu, Space } from "antd";
import type { MenuProps } from "antd";
// import SiderMenu from "../../components/sider-menu/SiderMenu";
import ListProduct from "../../components/list-product/ListProduct";
import {
  getCategories,
  getProductsAttributes,
  getProductsFromCategory,
} from "../../api/api";
import { MenuInfo } from "rc-menu/lib/interface";
import { Category, ProductProjection } from "@commercetools/platform-sdk";
import "./Catalog.css";
import { CheckboxValueType } from "antd/es/checkbox/Group";

const { Sider, Content } = Layout;

type Props = { default: boolean };

const CatalogPage: React.FC<Props> = (props: Props) => {
  const currentCategoryLS = localStorage.getItem("currentCategory");
  const currentCategory = currentCategoryLS ? currentCategoryLS : "";

  const [categories, setCategories] = useState<MenuProps["items"]>([]);
  const [selectCategory, setSelectCategory] = useState(currentCategory);
  const [openKeys, setOpenKeys] = useState<string[]>([currentCategory]);
  const [data, setData] = useState<ProductProjection[]>([]);

  const [filter, setFilter] = useState<{name: string, value: CheckboxValueType[]}[]>();

  useEffect(() => {
    if (props.default) {
      setSelectCategory("default");
      setOpenKeys([""]);
      // setSelectCategory("241d5c5d-f8cc-45be-866f-14af2c0c150c");
      // setOpenKeys(["241d5c5d-f8cc-45be-866f-14af2c0c150c"]);
    }
  }, [props.default]);

  useEffect(() => {
    localStorage.setItem("currentCategory", selectCategory);
    getProductsFromCategory(selectCategory)
      .then((res) => {
        setData(res.body.results);
      })
      .catch(console.error);
  }, [selectCategory]);

  useEffect(() => {
    if (filter) {
      getProductsAttributes(filter)
      .then((res) => {
        console.log("res", res.body.results);
        setData(res.body.results);
      })
      .catch(console.error);
    }
  }, [filter]);

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
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
      setSelectCategory(latestOpenKey);
    }
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
        setCategories(createStructureMenu(res.body.results));
      })
      .catch(console.error);
    setSelectCategory(currentCategory);
    setOpenKeys([currentCategory]);
  }, []);

  const onChange = (checkedValues: CheckboxValueType[]) => {
    let nameFilter: string = '';
    let valueFilter: string[] = [];
    checkedValues.forEach((item) => {
      nameFilter = item.toString().split(" ")[0];
      valueFilter.push(item.toString().split(" ")[1]);
    });
    console.log([{name: nameFilter, value: valueFilter}]);
    setFilter([{name: nameFilter, value: valueFilter}]);
  };

  const onChangeSize = (checkedValues: CheckboxValueType[]) => {
    console.log("checked = ", checkedValues);
    setFilter([{name: "berries-size", value: checkedValues}]);
  };

  // const optionsColor = ["black", "blue", "red", "yellow"];

  // const optionsSize = ["small", "medium", "large"];

  const optionsColor = [
    { label: "black", value: "berries-color black" },
    { label: "blue", value: "berries-color blue" },
    { label: "red", value: "berries-color red" },
    { label: "yellow", value: "berries-color yellow" },
  ];

  const optionsSize = [
    { label: "small", value: "berries-size small" },
    { label: "medium", value: "berries-size medium" },
    { label: "large", value: "berries-size large" },
  ];

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
          className="sider-menu"
          items={categories}
          onClick={onClickMenu}
        />
        <Space
          direction="vertical"
          size="middle"
          style={{ display: "flex", padding: "20px" }}
        >
          <span>Color:</span>
          <Checkbox.Group
            name="berries-color"
            options={optionsColor}
            onChange={onChange}
          />
          <span>Size:</span>
          <Checkbox.Group
            name="berries-size"
            options={optionsSize}
            onChange={onChange}
          />
        </Space>
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
          <ListProduct data={data} />
          {/* <ListProduct selectCategory={selectCategory} /> */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CatalogPage;
