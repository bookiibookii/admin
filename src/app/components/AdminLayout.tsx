import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  AlertCircle, 
  MessageSquare, 
  Bell, 
  LogOut 
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: '대시보드' },
    { path: '/admin/reports', icon: AlertCircle, label: '신고 관리' },
    { path: '/admin/inquiries', icon: MessageSquare, label: '문의 관리' },
    { path: '/admin/notices', icon: Bell, label: '공지사항 관리' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-[#f6f6f6]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#e2e1df] flex flex-col">
        <div className="p-6 border-b border-[#e2e1df]">
          <h1 className="text-xl font-semibold text-[#242322]">BOOKIIBOOKII</h1>
          <p className="text-sm text-[#858481] mt-1">관리자</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-[#ff7618] text-white'
                      : 'text-[#5e5d5b] hover:bg-[#f4f3f1]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#e2e1df]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-[#5e5d5b] hover:bg-[#f4f3f1] rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
