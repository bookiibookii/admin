import { Navigate, Outlet } from "react-router";

export default function PrivateRoute() {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");

  if (!token || role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
