import React from "react";
import { Breadcrumb, Layout } from "antd";
import SiderMenu from "../../components/sider-menu/SiderMenu";
import ListProduct from "../../components/list-product/ListProduct";
import "./Catalog.css";

const { Content } = Layout;

const CatalogPage: React.FC = () => {
  return (
    <Layout style={{ width: "100%" }} className="catalog__wrapper">
      <SiderMenu />
      <Layout style={{ padding: "0 24px 24px", background: "#fff" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Catalog</Breadcrumb.Item>
          <Breadcrumb.Item>Subnav 1</Breadcrumb.Item>
        </Breadcrumb>
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
