import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { ProfileGeneralForm } from "../profile-general/ProfileGeneralForm";
import { ProfilePasswordForm } from "../profile-password/ProfilePasswordForm";


const items: TabsProps["items"] = [
  {
    key: "general",
    label: "General",
    children: <ProfileGeneralForm />,
  },
  {
    key: "password",
    label: "Password",
    children: <ProfilePasswordForm />,
  },
  {
    key: "addresses",
    label: "Addresses",
    children: "Content of Tab Pane 3",
  },
];

const ProfileTabs: React.FC = () => (
  <Tabs defaultActiveKey="general" items={items} />
);

export default ProfileTabs;
