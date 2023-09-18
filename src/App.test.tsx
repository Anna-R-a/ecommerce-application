import React from "react";
import { render, screen } from "@testing-library/react";
// import LoginPage from "./pages/login/Login";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/header/Header";
import { Context } from "./components/context/Context";


const renderWithRouter = (ui: JSX.Element, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);

  return {
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

test("Renders header", async () => {
  
    renderWithRouter( <Context.Provider value={[]}><Header /></Context.Provider>);
  
  await screen.findByTestId("header")
  expect(screen.getByTestId("header")).toBeInTheDocument();
});

const renderWithRouterMini = (ui: JSX.Element, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  window.innerWidth = 599;

  return {
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

test("Renders header mini", () => {
  renderWithRouterMini(<Context.Provider value={[]}><Header /></Context.Provider>);
  expect(screen.getByTestId("header-mini")).toBeInTheDocument();
});

