import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { ProfileGeneralForm } from "../profile-general/ProfileGeneralForm";

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "general",
    label: "General",
    children: <ProfileGeneralForm />,
  },
  {
    key: "password",
    label: "Password",
    children: "Content of Tab Pane 2",
  },
  {
    key: "addresses",
    label: "Addresses",
    children: "Content of Tab Pane 3",
  },
];

const ProfileTabs: React.FC = () => (
  <Tabs defaultActiveKey="general" items={items} onChange={onChange} />
);

export default ProfileTabs;
