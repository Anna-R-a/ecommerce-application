import { Routes, Route } from "react-router-dom";
import { PageLayout } from "./components/layout/Layout";
import {
  ProtectedRouteProfile,
  ProtectedRouteLogin,
} from "./components/protected-route/ProtectedRoute";
import HomePage from "./pages/home/Home";
import LoginPage from "./pages/login/Login";
import RegistrationPage from "./pages/registration/Registration";
import CatalogPage from "./pages/catalog/Catalog";
import ProfilePage from "./pages/profile/Profile";
import NotFoundPage from "./pages/notFound/NotFound";
import ProductPage from "./pages/product/Product";
import CartPage from "./pages/cart/Cart";
import AboutPage from "./pages/about/About";
import { useState } from "react";
import { Context } from "./components/context/Context";
import { getActiveCart } from "./api/api";
import "./App.css";

const activeCart =
  localStorage.getItem("activeCart")
    ? await getActiveCart()
    : null;

function App() {
  const [context, setContext] = useState(activeCart ? activeCart.body : null);

  return (
    <Context.Provider value={[context, setContext]}>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <ProtectedRouteLogin>
                <LoginPage />
              </ProtectedRouteLogin>
            }
          />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalog/:keyCatalog" element={<CatalogPage />} />
          <Route
            path="/catalog/:keyCatalog/:keyCatalog"
            element={<CatalogPage />}
          />
          <Route path="/products/:key" element={<ProductPage />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRouteProfile>
                <ProfilePage />
              </ProtectedRouteProfile>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Context.Provider>
  );
}

export default App;
