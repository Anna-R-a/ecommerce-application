import React, { MouseEventHandler, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  Dropdown,
  Layout,
  Menu,
  Space,
  Typography,
} from "antd";
import type { CheckboxOptionType, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { CheckboxValueType } from "antd/es/checkbox/Group";
// import SiderMenu from "../../components/sider-menu/SiderMenu";
import ListProduct from "../../components/list-product/ListProduct";
import {
  getCategories,
  getProductType,
  getProductsAttributes,
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

  useEffect(() => {
    if (!key) {
      localStorage.setItem("currentCategory", "");
      setSelectCategory("");
      setOpenKeys([""]);
      getProductsFromCategory([
        "241d5c5d-f8cc-45be-866f-14af2c0c150c",
        "fcf30caa-46ad-4ac8-b859-3fc0395b791c",
        "1836bc07-4722-42e4-a8cf-5ad943e8da0b",
      ])
        .then((res) => {
          setData(res.body.results);
        })
        .catch(console.error);
    } else {
      localStorage.setItem("currentCategory", selectCategory);
      getProductsFromCategory([selectCategory])
        .then((res) => {
          console.log("res", res);
          setData(res.body.results);
        })
        .catch(console.error);
    }
  }, [key, selectCategory]);

  useEffect(() => {
    if (filter.length > 0) {
      getProductsAttributes(filter)
        .then((res) => {
          console.log("res", res.body.results);
          setData(res.body.results);
        })
        .catch(console.error);
    } else if (key) {
      getProductsFromCategory([selectCategory])
        .then((res) => {
          setData(res.body.results);
        })
        .catch(console.error);
    }
  }, [filter, key, selectCategory]);

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

  useEffect(() => {
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

  // const [selectGroupFilters, setSelectGroupFilters] = useState<
  //   { name: string; value: CheckboxValueType[] }[]
  // >([]);

  const onChange = (checkedValues: CheckboxValueType[]) => {
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
    // setSelectGroupFilters((prev) => {
    //   console.log("checkedValues", checkedValues);
    //   let prevData = false;
    //   prev.map((prevItem) => {
    //     if (prevItem.name === nameFilter) {
    //       prevItem.value = checkedValues;
    //       prevData = true;
    //     }
    //     console.log("prev setSelectGroupFilters", prev);

    //     return prev;
    //   });
    //   console.log("prevData", prevData);
    //   console.log("return", prevData ? prev : [...prev, { name: nameFilter, value: checkedValues }]);
    //   return prevData ? prev : [...prev, { name: nameFilter, value: checkedValues }];
    // });
    // //setSelectFilters([]);
    // selectGroupFilters.forEach((item) => {

    //   setSelectFilters((prev) => {
    //     return prev.concat(item.value);
    //   });
    // });

    handlerFilter(nameFilter, checkedValues);
  };

  // const onChangeSize = (checkedValues: CheckboxValueType[]) => {
  //   const nameFilter = "berries-size";
  //   handlerFilter(nameFilter, checkedValues);
  // };

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

  useEffect(() => {
    if (
      key &&
      (key === "berries" || key === "fruits" || key === "vegetables")
    ) {
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
  }, [key]);

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
              onChange={onChange}
            />
          </Space>
        ))}
      </>
    );
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Item 1",
    },
    {
      key: "2",
      label: "Item 2",
    },
    {
      key: "3",
      label: "Item 3",
    },
  ];

  // const sortPrice = (event: MouseEventHandler<HTMLElement>): void => {
  //   console.log("event", event);
  // }
  // function sortPrice(event: MouseEvent<Element, NativeMouseEvent>): void {
  //   throw new Error("Function not implemented.");
  // }

  const Sorting: React.FC = () => (
    <>
      {/* <Button type="link" onClick={sortPrice}>
        by Price
        <DownOutlined />
      </Button> */}
      <Dropdown
        menu={{
          items,
          selectable: true,
          defaultSelectedKeys: ["3"],
        }}
      >
        <Typography.Link>
          <Space style={{ padding: "10px" }}>
            by Price
            <DownOutlined />
          </Space>
        </Typography.Link>
      </Dropdown>
    </>
  );

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
        {/* <Breadcrumbs /> */}
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
