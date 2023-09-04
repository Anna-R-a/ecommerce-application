import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Checkbox, Dropdown, Layout, Menu, Space } from "antd";
import type { CheckboxOptionType, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { CheckboxValueType } from "antd/es/checkbox/Group";
// import SiderMenu from "../../components/sider-menu/SiderMenu";
import ListProduct from "../../components/list-product/ListProduct";
import {
  getCategories,
  getProductType,
  getProductsFromCategory,
} from "../../api/api";
import { MenuInfo } from "rc-menu/lib/interface";
import {
  AttributeDefinition,
  Category,
  ProductProjection,
} from "@commercetools/platform-sdk";
import "./Catalog.css";

const { Sider, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];
type StructureMenu = {
  title: string;
  key: string;
  label: JSX.Element;
  children: MenuItem[];
  onTitleClick: ({ key }: { key: string }) => void;
}[];

type Filter = {
  keyField: string;
  labelField: string;
  value: CheckboxOptionType[];
};

const CatalogPage: React.FC = () => {
  const { key } = useParams();

  const currentCategoryLS = localStorage.getItem("currentCategory");
  const currentCategory = currentCategoryLS ? currentCategoryLS : "";

  const [categories, setCategories] = useState<MenuProps["items"]>([]);
  const [selectCategory, setSelectCategory] = useState(currentCategory);
  const [openKeys, setOpenKeys] = useState<string[]>([currentCategory]);
  const [data, setData] = useState<ProductProjection[]>([]);

  const [filter, setFilter] = useState<
    { name: string; value: CheckboxValueType[] }[]
  >([]);

  const [filtersCategory, setFiltersCategory] = useState<Filter[]>([]);
  const [selectFilters, setSelectFilters] = useState<CheckboxValueType[]>([]);
  const [selectSorting, setSelectSorting] = useState({ name: "", price: "" });

  useEffect(() => {
    const allCategoriesID = [
      "241d5c5d-f8cc-45be-866f-14af2c0c150c",
      "fcf30caa-46ad-4ac8-b859-3fc0395b791c",
      "1836bc07-4722-42e4-a8cf-5ad943e8da0b",
    ];
    // get Products for display in ListProduct
    if (!key) {
      localStorage.setItem("currentCategory", "");
      //setFilter([]);
      setSelectCategory("");
      setOpenKeys([""]);
      getProductsFromCategory(allCategoriesID, selectSorting, filter)
        .then((res) => {
          setData(res.body.results);
        })
        .catch(console.error);
    } else {
      localStorage.setItem("currentCategory", selectCategory);
      getProductsFromCategory([selectCategory], selectSorting, filter)
        .then((res) => {
          console.log("res", res);
          setData(res.body.results);
        })
        .catch(console.error);
    }
    // get ProductType for display filter
    if (key === "berries" || key === "fruits" || key === "vegetables") {
      getProductType(key)
        .then((res) => {
          if (res.body.attributes) {
            getFilterAttribute(res.body.attributes);
          }
        })
        .catch(console.error);
    } else {
      setFiltersCategory([]);
    }
  }, [filter, key, selectCategory, selectSorting]);

  useEffect(() => {
    // get Categories for display SiderMenu
    getCategories()
      .then((res) => {
        const structureMenu = createStructureMenu(res.body.results);
        setCategories(structureMenu);
        structureMenu.forEach((item) => {
          if (item.key === selectCategory) {
            setOpenKeys([item.key]);
          } else {
            item.children.forEach((child) => {
              if (child?.key === selectCategory) {
                setOpenKeys([item.key]);
              }
            });
          }
        });
      })
      .catch(console.error);
  }, [selectCategory]);

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    console.log("keys", keys);
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

  const onFilters = (checkedValues: CheckboxValueType[]) => {
    if (checkedValues.length > 0) {
      setSelectFilters(checkedValues);
    } else {
      setSelectFilters([]);
    }
    console.log("checkedValues", checkedValues);
    let nameFilter = "";
    filtersCategory.forEach((item) => {
      item.value.forEach((value) => {
        if (value.value === checkedValues[0]) {
          nameFilter = item.keyField;
        }
      });
    });
    handlerFilter(nameFilter, checkedValues);
  };

  const handlerFilter = (
    nameFilter: string,
    checkedValues: CheckboxValueType[]
  ) => {
    console.log("nameFilter", nameFilter);
    checkedValues.length === 0
      ? setFilter([])
      : setFilter([{ name: nameFilter, value: checkedValues }]);

    //setFilter((prev) => {
    // prev = prev.length === 1 && prev[0].name === nameFilter ? [] : prev;
    // if (prev.length > 1) {
    //   const selectPrev: { name: string; value: CheckboxValueType[] }[] = [];
    //   prev.forEach((item) => {
    //     if (item.name !== nameFilter) {
    //       selectPrev.push(item);
    //     }
    //   });
    //   prev = [...selectPrev];
    // }
    // return checkedValues.length === 0
    //   ? prev
    //   : [...prev, { name: nameFilter, value: checkedValues }];
    //});
    // const selectFilter: CheckboxValueType[] = [];

    // setSelectFilters([]);
    // filter.forEach((item) => {
    //   console.log("filter", filter);
    //selectFilter.concat(item.value);
    // setSelectFilters((prev) => {
    //   return prev.concat(item.value);
    // })
    // });
    // console.log("filter2", filter);
  };

  const getFilterAttribute = (attributes: AttributeDefinition[]) => {
    let filters: Filter[] = [];
    attributes?.forEach((item) => {
      let valuesItem: CheckboxOptionType[] = [];
      if (item.type.name === "enum") {
        const values = item.type.values;
        values.forEach((value) => {
          valuesItem.push({ label: value.label, value: value.key });
        });
        filters.push({
          keyField: item.name,
          labelField: item.label.en,
          value: valuesItem,
        });
      }
    });
    setFiltersCategory(filters);
  };

  const Filters: React.FC = () => {
    return (
      <>
        {filtersCategory.map((item) => (
          <Space
            direction="vertical"
            size="middle"
            style={{ display: "flex", padding: "10px" }}
            key={item.keyField}
          >
            <span>{item.labelField}</span>
            <Checkbox.Group
              key={item.labelField}
              name={item.keyField}
              options={item.value}
              value={selectFilters}
              onChange={onFilters}
            />
          </Space>
        ))}
      </>
    );
  };

  const handleClickName: MenuProps["onClick"] = (e) => {
    setSelectSorting({ name: e.key, price: "" });
    getProductsFromCategory([selectCategory], selectSorting, filter)
      .then((res) => {
        setData(res.body.results);
      })
      .catch(console.error);
  };

  const handleClickPrice: MenuProps["onClick"] = (e) => {
    setSelectSorting({ name: "", price: e.key });
    getProductsFromCategory([selectCategory], selectSorting, filter)
      .then((res) => {
        setData(res.body.results);
      })
      .catch(console.error);
  };

  const Sorting: React.FC = () => {
    const items: MenuProps["items"] = [
      {
        key: "asc",
        label: "ASC",
      },
      {
        key: "desc",
        label: "DESC",
      },
    ];

    return (
      <div className="sorting__wrapper">
        Sort by:
        <Dropdown
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: [selectSorting.name],
            onClick: handleClickName,
          }}
        >
          <Button type="link">
            name
            <DownOutlined />
          </Button>
        </Dropdown>
        <Dropdown
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: [selectSorting.price],
            onClick: handleClickPrice,
          }}
        >
          <Button type="link">
            price
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    );
  };

  return (
    <Layout style={{ width: "100%" }} className="catalog__wrapper">
      {/* <SiderMenu /> */}
      <Sider width={200} style={{ background: "#fff" }}>
        <h2>Farmer Goods</h2>
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
        <Filters />
      </Sider>
      <Layout style={{ padding: "0 24px 24px", background: "#fff" }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: "#fff",
          }}
        >
          <Sorting />
          <ListProduct data={data} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CatalogPage;
