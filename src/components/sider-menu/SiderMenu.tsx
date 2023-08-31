import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import { getCategories, getCategoriesStructure } from "../../api/api";
import "./SiderMenu.css";

const { Sider } = Layout;

const SiderMenu: React.FC = () => {
  const [categories, setCategories] = useState<MenuProps["items"]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  type MenuItem = Required<MenuProps>["items"][number];

  const rootSubmenuKeys: string[] = [];

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    console.log("keys", keys);
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    console.log("latestOpenKey", latestOpenKey);
    //setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
    }
    //else {
    //   setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    // }
  };

  useEffect(() => {
    getCategories()
      .then((res) => {
        console.log(res.body.results);
        const allCategories = res.body.results;
        let structureCategories: {
          title: string;
          key: string;
          label: string;
          children: MenuItem[];
        }[] = [];
        allCategories.forEach((item) => {
          if (!item.parent) {
            const menuItem = {
              title: item.slug.en,
              key: item.id,
              label: item.name.en,
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
              if (itemParent?.key === parentId && itemParent) {
                itemParent.children.push({ key: item.id, label: item.name.en });
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
    console.log("info", info.domEvent);
  };

  return (
    <Sider width={200} style={{ background: "#fff" }}>
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        // defaultSelectedKeys={["1"]}
        // defaultOpenKeys={["sub1"]}
        style={{ height: "100%", borderRight: 0 }}
        items={categories}
        onClick={onClickMenu}
      />
    </Sider>
  );
};

export default SiderMenu;
