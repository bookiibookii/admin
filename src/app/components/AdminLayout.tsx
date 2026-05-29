// 로고 이미지: public/logo.png 경로에 실제 파일 배치 필요
import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import {
  LayoutDashboard, Bell, Users, BarChart2, ShieldCheck,
  LogOut, Menu, X, ChevronLeft, ChevronRight,
} from "lucide-react";

const menuItems = [
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

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

      {/* 모바일 상단 바 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-[#e2e1df] flex items-center px-4 gap-3">
        <button onClick={() => setMobileOpen(true)} className="p-1 text-[#5e5d5b]">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="BOOKIIBOOKII"
            className="w-7 h-7 object-contain rounded-[6px]"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              (e.currentTarget.nextElementSibling as HTMLElement | null)?.removeAttribute("style");
            }}
          />
          <div className="w-7 h-7 bg-[#ff7618] rounded-[6px] flex items-center justify-center" style={{ display: "none" }}>
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <span className="text-base font-bold text-[#242322]">BOOKIIBOOKII</span>
        </div>
      </div>

      {/* 모바일 backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-[#e2e1df] bg-white
          transition-all duration-300 ease-in-out
          w-64 ${collapsed ? "md:w-16" : "md:w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* 헤더 */}
        <div className={`border-b border-[#e2e1df] flex items-center gap-3 transition-all duration-300 ${collapsed ? "md:justify-center p-4" : "p-5"}`}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src="/logo.png"
              alt="BOOKIIBOOKII"
              className="w-9 h-9 object-contain rounded-[8px] shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement | null)?.removeAttribute("style");
              }}
            />
            <div className="w-9 h-9 bg-[#ff7618] rounded-[8px] flex items-center justify-center shrink-0" style={{ display: "none" }}>
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <div className={`min-w-0 transition-all duration-300 ${collapsed ? "md:hidden" : ""}`}>
              <h1 className="text-base font-bold text-[#242322] whitespace-nowrap">BOOKIIBOOKII</h1>
              <p className="text-xs text-[#858481] truncate">{adminNickname}</p>
            </div>
          </div>
          {/* 모바일 닫기 버튼 */}
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-[#5e5d5b] shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center py-3 rounded-lg transition-colors
                    ${collapsed ? "md:justify-center px-2" : "gap-3 px-4"}
                    ${isActive(item.path) ? "bg-[#ff7618] text-white" : "text-[#5e5d5b] hover:bg-[#f4f3f1]"}
                  `}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className={`font-medium whitespace-nowrap transition-all duration-300 ${collapsed ? "md:hidden" : ""}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 하단 영역 */}
        <div className="border-t border-[#e2e1df] p-2">
          <button
            onClick={handleLogout}
            title={collapsed ? "로그아웃" : undefined}
            className={`flex w-full items-center py-3 rounded-lg text-[#5e5d5b] transition-colors hover:bg-[#f4f3f1]
              ${collapsed ? "md:justify-center px-2" : "gap-3 px-4"}
            `}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${collapsed ? "md:hidden" : ""}`}>
              로그아웃
            </span>
          </button>

          {/* 데스크탑 접기/펼치기 버튼 */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden md:flex w-full items-center py-2.5 rounded-lg text-[#b0afad] hover:bg-[#f4f3f1] hover:text-[#5e5d5b] transition-colors mt-1
              ${collapsed ? "justify-center px-2" : "gap-3 px-4"}
            `}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span className="text-sm">접기</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className={`min-h-screen pt-14 md:pt-0 transition-all duration-300 ${collapsed ? "md:ml-16" : "md:ml-64"}`}>
        <Outlet />
      </main>
    </div>
  );
}
