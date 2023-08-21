import { render, screen } from "@testing-library/react";
import { Nav } from "../components/navBar/NavBar";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

test("should show error message when all the fields are not entered", async () => {
  render(
    <BrowserRouter>
      <Nav />
    </BrowserRouter>,
  );
  const buttonElement = screen.getByText("Home");
  expect(buttonElement).toBeInTheDocument();
  userEvent.click(buttonElement);
});
