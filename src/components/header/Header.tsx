import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Nav, NavDrawer, UserBar } from "../navBar/NavBar";
import "./Header.css";

export const Logo: React.FC = () => {
  return (
    <div className="logo" data-testid="logo-link">
      <Link to="/" className="logo__link">
        <span className="logo__icon"></span>
        FRESH
      </Link>
    </div>
  );
};

const useResize = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = (event: Event) => {
      if (event.target instanceof Window) {
        setWidth(event.target.innerWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
};

export const Header = () => {
  const width = useResize();
  if (width < 600) {
    return (
      <header className="header" data-testid="header-mini">
        <div className="wrapper">
          <Logo />
          <NavDrawer />
        </div>
      </header>
    );
  }
  return (
    <header className="header">
      <div className="wrapper" data-testid="header">
        <Logo />
        <Nav />
        <UserBar />
      </div>
    </header>
  );
};
