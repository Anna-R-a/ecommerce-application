import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Context } from "../components/context/Context";
import ProductPage from "../pages/product/Product";

describe("Test", () => {
  test("should render product page", async () => {
    render(
      <Context.Provider value={[]}>
        <BrowserRouter>
          <ProductPage />
        </BrowserRouter>
      </Context.Provider>,
    );
    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    const buttonAdd = await screen.findByRole("button", {
      name: /Add to Cart/i,
    });
    expect(buttonAdd).toBeVisible();
    fireEvent.click(buttonAdd);
  });
});
