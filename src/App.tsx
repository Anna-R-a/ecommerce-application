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

import "./App.css";
import ProductPage from "./pages/product/Product";

function App() {
  return (
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
        <Route path="/catalog/:key" element={<CatalogPage />} />
        <Route
          path="/catalog/:key/:key"
          element={<CatalogPage />}
        />
        <Route path="/products/:key" element={<ProductPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRouteProfile>
              <ProfilePage />
            </ProtectedRouteProfile>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
