import type { CascaderProps } from "antd";

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}

const residences: CascaderProps<DataNodeType>["options"] = [
  {
    value: "poland",
    label: "Poland",
  },
  {
    value: "lithuania",
    label: "Lithuania",
  },
  {
    value: "france",
    label: "France",
  },
  {
    value: "germany",
    label: "Germany",
  },
  {
    value: "spain",
    label: "Spain",
  },
];

const postCodesRegEx: Record<string, RegExp> = {
  poland: new RegExp(/^\d{2}[- ]{0,1}\d{3}$/),
  lithuania: new RegExp(/^[Ll][Tt][- ]{0,1}\d{5}$/),
  france: new RegExp(/^\d{5}$/),
  germany: new RegExp(/^\d{5}$/),
  spain: new RegExp(/^\d{5}$/),
};

const formItemLayout = {
  labelCol: {
    xs: { span: 20 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 4,
    },
  },
};

export {
  tailFormItemLayout,
  formItemLayout,
  postCodesRegEx,
  residences,
};
