import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Checkbox, Layout, Menu, Space } from "antd";
import type { CheckboxOptionType, MenuProps } from "antd";
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
  AttributePlainEnumValue,
  Category,
  ProductProjection,
} from "@commercetools/platform-sdk";
import "./Catalog.css";
import { CheckboxValueType } from "antd/es/checkbox/Group";

const { Sider, Content } = Layout;

type Props = { default: boolean };

const CatalogPage: React.FC<Props> = (props: Props) => {
  const attributesCategories = [
    { categoryID: "241d5c5d-f8cc-45be-866f-14af2c0c150c", key: "fruits" },
    { categoryID: "fcf30caa-46ad-4ac8-b859-3fc0395b791c", key: "vegetables" },
    { categoryID: "1836bc07-4722-42e4-a8cf-5ad943e8da0b", key: "berries" },
  ];

  const currentCategoryLS = localStorage.getItem("currentCategory");
  const currentCategory = currentCategoryLS ? currentCategoryLS : "";

  const [categories, setCategories] = useState<MenuProps["items"]>([]);
  const [selectCategory, setSelectCategory] = useState(currentCategory);
  const [openKeys, setOpenKeys] = useState<string[]>([currentCategory]);
  const [data, setData] = useState<ProductProjection[]>([]);

  const [filter, setFilter] = useState<
    { name: string; value: CheckboxValueType[] }[]
  >([]);

  const getCategoryOptions = (currentCategoryID: string) => {
    console.log("currentCategoryID", currentCategoryID);
    let categoryOptions: { categoryID: string; key: string } = {
      categoryID: currentCategoryID,
      key: "",
    };
    attributesCategories.forEach((item) => {
      if (item.categoryID === currentCategoryID) {
        categoryOptions.key = item.key;
      }
    });
    console.log("categoryOptions", categoryOptions);
    return categoryOptions;
  };

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
        console.log("res", res);
        setData(res.body.results);
      })
      .catch(console.error);
  }, [selectCategory]);

  useEffect(() => {
    if (filter.length > 0) {
      getProductsAttributes(filter)
        .then((res) => {
          console.log("res", res.body.results);
          setData(res.body.results);
        })
        .catch(console.error);
    } else {
      getProductsFromCategory(selectCategory)
        .then((res) => {
          setData(res.body.results);
        })
        .catch(console.error);
    }
  }, [filter, selectCategory]);

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
    //setSelectCategory(currentCategory);
    //setOpenKeys([currentCategory]);
    getCategories()
      .then((res) => {
        setCategories(createStructureMenu(res.body.results));
      })
      .catch(console.error);
  }, []);

  const [selectGroupFilters, setSelectGroupFilters] = useState<
    { name: string; value: CheckboxValueType[] }[]
  >([]);

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
    checkedValues: CheckboxValueType[],
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
    const selectFilter: CheckboxValueType[] = [];

    // setSelectFilters([]);
    filter.forEach((item) => {
      console.log("filter", filter);
      //selectFilter.concat(item.value);
      // setSelectFilters((prev) => {
      //   return prev.concat(item.value);
      // })
    });
    console.log("filter2", filter);
  };

  type Filter = {
    keyField: string;
    labelField: string;
    value: CheckboxOptionType[];
  };

  const [filtersCategory, setFiltersCategory] = useState<Filter[]>([]);
  const [selectFilters, setSelectFilters] = useState<CheckboxValueType[]>([]);
  const [cat, setCat] = useState("");

  //const optionsColor = ["black", "blue", "red", "yellow"];

  //const optionsSize = ["small", "medium", "large"];

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
    setSelectCategory(currentCategory);
    let keyCurrentCategory = getCategoryOptions(currentCategory).key;
    getProductType(keyCurrentCategory)
      .then((res) => {
        if (res.body.attributes) {
          getFilterAttribute(res.body.attributes);
        }
      })
      .catch(console.error);
  }, [currentCategory]);

  const Filters: React.FC = () => {
    return (
      <>
        {filtersCategory.map((item) => (
          <Space
            direction="vertical"
            size="middle"
            style={{ display: "flex", padding: "10px" }}
          >
            <span>{item.labelField}</span>
            <Checkbox.Group
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
          <ListProduct data={data} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CatalogPage;
