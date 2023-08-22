import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";

const renderWithRouter = (ui: JSX.Element, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);

  return {
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

test("should render header", () => {
  renderWithRouter(<Header />);
  expect(screen.getByTestId("header")).toBeInTheDocument();
});

const renderWithRouterMini = (ui: JSX.Element, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  window.innerWidth = 599;

  return {
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

test("should render header mini", () => {
  renderWithRouterMini(<Header />);

  expect(screen.getByTestId("header-mini")).toBeInTheDocument();
  const link = screen.getByRole("link", { name: /fresh/i });
  expect(link).toBeVisible();
});

test("should render footer", () => {
  renderWithRouter(<Footer />);
  screen.getByText("© Copyright 2023 AA-Team");
});

//   test('should redirect to home page', async () => {
//     renderWithRouter(<App/>);
//     await waitFor(() => {
//       expect(screen.getByText('Only FRESH Farmer Goods')).toBeInTheDocument();
//     });
//     // userEvent.click(await screen.findByText(/Home/));

// });

// test('landing on a bad page', () => {
//   renderWithRouter(<App />, {route: '/something-wrong'})

//   expect(screen.getByText(/The page you are looking for/i)).toBeInTheDocument()
// })
