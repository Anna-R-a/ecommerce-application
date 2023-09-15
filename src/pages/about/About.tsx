import React from "react";
import { Avatar, Card, List, Space } from "antd";
import {
  EnvironmentOutlined,
  CrownOutlined,
  CodeOutlined,
  GithubOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import "./About.css";
import { Link } from "react-router-dom";
import Meta from "antd/es/card/Meta";

const data = [
  {
    key: "anna",
    href: "https://github.com/Anna-R-a",
    title: "Hanna Ratnikava",
    avatar: "https://github.com/Anna-R-a",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently. We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
    country: "Homiel",
    role: "Team leader",
    code: "122 lines of code",
    task: "Repository Setup, Project Description, Login Integration, Product Page, Unit Tests",
    photo:
      "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
  },
  {
    key: "nastya",
    href: "https://github.com/AciaKr",
    title: "Nastassia Krasutskaya",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently. We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
    country: "Minsk",
    role: "Coder",
    code: "122 lines of code",
    task: "Task Board, API Client Setup, Layout, Routing, Login, Catalog and About Page",
    photo:
      "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
  },
  {
    key: "sergey",
    href: "https://github.com/SergeyVolkov03",
    title: "Sergey Volkov",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently. We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
    country: "Minsk",
    role: "Coder",
    code: "122 lines of code",
    task: "Development environment configuration, Registration, Profile and Basket Page",
    photo:
      "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
  },
];

const gratitude = [
  {
    href: "https://github.com/romababok",
    title: "Roman Babok",
    avatar: "https://xsgames.co/randomusers/assets/avatars/pixel/6.jpg",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
  },
  {
    href: "https://github.com/SergeyVolkov03",
    title: "Stanislav Lukyanenko",
    avatar: "https://xsgames.co/randomusers/assets/avatars/pixel/7.jpg",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
  },
];

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const AboutPage: React.FC = () => {
  return (
    <div className="container">
      <h1>About Us</h1>
      <div className="text">
        We supply a series of design principles, practical patterns and high
        quality design resources (Sketch and Axure), to help people create their
        product prototypes beautifully and efficiently. We supply a series of
        design principles, practical patterns and high quality design resources
        (Sketch and Axure), to help people create their product prototypes
        beautifully and efficiently.
      </div>
      <h2>AA-Team`s Members</h2>
      <List
        itemLayout="vertical"
        className="card-member"
        size="large"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            key={item.key}
            className="card-member"
            actions={[
              <IconText
                icon={EnvironmentOutlined}
                text={item.country}
                key="list-vertical-environment"
              />,
              <IconText
                icon={CrownOutlined}
                text={item.role}
                key="list-vertical-crown"
              />,
              <IconText
                icon={CodeOutlined}
                text={item.code}
                key="list-vertical-code"
              />,
              <IconText
                icon={ScheduleOutlined}
                text={item.task}
                key="list-vertical-schedule"
              />,
            ]}
            extra={
              <img
                width={200}
                className="card-member__photo"
                alt={item.title}
                src={item.photo}
              />
            }
          >
            <List.Item.Meta
              className="card-member__meta"
              avatar={<GithubOutlined style={{ color: "#3c7375" }} />}
              title={
                <a className="card-member__title" href={item.href}>
                  {item.title}
                </a>
              }
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
      <h2>Our Collaboration</h2>
      <div className="text">
        We supply a series of design principles, practical patterns and high
        quality design resources (Sketch and Axure), to help people create their
        product prototypes beautifully and efficiently. We supply a series of
        design principles, practical patterns and high quality design resources
        (Sketch and Axure), to help people create their product prototypes
        beautifully and efficiently.
      </div>
      <h2>Gratitude</h2>
      <div className="text">
        We supply a series of design principles, practical patterns and high
        quality design resources (Sketch and Axure), to help people create their
        product prototypes beautifully and efficiently. We supply a series of
        design principles, practical patterns and high quality design resources
        (Sketch and Axure), to help people create their product prototypes
        beautifully and efficiently.
      </div>

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        dataSource={gratitude}
        className="gratitude__list"
        renderItem={(item) => (
          <List.Item className="product__item">
            <Card className="card__item">
              <Link to={item.href} className="product__link">
                <Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={item.title}
                  description={item.description}
                />
              </Link>
            </Card>
          </List.Item>
        )}
      />
      <div className="rsschool">
        <a href="https://rs.school/" className="rsschool__link">
          {" "}
        </a>
      </div>
    </div>
  );
};

export default AboutPage;
