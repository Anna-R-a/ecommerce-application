import { Routes, Route } from "react-router-dom";
import { PageLayout } from "./components/layout/Layout";
// import { CatalogPage } from "./pages/catalog/Catalog";

import HomePage from "./pages/home/Home";
import LoginPage from "./pages/login/Login";
import RegistrationPage from "./pages/registration/Registration";
import NotFoundPage from "./pages/notFound/NotFound";

import "./App.css";

function App() {
    return (
        <Routes>
            <Route element={<PageLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registration" element={<RegistrationPage />} />
                {/* <Route path="/catalog" element={<CatalogPage />} /> */}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
