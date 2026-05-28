import { createBrowserRouter } from "react-router";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import ReportList from "./pages/ReportList";
import ReportDetail from "./pages/ReportDetail";
import InquiryList from "./pages/InquiryList";
import InquiryDetail from "./pages/InquiryDetail";
import NoticeList from "./pages/NoticeList";
import NoticeEditor from "./pages/NoticeEditor";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "reports", Component: ReportList },
      { path: "reports/:id", Component: ReportDetail },
      { path: "inquiries", Component: InquiryList },
      { path: "inquiries/:id", Component: InquiryDetail },
      { path: "notices", Component: NoticeList },
      { path: "notices/new", Component: NoticeEditor },
      { path: "notices/:id/edit", Component: NoticeEditor },
    ],
  },
]);
