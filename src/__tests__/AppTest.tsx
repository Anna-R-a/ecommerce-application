import React from "react";
import { screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { Context } from "../components/context/Context";
import ProductPage from "../pages/product/Product";

describe("Test", () => {
  test("should render header", async () => {
    <Context.Provider value={[]}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </Context.Provider>;
    expect(screen.queryByTestId("header")).not.toBeInTheDocument();
  });

  test("should render footer", () => {
    <Context.Provider value={[]}>
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    </Context.Provider>;
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
  });
  test("should render product page", () => {
    <Context.Provider value={[]}>
      <BrowserRouter>
        <ProductPage />
      </BrowserRouter>
    </Context.Provider>;
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
  });
});
