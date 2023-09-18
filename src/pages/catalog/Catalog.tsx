import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  Dropdown,
  Layout,
  Menu,
  Space,
  Input,
  Slider,
} from "antd";
import type { CheckboxOptionType, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import ListProduct from "../../components/list-product/ListProduct";
import {
  getCategories,
  getProductType,
  getProductsBySearch,
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
const { Search } = Input;

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

const categoriesArray = (await getCategories()).body.results;

const CatalogPage: React.FC = () => {
  const { keyCatalog } = useParams();

  const currentCategoryLS = localStorage.getItem("currentCategory");
  const currentCategory = currentCategoryLS ? currentCategoryLS : "";

  const [allCategories] = useState<Category[]>(categoriesArray);

  const [categories, setCategories] = useState<MenuProps["items"]>([]);
  const [selectCategory, setSelectCategory] = useState(currentCategory);
  const [openKeys, setOpenKeys] = useState<string[]>([currentCategory]);
  const [data, setData] = useState<ProductProjection[]>([]);

  const [totalFilter, setTotalFilter] = useState<
    { name: string; value: CheckboxValueType[] }[]
  >([]);

  const [filtersCategory, setFiltersCategory] = useState<Filter[]>([]);
  const [selectFilters, setSelectFilters] = useState<CheckboxValueType[]>([]);
  const [selectSorting, setSelectSorting] = useState({ name: "", price: "" });
  const [filtersPrice, setFiltersPrice] = useState<[number, number]>([0, 15]);

  const displayTitle = () => {
    let selectTitleCategory = "";
    allCategories.forEach((item) => {
      if (item.id === selectCategory) {
        selectTitleCategory = item.name.en;
      }
    });
    return selectTitleCategory ? selectTitleCategory : "Catalog";
  };
  const [titleCategory, setTitleCategory] = useState(displayTitle);

  // create Structure Menu by allCategories
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

  // create Structure Menu
  useEffect(() => {
    setCategories(createStructureMenu(allCategories));
  }, [allCategories]);

  // delete filters when category change
  useEffect(() => {
    setTotalFilter([]);
    setSelectFilters([]);
  }, [selectCategory]);

  // get Products for display in ListProduct
  useEffect(() => {
    // if catalog page
    if (!keyCatalog) {
      localStorage.setItem("currentCategory", "");
      setSelectCategory("");
      setTitleCategory("Catalog");
      setOpenKeys([""]);
      getProductsFromCategory([], selectSorting, totalFilter, filtersPrice)
        .then((res) => {
          setData(res.body.results);
        })
        .catch(console.error);
    } else {
      // if others pages
      localStorage.setItem("currentCategory", selectCategory);
      getProductsFromCategory(
        [selectCategory],
        selectSorting,
        totalFilter,
        filtersPrice
      )
        .then((res) => {
          setTitleCategory(displayTitle());
          setData(res.body.results);
        })
        .catch(console.error);
    }
  }, [totalFilter, keyCatalog, selectCategory, selectSorting, filtersPrice]);

  // get ProductType for display filter on parent categories only
  useEffect(() => {
    setTotalFilter([]);
    setSelectFilters([]);
    setFiltersPrice([0, 15]);
    if (
      keyCatalog === "berries" ||
      keyCatalog === "fruits" ||
      keyCatalog === "vegetables"
    ) {
      getProductType(keyCatalog)
        .then((res) => {
          if (res.body.attributes) {
            getFilterAttribute(res.body.attributes);
          }
        })
        .catch(console.error);
    } else {
      setFiltersCategory([]);
    }
    // set Select Category
    allCategories.forEach((item) => {
      if (item.key === keyCatalog) {
        setSelectCategory(item.id);
      }
    });
  }, [keyCatalog, allCategories]);

  // display SiderMenu with open select category
  useEffect(() => {
    const structureMenu = createStructureMenu(allCategories);
    structureMenu.forEach((item) => {
      if (item) {
        if (item.key === selectCategory) {
          setOpenKeys([item.key]);
        } else {
          item.children.forEach((child) => {
            if (child?.key === selectCategory) {
              setOpenKeys([item.key]);
            }
          });
        }
      }
    });
  }, [selectCategory, allCategories]);

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

  const onFilters = (checkedValues: CheckboxValueType[]) => {
    let nameFilter = "";
    filtersCategory.forEach((item) => {
      item.value.forEach((value) => {
        if (value.value === checkedValues[0]) {
          nameFilter = item.keyField;
        }
      });
    });
    //setValuesRanger([0, 15]);
    handlerFilter(nameFilter, checkedValues);
  };

  useEffect(() => {
    let selectFilter: CheckboxValueType[] = [];
    totalFilter.forEach((item) => {
      selectFilter.push(...item.value);
    });
    setSelectFilters(selectFilter);
  }, [totalFilter]);

  const handlerFilter = (
    nameFilter: string,
    checkedValues: CheckboxValueType[]
  ) => {
    checkedValues.length === 0
      ? setTotalFilter([])
      : setTotalFilter([{ name: nameFilter, value: checkedValues }]);
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
        {filtersCategory.map((item) => {
          return (
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex", padding: "10px" }}
              key={item.keyField}
              className="filter-group"
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
          );
        })}
      </>
    );
  };

  const handleClickName: MenuProps["onClick"] = (e) => {
    setSelectSorting({ name: e.key, price: "" });
    getProductsFromCategory(
      [selectCategory],
      selectSorting,
      totalFilter,
      filtersPrice
    )
      .then((res) => {
        setData(res.body.results);
      })
      .catch(console.error);
  };

  const handleClickPrice: MenuProps["onClick"] = (e) => {
    setSelectSorting({ name: "", price: e.key });
    getProductsFromCategory(
      [selectCategory],
      selectSorting,
      totalFilter,
      filtersPrice
    )
      .then((res) => {
        setData(res.body.results);
      })
      .catch(console.error);
  };

  const SortingAndSearch: React.FC = () => {
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
      <div className="sort-search__wrapper">
        <Space direction="vertical">
          <Search
            placeholder="input search text"
            allowClear
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </Space>
        <Space>
          <span>Sort by:</span>
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
        </Space>
      </div>
    );
  };

  const onSearch = (value: string) => {
    getProductsBySearch(value)
      .then((res) => {
        if (res) {
          setData(res.body.results);
        }
      })
      .catch(console.error);
  };

  const Ranger: React.FC = () => {
    const handleChange = (newValues: [number, number]) =>
      setFiltersPrice(newValues);
    const onAfterChange = (values: [number, number]) => {
      getProductsFromCategory(
        [selectCategory],
        selectSorting,
        totalFilter,
        values
      ).then((res) => {
        setData(res.body.results);
      });
    };

    return (
      <div className="slider-price">
        <p className="slider-price__title">Price</p>
        <Slider
          className="slider-range"
          range={{ draggableTrack: true }}
          defaultValue={[0, 15]}
          min={0}
          max={15}
          value={filtersPrice}
          onChange={handleChange}
          onAfterChange={onAfterChange}
        />
      </div>
    );
  };

  const onClearFilters = () => {
    setTotalFilter([]);
    setSelectFilters([]);
    setFiltersPrice([0, 15]);
  };

  return (
    <div>
      <h1>{titleCategory}</h1>
      <Layout className="catalog__wrapper">
        <Sider width={200} className="sider__wrapper">
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
          <Ranger />
          <Button
            type="primary"
            onClick={onClearFilters}
            className="button_primary"
          >
            Clear
          </Button>
        </Sider>
        <Layout style={{ background: "#fff" }}>
          <Content
            style={{
              margin: 0,
              minHeight: 280,
              background: "#fff",
            }}
          >
            <SortingAndSearch />
            <ListProduct data={data} />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default CatalogPage;
