import React from "react";
import { Avatar, List, Space } from "antd";
import {
  EnvironmentOutlined,
  CrownOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import "./About.css";

const data = [
  {
    href: "https://github.com/Anna-R-a",
    title: "Hanna Ratnikava",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
    country: "Homiel",
    role: "Team leader",
    code: "122 lines of code",
    photo:
      "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
  },
  {
    href: "https://github.com/AciaKr",
    title: "Nastassia Krasutskaya",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
    country: "Minsk",
    role: "Coder",
    code: "122 lines of code",
    photo:
      "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
  },
  {
    href: "https://github.com/SergeyVolkov03",
    title: "Sergey Volkov",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
    country: "Minsk",
    role: "Coder",
    code: "122 lines of code",
    photo:
      "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
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
      <h1>About AA-Team`s</h1>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={data}
        // footer={
        //   <div>
        //     <b>ant design</b> footer part
        //   </div>
        // }
        renderItem={(item) => (
          <List.Item
            key={item.title}
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
            ]}
            extra={
              <img
                width={200}
                className="photo__member"
                alt={item.title}
                src={item.photo}
              />
            }
          >
            <List.Item.Meta
              className="card-member"
              //avatar={<Avatar src={item.avatar} />}
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
      <div className="rsschool">
        <a href="https://rs.school/" className="rsschool__link">
          {" "}
        </a>
      </div>
    </div>
  );
};

export default AboutPage;
