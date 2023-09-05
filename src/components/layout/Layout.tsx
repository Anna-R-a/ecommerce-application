import { Outlet } from "react-router-dom";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import "./Layout.css";

export const PageLayout = () => {
  return (
    <>
      <Header />
      <main className="main">
        <div className="wrapper">
          <Breadcrumbs />
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};
