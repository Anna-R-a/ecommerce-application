import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { ProfileGeneralForm } from "../profile-general/ProfileGeneralForm";
import { ProfilePasswordForm } from "../profile-password/ProfilePasswordForm";
import { ProfileAddressesTable } from "../profile-addresses/ProfileAddressesTable";

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
    children: <ProfileAddressesTable />,
  },
];

const ProfileTabs = () => {
  return <Tabs defaultActiveKey="general" items={items} />;
};

export default ProfileTabs;
