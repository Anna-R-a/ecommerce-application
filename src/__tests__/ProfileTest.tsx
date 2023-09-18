import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Context } from "../components/context/Context";
import ProfilePage from "../pages/profile/Profile";
import { ProfileAddressesTable } from "../components/profile-addresses/ProfileAddressesTable";
import { ProfilePasswordForm } from "../components/profile-password/ProfilePasswordForm";
import { ProfileGeneralForm } from "../components/profile-general/ProfileGeneralForm";


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
    const menuTab = screen.getByRole("tab", { name: /General/i });
    expect(menuTab).toBeInTheDocument();
  });

  test("should render profile address", async () => {
    render(
      <Context.Provider value={[]}>
        <BrowserRouter>
          <ProfileAddressesTable />
        </BrowserRouter>
      </Context.Provider>,
    );

    await screen.findByRole("button", { name: /add new address/i })
    const btnAdd = screen.getByRole("button", { name: /add new address/i });
    expect(btnAdd).toBeVisible();
    expect(btnAdd).toBeInTheDocument();
   
    
    const street = screen.getByText( /street/i );
    expect(street).toBeVisible();
    expect(street).toBeInTheDocument();
  });


  test("should render profile password", () => {
    render(
      <Context.Provider value={[]}>
        <BrowserRouter>
          <ProfilePasswordForm />
        </BrowserRouter>
      </Context.Provider>,
    );
    expect(screen.getByText("Save new password")).toBeInTheDocument();
    const buttonSave = screen.getByRole("button", { name: /Save new password/i });
    expect(buttonSave).toBeVisible();
    expect(buttonSave).toBeDisabled();
    const label = screen.getByLabelText( /Confirm Password/i );
    expect(label).toBeInTheDocument();
  });

  test("should render profile general info", () => {
    render(
      <Context.Provider value={[]}>
        <BrowserRouter>
          <ProfileGeneralForm />
        </BrowserRouter>
      </Context.Provider>,
    );

    const label = screen.getByLabelText( /First Name/i );
    expect(label).toBeInTheDocument();

  });

});
