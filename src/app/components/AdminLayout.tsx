// 로고 이미지: public/logo.png 경로에 실제 파일 배치 필요
import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Bell,
  Users,
  BarChart2,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const activeMenuItems = [
  { path: "/", icon: LayoutDashboard, label: "대시보드" },
  { path: "/notices", icon: Bell, label: "공지사항" },
  { path: "/user-stats", icon: Users, label: "유저 통계" },
  { path: "/group-stats", icon: BarChart2, label: "그룹 통계" },
  { path: "/admins", icon: ShieldCheck, label: "관리자" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminNickname = localStorage.getItem("adminNickname") || "관리자";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminNickname");
    toast.success("로그아웃 되었습니다.");
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" || location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <aside className="fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-[#e2e1df] bg-white">
        <div className="p-6 border-b border-[#e2e1df]">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="BOOKIIBOOKII"
              className="w-9 h-9 object-contain rounded-[8px]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement | null)?.removeAttribute("style");
              }}
            />
            <div
              className="w-9 h-9 bg-[#ff7618] rounded-[8px] flex items-center justify-center"
              style={{ display: "none" }}
            >
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-[#242322]">BOOKIIBOOKII</h1>
              <p className="text-xs text-[#858481]">{adminNickname}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {activeMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-[#ff7618] text-white"
                      : "text-[#5e5d5b] hover:bg-[#f4f3f1]"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto border-t border-[#e2e1df] p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[#5e5d5b] transition-colors hover:bg-[#f4f3f1]"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">로그아웃</span>
          </button>
        </div>
      </aside>

      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
