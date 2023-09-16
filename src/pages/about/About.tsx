import React from "react";
import { Avatar, Badge, Card, Divider, List, Space, Tag } from "antd";
import {
  EnvironmentOutlined,
  CrownOutlined,
  CodeOutlined,
  GithubOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Meta from "antd/es/card/Meta";
import photoNastya from "./../../assets/nastya.jpg";
import photoAnna from "./../../assets/anna.jpg";
import "./About.css";

const data = [
  {
    key: "anna",
    href: "https://github.com/Anna-R-a",
    title: "Hanna Ratnikava",
    description:
      "Believe in yourself and everything will work out!",
    content:
      "I'm a lecturer at the Belarusian State University of Transport. My way into programming started in November 2022 with Stage 0 in RS School. At the beginning I hadn't any knowledge in JavaScript, CSS or HTML. Sometimes it was hard, and other times it was very hard, but it was always interesting to get new knowledge and to learn frontend step by step. I realize, the knowledge I've got during this time is just the tip of the frontend iceberg.",
    country: "Homiel",
    role: "Team leader",
    code: "13 Pull Requests",
    task: "Repository Setup, Project Description, Login Integration, Product Page, Unit Tests",
    photo: photoAnna,
  },
  {
    key: "nastya",
    href: "https://github.com/AciaKr",
    title: "Nastassia Krasutskaya",
    description: "The eyes are scared, but the hands are doing",
    content:
      "In the late 2000s I have finished Belarusian National Technical University in WEB-design, Computer Science. I used to create small business websites on freelance, using some ancient technologies for this moment)). At one point I left programming, I started promoting sites on the Internet, what I did until recently. Over time I began to realize that digging into the code of the site is much more interesting to me than promoting it. I had a desire to go back to front-end. But during this time, web development has come a long way: need new knowledge, and in large quantities. One day in messenger I came across a mention of an RSS school, which was a big boost for a career in front-end. Thus began my studies at the RSSchool...",
    country: "Minsk",
    role: "Crazy Coder",
    code: "16 Pull Requests",
    task: "Task Board, API Client Setup, Layout, Routing, Login, Catalog and About Page",
    photo: photoNastya,
  },
  {
    key: "sergey",
    href: "https://github.com/SergeyVolkov03",
    title: "Sergey Volkov",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently. We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
    country: "Minsk",
    role: "Coder",
    code: "11 Pull Requests",
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
    description: "JS, TypeScript, React",
  },
  {
    href: "https://github.com/jjshko10",
    title: "Stanislav Lukyanenko",
    avatar: "https://xsgames.co/randomusers/assets/avatars/pixel/8.jpg",
    description: "JS, TypeScript, React",
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
      <h2>Our Project</h2>
      <div className="text">
        The online store of farm products gives an opportunity to register a new
        user, choose healthy GMO-free products from farmers and put them in the
        shopping cart. Since a healthy lifestyle is now an integral part of
        modern people, farm products are in great demand.
      </div>
      <Divider>
        <h2>Technology Stack</h2>
      </Divider>
      <div className="text">
        <Space direction="horizontal" size="large" style={{ flexWrap: "wrap", justifyContent: "center" }}>
          <Badge.Ribbon text="Front-end" color="#92bfc1">
            <Card title=" " size="small" className="card__stack">
            <Tag>HTML5</Tag>
            <Tag>CSS 3</Tag>
            <Tag>TypeScript</Tag>
            <Tag>React 18.2</Tag>
            </Card>
          </Badge.Ribbon>
          <Badge.Ribbon text="Libraries" color="#5f9ea0">
            <Card title=" " size="small" className="card__stack">
            <Tag>Ant Design</Tag>
            <Tag>Moment</Tag>
            <Tag>Jest</Tag>
            </Card>
          </Badge.Ribbon>
          <Badge.Ribbon text="Back-end" color="#3c7375">
            <Card title=" " size="small" className="card__stack">
            <Tag>commercetools.com</Tag>
            </Card>
          </Badge.Ribbon>
        </Space>
      </div>
      <Divider>
        <h2>AA-Team`s Members</h2>
      </Divider>
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
      <Divider>
        <h2>Our Collaboration</h2>
      </Divider>
      <div className="text">
        Until the last moment, our team was sure that we would write the final
        project in Typescript, without using frameworks, because no one knew
        them. But on the mentor's advice, just before the project was started we
        had decided that we would write using React. So, apart from WHAT to do,
        we had the added the new problem of HOW to do it. We are very lucky that
        all members of our team are calm and balanced people, so there were no
        conflicts about who would do what. While solving our tasks, each of us
        learned something new and shared this knowledge with others. Firstly, it
        helped to be aware of how the code works in a particular task (for more
        effective code-review), and secondly, to use it in solving your own
        tasks. When difficulties arose (non-working code or lack of time to
        complete the task), we gathered and solved these problems as a good
        team. Sometimes it took a few minutes and other times it took a few
        days. Each member of our team is ready to support, advise and help
        others, and this is very important for achieving the goal and successful
        implementation of the project.
      </div>
      <Divider>
        <h2>Gratitude</h2>
      </Divider>
      <div className="text">
        Thanks to the RSSchool team for this survival course called "JS /
        FRONT-END". It's really useful in terms of acquiring both theoretical
        and practical skills. We improved not only hard, but also soft skills.
        We learnt to work in a team and solve problems together. We express our
        gratitude to our mentors, who guided us on the path of victory and
        helped us with their advice in difficult moments.
      </div>
      <div className="rsschool">
        <a href="https://rs.school/" className="rsschool__link">
          {" "}
        </a>
      </div>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        dataSource={gratitude}
        className="product__item gratitude__list"
        renderItem={(item) => (
          <List.Item>
            <Card className="card__item gratitude">
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
    </div>
  );
};

export default AboutPage;
