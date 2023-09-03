import { Outlet } from "react-router-dom";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import "./Layout.css";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";

export const PageLayout = () => {
  return (
    <>
      <Header />
      <Breadcrumbs />
      <main className="main">
        <div className="wrapper">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};
