import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Registration from "../pages/registration/Registration";
import { Context } from "../components/context/Context";

describe("Test", () => {
  test("should render registration page", () => {
    render(
      <Context.Provider value={[]}>
        <BrowserRouter>
          <Registration />
        </BrowserRouter>
      </Context.Provider>,
    );
    expect(screen.getByText("Registration")).toBeInTheDocument();
    const buttonReg = screen.getByRole("button", { name: /Register/i });
    expect(buttonReg).toBeVisible();
  });
});
