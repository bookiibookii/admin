import { useEffect } from "react"; // 💡 useEffect 추가
import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { toast } from "sonner"; // 💡 알림 띄우기용
import {
  LayoutDashboard,
  AlertCircle,
  MessageSquare,
  Bell,
  LogOut,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // 💡 라우트 보호 로직: 관리자가 아니면 로그인 페이지로 쫓아냄
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "ADMIN") {
      toast.error("접근 권한이 없습니다. 관리자 계정으로 로그인해주세요.");
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    // 로그아웃 시 스토리지 비우기
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");

    toast.success("로그아웃 되었습니다.");
    navigate("/");
  };

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "대시보드" },
    { path: "/admin/reports", icon: AlertCircle, label: "신고 관리" },
    { path: "/admin/inquiries", icon: MessageSquare, label: "문의 관리" },
    { path: "/admin/notices", icon: Bell, label: "공지사항 관리" },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      {/* ... (이하 레이아웃 렌더링 코드는 기존에 수정한 부분과 완전 동일) ... */}
      <aside className="fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-[#e2e1df] bg-white">
        <div className="p-6 border-b border-[#e2e1df]">
          <h1 className="text-xl font-semibold text-[#242322]">BOOKIIBOOKII</h1>
          <p className="text-sm text-[#858481] mt-1">관리자</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
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
