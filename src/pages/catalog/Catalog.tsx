import React, { useEffect, useState } from "react";
import { Button, Card, List } from "antd";
import { Product } from "@commercetools/platform-sdk";
import { getProducts } from "../../api/api";
import "./Catalog.css";

const { Meta } = Card;

const CatalogPage: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    getProducts()
      .then((res) => {
        console.log(res.body.results);
        setData(res.body.results);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        pagination={{ position: "bottom", align: "center" }}
        dataSource={data}
        // itemLayout={"vertical"}
        renderItem={(item, index) => (
          <List.Item>
            <Card
              // style={{ width: 200,  height: 280 }}
              cover={
                <img
                  alt={item.masterData.current.name["en"]}
                  src={`${
                    item.masterData.staged.masterVariant.images
                      ? item.masterData.staged.masterVariant.images[0].url
                      : ""
                  }`}
                  width={200}
                  height={200}
                />
              }
              actions={[
                // <SettingOutlined key="setting" />,
                // <EditOutlined key="edit" />,
                <Button
                  type="primary"
                  key="shoppingCart"
                  title="In cart"
                  size="middle"
                />,
              ]}
            >
              <Meta
                title={
                  item.masterData.staged.masterVariant.prices
                    ? `${
                        item.masterData.staged.masterVariant.prices[0].value
                          .centAmount / 100
                      }$`
                    : "0$"
                }
                description={item.masterData.current.name["en"]}
              />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};

export default CatalogPage;