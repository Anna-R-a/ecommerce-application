import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRouteProfile = ({ children }: ProtectedRouteProps) => {
  const isLogged = localStorage.getItem("isLogged");
  if (!isLogged) {
    return <Navigate to="/registration" />;
  }
  return children;
};

export const ProtectedRouteLogin = ({ children }: ProtectedRouteProps) => {
  const isLogged = localStorage.getItem("isLogged");
  if (isLogged) {
    return <Navigate to="/" />;
  }
  return children;
};