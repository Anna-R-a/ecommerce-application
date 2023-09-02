import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps['items'] = [
  {
    key: 'general',
    label: 'General',
    children: 'Content of Tab Pane 1',
  },
  {
    key: 'password',
    label: 'Password',
    children: 'Content of Tab Pane 2',
  },
  {
    key: 'addresses',
    label: 'Addresses',
    children: 'Content of Tab Pane 3',
  },
];

const ProfileTabs: React.FC = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;

export default ProfileTabs;