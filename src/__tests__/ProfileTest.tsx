import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Context } from "../components/context/Context";
import ProfilePage from "../pages/profile/Profile";

describe("Test", () => {
  test("should render profile page", () => {
    render(
      <Context.Provider value={[]}>
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      </Context.Provider>,
    );
    expect(screen.getByText("Save changes")).toBeInTheDocument();
    const buttonSave = screen.getByRole("button", { name: /Save changes/i });
    expect(buttonSave).toBeVisible();
    expect(buttonSave).toBeDisabled();
  });
});
