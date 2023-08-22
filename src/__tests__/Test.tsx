import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Registration from "../pages/registration/Registration";

describe("Test", () => {
  test("should render login page", () => {
    render(
      <BrowserRouter>
        <Registration />
      </BrowserRouter>,
    );
    expect(screen.getByText("Registration")).toBeInTheDocument();
    const buttonReg = screen.getByRole("button", { name: /Register/i });
    expect(buttonReg).toBeVisible();
  });
});
