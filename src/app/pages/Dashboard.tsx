import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Bell, Users, BarChart2, ArrowRight, Plus } from "lucide-react";
import api from "../../lib/api";
import { formatRelativeTime } from "../../lib/dateUtils";

interface RecentNotice {
  id: number;
  title: string;
  createdAt: string;
}

interface UserStats {
  totalUsers: number;
  todayNewUsers: number;
}

interface GroupStats {
  totalGroups: number;
  todayCreated: number;
  activeGroups: number;
  completedGroups: number;
}


const DUMMY_USER_STATS: UserStats = {
  totalUsers: 1247,
  todayNewUsers: 23,
};

const DUMMY_GROUP_STATS: GroupStats = {
  totalGroups: 183,
  todayCreated: 4,
  activeGroups: 94,
  completedGroups: 72,
};

function formatNoticeId(id: number): string {
  return `N-${String(id).padStart(3, "0")}`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const adminNickname = localStorage.getItem("adminNickname") || "관리자";

  const [notices, setNotices] = useState<RecentNotice[]>([]);
  const [isLoadingNotices, setIsLoadingNotices] = useState(true);

  const userStats = DUMMY_USER_STATS;
  const groupStats = DUMMY_GROUP_STATS;

  useEffect(() => {
    api.get("/api/admin/notice")
      .then(({ data }) => {
        if (data.isSuccess) {
          const sorted = (data.result || [])
            .sort((a: RecentNotice, b: RecentNotice) => b.id - a.id)
            .slice(0, 5);
          setNotices(sorted);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingNotices(false));
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#242322]">대시보드</h1>
        <p className="text-[#858481] mt-1">
          안녕하세요, <span className="font-medium text-[#242322]">{adminNickname}</span>님 👋
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 카드 1: 최근 공지사항 */}
        <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#ff7618]/10 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#ff7618]" />
              </div>
              <h2 className="text-base font-bold text-[#242322]">최근 공지사항</h2>
            </div>
            <Link
              to="/notices"
              className="flex items-center gap-1 text-sm text-[#ff7618] hover:underline"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ul className="divide-y divide-[#f4f3f1] flex-1">
            {isLoadingNotices ? (
              <li className="flex justify-center py-6">
                <div className="w-5 h-5 border-2 border-[#ff7618] border-t-transparent rounded-full animate-spin" />
              </li>
            ) : notices.length === 0 ? (
              <li className="text-center py-6 text-sm text-[#858481]">등록된 공지사항이 없습니다.</li>
            ) : (
              notices.map((notice) => (
                <li key={notice.id}>
                  <button
                    onClick={() => navigate(`/notices/${notice.id}`)}
                    className="w-full flex items-center justify-between py-3 px-2 rounded-lg hover:bg-[#f9f9f8] transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-[#b0afad] font-mono shrink-0">
                        {formatNoticeId(notice.id)}
                      </span>
                      <span className="text-sm text-[#242322] font-medium truncate group-hover:text-[#ff7618] transition-colors">
                        {notice.title}
                      </span>
                    </div>
                    <span className="text-xs text-[#858481] shrink-0 ml-4">
                      {formatRelativeTime(notice.createdAt)}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="mt-4 pt-4 border-t border-[#f4f3f1]">
            <Link
              to="/notices/new"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] border border-[#e2e1df] text-sm text-[#5e5d5b] hover:bg-[#f4f3f1] transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              공지 등록
            </Link>
          </div>
        </div>

        {/* 우측 컬럼: 유저 통계 + 그룹 통계 */}
        <div className="flex flex-col gap-6">
          {/* 카드 2: 유저 통계 */}
          <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#ff7618]/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#ff7618]" />
                </div>
                <h2 className="text-base font-bold text-[#242322]">유저 통계</h2>
              </div>
              <Link
                to="/user-stats"
                className="flex items-center gap-1 text-sm text-[#ff7618] hover:underline"
              >
                전체보기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f4f3f1] rounded-[12px] p-4">
                <p className="text-xs text-[#858481] mb-1">전체 가입자 수</p>
                <p className="text-2xl font-bold text-[#242322]">
                  {userStats.totalUsers.toLocaleString()}
                  <span className="text-sm font-medium ml-1">명</span>
                </p>
                <p className="text-xs text-[#b0afad] mt-1">누적 가입자</p>
              </div>
              <div className="bg-[#f4f3f1] rounded-[12px] p-4">
                <p className="text-xs text-[#858481] mb-1">오늘 신규 가입</p>
                <p className="text-2xl font-bold text-[#242322]">
                  {userStats.todayNewUsers.toLocaleString()}
                  <span className="text-sm font-medium ml-1">명</span>
                </p>
                <p className="text-xs text-[#b0afad] mt-1">오늘 기준</p>
              </div>
            </div>
          </div>

          {/* 카드 3: 그룹 통계 */}
          <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#ff7618]/10 rounded-full flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-[#ff7618]" />
                </div>
                <h2 className="text-base font-bold text-[#242322]">그룹 통계</h2>
              </div>
              <Link
                to="/group-stats"
                className="flex items-center gap-1 text-sm text-[#ff7618] hover:underline"
              >
                전체보기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f4f3f1] rounded-[12px] p-4">
                <p className="text-xs text-[#858481] mb-1">오늘 생성된 그룹</p>
                <p className="text-2xl font-bold text-[#242322]">
                  {groupStats.todayCreated.toLocaleString()}
                  <span className="text-sm font-medium ml-1">개</span>
                </p>
              </div>
              <div className="bg-[#f4f3f1] rounded-[12px] p-4">
                <p className="text-xs text-[#858481] mb-1">진행 중인 그룹</p>
                <p className="text-2xl font-bold text-[#ff7618]">
                  {groupStats.activeGroups.toLocaleString()}
                  <span className="text-sm font-medium ml-1">개</span>
                </p>
              </div>
              <div className="bg-[#f4f3f1] rounded-[12px] p-4">
                <p className="text-xs text-[#858481] mb-1">종료된 그룹</p>
                <p className="text-2xl font-bold text-[#242322]">
                  {groupStats.completedGroups.toLocaleString()}
                  <span className="text-sm font-medium ml-1">개</span>
                </p>
              </div>
              <div className="bg-[#f4f3f1] rounded-[12px] p-4">
                <p className="text-xs text-[#858481] mb-1">전체 그룹 수</p>
                <p className="text-2xl font-bold text-[#242322]">
                  {groupStats.totalGroups.toLocaleString()}
                  <span className="text-sm font-medium ml-1">개</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
