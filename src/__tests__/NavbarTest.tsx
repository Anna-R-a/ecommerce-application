import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Nav } from "../components/navBar/NavBar";
import { BrowserRouter } from "react-router-dom";
import { Context } from "../components/context/Context";

test("renders button and is able to click", async () => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => {
    render(
      <Context.Provider value={[]}>
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      </Context.Provider>,
    );
  });
  const buttonElement = screen.getByText("Home");
  await waitFor(() => {
    expect(buttonElement).toBeInTheDocument();
  });
  fireEvent.click(
    screen.getByRole("link", {
      name: "Home",
    }),
  );
});
