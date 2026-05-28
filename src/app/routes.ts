import { createBrowserRouter } from "react-router";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import NoticeList from "./pages/NoticeList";
import NoticeEditor from "./pages/NoticeEditor";
import PrivateRoute from "./components/PrivateRoute";
import Unauthorized from "./pages/Unauthorized";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: AdminLogin,
  },
  {
    path: "/unauthorized",
    Component: Unauthorized,
  },
  {
    path: "/",
    Component: PrivateRoute,
    children: [
      {
        Component: AdminLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: "dashboard", Component: Dashboard },
          { path: "notices", Component: NoticeList },
          { path: "notices/new", Component: NoticeEditor },
          { path: "notices/:id/edit", Component: NoticeEditor },
        ],
      },
    ],
  },
]);
