import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Context } from "../components/context/Context";
import CartPage from "../pages/cart/Cart";

describe("Test", () => {
  test("should render cart page", async () => {
    render(
      <Context.Provider value={[]}>
        <BrowserRouter>
          <CartPage />
        </BrowserRouter>
      </Context.Provider>,
    );

    expect(screen.getByText("Clear cart")).toBeInTheDocument();
    const buttonClear =await screen.findByRole("button", { name: /Clear cart/i });
    expect(buttonClear).toBeVisible();
    fireEvent.click(buttonClear)
  });
});
