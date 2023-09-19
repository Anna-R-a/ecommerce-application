import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Context } from "../components/context/Context";
import LoginPage from "../pages/login/Login";

describe("Test", () => {
  test("should render login page", () => {
    render(
      <Context.Provider value={[]}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Context.Provider>,
    );
    expect(screen.getByText("Log in")).toBeInTheDocument();
    const buttonLog = screen.getByRole("button", { name: /Log in/i });
    expect(buttonLog).toBeVisible();
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    // act(()=> fireEvent.click(buttonLog))
  });
});
