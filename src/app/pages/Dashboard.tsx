import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Bell, ArrowRight, Clock } from "lucide-react";
import api from "../../lib/api";

interface Notice {
  id: number;
  title: string;
  createdAt: string;
}

export default function Dashboard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const adminEmail = localStorage.getItem("adminEmail") || "";
  const adminName = localStorage.getItem("adminName") || "관리자";

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await api.get("/api/admin/notice");
        if (data.isSuccess) {
          const sorted = (data.result || [])
            .sort((a: Notice, b: Notice) => b.id - a.id)
            .slice(0, 5);
          setNotices(sorted);
        }
      } catch {
        // 대시보드 로딩 실패는 조용히 처리
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#242322]">대시보드</h1>
        <p className="text-[#858481] mt-1">
          안녕하세요, <span className="font-medium text-[#242322]">{adminName}</span>님
          {adminEmail && <span className="text-sm ml-1">({adminEmail})</span>}
        </p>
      </div>

      {/* 최근 공지사항 */}
      <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df] mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ff7618]/10 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#ff7618]" />
            </div>
            <h2 className="text-lg font-bold text-[#242322]">최근 공지사항</h2>
          </div>
          <Link
            to="/notices"
            className="flex items-center gap-1 text-sm text-[#ff7618] hover:underline"
          >
            전체보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#ff7618] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notices.length === 0 ? (
          <p className="text-center text-[#858481] py-8 text-sm">등록된 공지사항이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-[#f4f3f1]">
            {notices.map((notice) => (
              <li key={notice.id}>
                <Link
                  to={`/notices/${notice.id}/edit`}
                  className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-[#f9f9f8] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-[#b0afad] font-medium shrink-0">
                      #{notice.id}
                    </span>
                    <span className="text-sm text-[#242322] font-medium truncate group-hover:text-[#ff7618] transition-colors">
                      {notice.title}
                    </span>
                  </div>
                  <span className="text-xs text-[#858481] shrink-0 ml-4">
                    {formatDate(notice.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Phase 2 안내 카드 */}
      <div className="bg-[#fff8f4] border border-[#ffdcc3] rounded-[20px] p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#ff7618]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-5 h-5 text-[#ff7618]" />
          </div>
          <div>
            <h3 className="font-bold text-[#242322] mb-1">Phase 2 준비 중</h3>
            <p className="text-sm text-[#858481]">
              유저/그룹 통계는 준비 중이에요. 곧 업데이트될 예정이에요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
