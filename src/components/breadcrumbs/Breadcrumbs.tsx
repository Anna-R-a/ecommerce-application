import React from "react";

import { useLocation, Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import "./Breadcrumbs.css";

const Breadcrumbs = () => {
  const location = useLocation();
  const upFirst = (path: string) =>
    path.charAt(0).toUpperCase() + path.slice(1);

  const BreadcrumbElem = () => {
    const pathSnippets = location.pathname.split("/").filter((i) => i);

    const extraBreadcrumbItems = pathSnippets.map((item, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return {
        key: url,
        title: <Link to={url}>{upFirst(item)}</Link>,
      };
    });

    const breadcrumbItems = [
      {
        title: <Link to="/">Home</Link>,
        key: "home",
      },
    ].concat(extraBreadcrumbItems);

    return (
      <div className="breadcrumb-block">
        <Breadcrumb items={breadcrumbItems} />
      </div>
    );
  };
  if (location.pathname !== "/") {
    return <>{<BreadcrumbElem />}</>;
  } else return <></>;
};
export default Breadcrumbs;

