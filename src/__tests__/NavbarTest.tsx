import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Nav } from "../components/navBar/NavBar";
import { BrowserRouter } from "react-router-dom";

test("should show error message when all the fields are not entered", async () => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => {
    render(
      <BrowserRouter>
        <Nav />
      </BrowserRouter>,
    );
  });
  const buttonElement = screen.getByText("Home");
  await waitFor(() => {
    expect(buttonElement).toBeInTheDocument();
  });
  fireEvent.click(screen.getByRole("link"), {
    name: "Home",
  });
}, 10000);
