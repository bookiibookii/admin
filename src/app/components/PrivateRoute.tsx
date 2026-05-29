import { Navigate, Outlet } from "react-router";

export default function PrivateRoute() {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");

  // TODO: 임시 인증 우회 — 복구 필요
  // if (!token || role !== "ADMIN") {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />;
}
