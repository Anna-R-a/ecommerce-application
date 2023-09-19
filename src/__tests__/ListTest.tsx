import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Context } from "../components/context/Context";
import ListProduct from "../components/list-product/ListProduct";

describe("Test", () => {
  test("should render list product", async () => {
    render(
      <Context.Provider value={[]}>
        <BrowserRouter>
          <ListProduct data={[]} />
        </BrowserRouter>
      </Context.Provider>,
    );
    await screen.findByText("No data");
    expect(screen.getByText("No data")).toBeInTheDocument();
  });
});
