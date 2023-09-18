import React from "react";
import {  screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { Context } from "../components/context/Context";
import App from "../App";
import userEvent from "@testing-library/user-event";

import AboutPage from "../pages/about/About";
// const renderWithRouter = (ui: JSX.Element, { route = "/" } = {}) => {
//   window.history.pushState({}, "Test page", route);

//   return {
//     ...render(ui, { wrapper: BrowserRouter }),
//   };
// };

// test("should render header", () => {
//   renderWithRouter(<Header />);
//   expect(screen.getByTestId("header")).toBeInTheDocument();
// });

// const renderWithRouterMini = (ui: JSX.Element, { route = "/" } = {}) => {
//   window.history.pushState({}, "Test page", route);
//   window.innerWidth = 599;

//   return {
//     ...render(ui, { wrapper: BrowserRouter }),
//   };
// };

test("should render header", () => {
  <Context.Provider value={[]}>
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  </Context.Provider>;
  expect(screen.getByTestId("header")).toBeInTheDocument();

  // const catalogLink = screen.getByTestId('catalog-link')
  // const aboutLink = screen.getByTestId('about-link')
  // userEvent.click(aboutLink)
  // expect(screen.getByTestId('about-page')).toBeInTheDocument();
  // userEvent.click(catalogLink)
  // expect(screen.getByTestId('login-page')).toBeInTheDocument();
});

test("should render footer", () => {
  <Context.Provider value={[]}>
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  </Context.Provider>;
  expect(screen.queryByText("Error")).not.toBeInTheDocument();
  // expect(screen.getByText("© Copyright 2023 AA-Team`s")).toBeInTheDocument();
});
test("should render about", () => {
  <Context.Provider value={[]}>
    <BrowserRouter>
      <AboutPage />
    </BrowserRouter>
  </Context.Provider>;
  expect(screen.getByText("Error")).toBeInTheDocument();
  // expect(screen.getByText("© Copyright 2023 AA-Team`s")).toBeInTheDocument();
});

// test("should render logo", () => {
//   <Context.Provider value={[]}>
//     <BrowserRouter>
//       <Logo />
//     </BrowserRouter>
//   </Context.Provider>
//   const link = screen.getByTestId('logo-link');
//   expect(link).toBeVisible();
// expect(screen.getByText("© Copyright 2023 AA-Team`s")).toBeInTheDocument();
// });

test("should redirect to home page", async () => {
  <Context.Provider value={[]}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Context.Provider>;
  await waitFor(() => {
    expect(screen.getByText("Only FRESH Farmer Goods")).toBeInTheDocument();
  });
  userEvent.click(await screen.findByText(/Home/));
});

// test('landing on a bad page', () => {
//   renderWithRouter(<App />, {route: '/something-wrong'})

//   expect(screen.getByText(/The page you are looking for/i)).toBeInTheDocument()
// })

// test('Router test', () => {
//   render(
//     <Context.Provider value={[]}>
//     <BrowserRouter>
//       <PageLayout />
//     </BrowserRouter>
//   </Context.Provider>
//   );
//   const loginLink = screen.getByTestId('home-link')
//   const aboutLink = screen.getByTestId('about-link')
//   userEvent.click(aboutLink)
//   expect(screen.getByTestId('about-page')).toBeInTheDocument();
//   userEvent.click(loginLink)
//   expect(screen.getByTestId('login-page')).toBeInTheDocument();
// });
