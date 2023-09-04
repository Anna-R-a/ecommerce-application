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

export const Filters: React.FC<Props> = (props: Props) => {
  const currentCategoryLS = localStorage.getItem("currentCategory");
  const currentCategory = currentCategoryLS ? currentCategoryLS : "";

  const [categories, setCategories] = useState<MenuProps["items"]>([]);
  const [selectCategory, setSelectCategory] = useState(currentCategory);
  const [openKeys, setOpenKeys] = useState<string[]>([currentCategory]);
  const [data, setData] = useState<ProductProjection[]>([]);

  const [filter, setFilter] = useState<
    { name: string; value: CheckboxValueType[] }[]
  >([]);

  useEffect(() => {
    if (filter.length > 0) {
      getProductsAttributes(filter)
        .then((res) => {
          console.log("res", res.body.results);
          setData(res.body.results);
        })
        .catch(console.error);
    } else {
      // getProductsFromCategory([selectCategory], selectSorting)
      //   .then((res) => {
      //     setData(res.body.results);
      //   })
      //   .catch(console.error);
    }
  }, [filter, selectCategory]);

  const onChangeColor = (checkedValues: CheckboxValueType[]) => {
    const nameFilter = "berries-color";
    handlerFilter(nameFilter, checkedValues);
  };

  const onChangeSize = (checkedValues: CheckboxValueType[]) => {
    const nameFilter = "berries-size";
    handlerFilter(nameFilter, checkedValues);
  };

  const handlerFilter = (
    nameFilter: string,
    checkedValues: CheckboxValueType[],
  ) => {
    setFilter((prev) => {
      prev = prev.length === 1 && prev[0].name === nameFilter ? [] : prev;
      if (prev.length > 1) {
        const selectPrev: { name: string; value: CheckboxValueType[] }[] = [];
        prev.forEach((item) => {
          if (item.name !== nameFilter) {
            selectPrev.push(item);
          }
        });
        prev = [...selectPrev];
      }
      return checkedValues.length === 0
        ? prev
        : [...prev, { name: nameFilter, value: checkedValues }];
    });
  };

  const optionsColor = ["black", "blue", "red", "yellow"];

  const optionsSize = ["small", "medium", "large"];

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ display: "flex", padding: "20px" }}
    >
      <span>Color:</span>
      <Checkbox.Group
        name="berries-color"
        options={optionsColor}
        onChange={onChangeColor}
      />
      <span>Size:</span>
      <Checkbox.Group
        name="berries-size"
        options={optionsSize}
        onChange={onChangeSize}
      />
    </Space>
  );
};
