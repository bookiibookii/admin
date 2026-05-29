import { useState } from "react";
import { useNavigate } from "react-router";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

type ContentTab = "인기 책" | "인기 저자" | "인기 출판사";
type ExchangeFilter = "직접 교환" | "택배 교환";
type PageSize = 20 | 50 | 100 | 200;

export type GroupStage = "모집 중" | "내 책 읽기" | "교환" | "파트너 책 읽기" | "반납" | "종료";

export interface Group {
  id: number;
  name: string;
  stage: GroupStage;
  hostNickname: string;
  hostBook: string;
  guestNickname: string;
  guestBook: string;
  createdAt: string;
}

export const STAGE_BADGE: Record<GroupStage, string> = {
  "모집 중":       "bg-blue-100 text-blue-700",
  "내 책 읽기":    "bg-green-100 text-green-700",
  "교환":          "bg-orange-100 text-orange-700",
  "파트너 책 읽기": "bg-teal-100 text-teal-700",
  "반납":          "bg-purple-100 text-purple-700",
  "종료":          "bg-gray-100 text-gray-600",
};

export const DUMMY_GROUPS: Group[] = [
  { id: 28, name: "봄 독서 챌린지", stage: "모집 중", hostNickname: "sunkiss", hostBook: "(미정)", guestNickname: "(없음)", guestBook: "(없음)", createdAt: "2026.05.28" },
  { id: 27, name: "서울 독서 모임", stage: "모집 중", hostNickname: "readit", hostBook: "(미정)", guestNickname: "(없음)", guestBook: "(없음)", createdAt: "2026.05.25" },
  { id: 26, name: "에세이 좋아하는 사람", stage: "내 책 읽기", hostNickname: "essayist", hostBook: "어떻게 살 것인가", guestNickname: "booklover", guestBook: "(투표 중)", createdAt: "2026.05.20" },
  { id: 25, name: "인문학 읽는 사람들", stage: "내 책 읽기", hostNickname: "humanist", hostBook: "사피엔스", guestNickname: "curious99", guestBook: "총균쇠", createdAt: "2026.05.01" },
  { id: 24, name: "책과 함께하는 20대", stage: "내 책 읽기", hostNickname: "bookworm20", hostBook: "채식주의자", guestNickname: "noshel", guestBook: "아몬드", createdAt: "2026.04.12" },
  { id: 23, name: "한강 작품 탐독 클럽", stage: "교환", hostNickname: "hangang_fan", hostBook: "아몬드", guestNickname: "literati", guestBook: "채식주의자", createdAt: "2026.04.08" },
  { id: 22, name: "주말 독서 클럽", stage: "반납", hostNickname: "weekend_reader", hostBook: "해리포터", guestNickname: "magic_lover", guestBook: "어린왕자", createdAt: "2026.04.20" },
  { id: 21, name: "밤에 읽는 소설", stage: "파트너 책 읽기", hostNickname: "nightowl", hostBook: "82년생 김지영", guestNickname: "booknerd", guestBook: "경애의 마음", createdAt: "2026.04.30" },
  { id: 20, name: "고전 문학 탐구반", stage: "종료", hostNickname: "classicfan", hostBook: "연을 쫓는 아이", guestNickname: "scholar", guestBook: "데미안", createdAt: "2026.03.10" },
  { id: 19, name: "느리게 읽는 사람들", stage: "종료", hostNickname: "slowreader", hostBook: "달러구트 꿈 백화점", guestNickname: "mindful_r", guestBook: "어떻게 살 것인가", createdAt: "2026.03.22" },
  { id: 18, name: "시집 읽는 모임", stage: "내 책 읽기", hostNickname: "poetlover", hostBook: "윤동주 시집", guestNickname: "haiku", guestBook: "김소월 시집", createdAt: "2026.04.02" },
  { id: 17, name: "자기계발 독서단", stage: "교환", hostNickname: "grower", hostBook: "원씽", guestNickname: "dailywin", guestBook: "아침형 인간", createdAt: "2026.03.30" },
  { id: 16, name: "SF 소설 클럽", stage: "파트너 책 읽기", hostNickname: "spacereader", hostBook: "마션", guestNickname: "galaxy99", guestBook: "파운데이션", createdAt: "2026.03.18" },
  { id: 15, name: "어린이 고전 읽기", stage: "반납", hostNickname: "childhood", hostBook: "어린왕자", guestNickname: "nostalgic", guestBook: "꼬마 니콜라", createdAt: "2026.03.05" },
  { id: 14, name: "독서 마라톤 팀", stage: "종료", hostNickname: "marathon_r", hostBook: "노르웨이의 숲", guestNickname: "stamina", guestBook: "상실의 시대", createdAt: "2026.02.20" },
  { id: 13, name: "미스터리 독서회", stage: "종료", hostNickname: "mystery_fan", hostBook: "살인자의 기억법", guestNickname: "whodunit", guestBook: "용의자 X의 헌신", createdAt: "2026.02.10" },
  { id: 12, name: "일본 소설 탐독", stage: "종료", hostNickname: "nihon_r", hostBook: "편의점 인간", guestNickname: "murakamist", guestBook: "노르웨이의 숲", createdAt: "2026.02.01" },
  { id: 11, name: "역사 소설 모임", stage: "종료", hostNickname: "historybook", hostBook: "정도전", guestNickname: "chronicler", guestBook: "남한산성", createdAt: "2026.01.25" },
  { id: 10, name: "감성 에세이 클럽", stage: "종료", hostNickname: "feelingbook", hostBook: "나는 나로 살기로 했다", guestNickname: "warmheart", guestBook: "혼자가 혼자에게", createdAt: "2026.01.15" },
  { id: 9, name: "이달의 픽 독서단", stage: "종료", hostNickname: "monthly_pick", hostBook: "달러구트 꿈 백화점", guestNickname: "booklist", guestBook: "베어타운", createdAt: "2026.01.08" },
  { id: 8, name: "두 권 교환 프로젝트", stage: "종료", hostNickname: "swapper", hostBook: "채식주의자", guestNickname: "bookswap", guestBook: "아몬드", createdAt: "2025.12.20" },
  { id: 7, name: "연말 독서 결산", stage: "종료", hostNickname: "yearend", hostBook: "82년생 김지영", guestNickname: "recap2025", guestBook: "연을 쫓는 아이", createdAt: "2025.12.10" },
  { id: 6, name: "12월 독서 챌린지", stage: "종료", hostNickname: "dec_reader", hostBook: "사피엔스", guestNickname: "challenge_r", guestBook: "총균쇠", createdAt: "2025.12.01" },
  { id: 5, name: "소설 속 여행", stage: "종료", hostNickname: "traveler_r", hostBook: "연을 쫓는 아이", guestNickname: "wanderer", guestBook: "지중해 태양의 아래서", createdAt: "2025.11.22" },
  { id: 4, name: "첫 교환 기념 모임", stage: "종료", hostNickname: "firstswap", hostBook: "데미안", guestNickname: "beginner_r", guestBook: "어린왕자", createdAt: "2025.11.10" },
  { id: 3, name: "가을 독서 클럽", stage: "종료", hostNickname: "autumn_r", hostBook: "해리포터", guestNickname: "fall_leaf", guestBook: "달러구트 꿈 백화점", createdAt: "2025.10.30" },
  { id: 2, name: "서울 북메이트 1기", stage: "종료", hostNickname: "seoul_book", hostBook: "아몬드", guestNickname: "cityreader", guestBook: "채식주의자", createdAt: "2025.10.15" },
  { id: 1, name: "부키부키 첫 번째 그룹", stage: "종료", hostNickname: "pioneer", hostBook: "채식주의자", guestNickname: "trailblaze", guestBook: "아몬드", createdAt: "2025.09.01" },
];

const CONTENT_DATA: Record<ContentTab, { name: string; value: number }[]> = {
  "인기 책": [
    { name: "채식주의자", value: 23 }, { name: "아몬드", value: 19 }, { name: "달러구트 꿈 백화점", value: 17 },
    { name: "해리포터", value: 15 }, { name: "82년생 김지영", value: 14 }, { name: "연을 쫓는 아이", value: 12 },
    { name: "사피엔스", value: 11 }, { name: "어린왕자", value: 9 }, { name: "데미안", value: 8 }, { name: "노르웨이의 숲", value: 7 },
  ],
  "인기 저자": [
    { name: "한강", value: 41 }, { name: "정유정", value: 28 }, { name: "김혜진", value: 22 },
    { name: "J.K.롤링", value: 19 }, { name: "오정희", value: 15 }, { name: "조남주", value: 14 },
    { name: "헤르만 헤세", value: 12 }, { name: "무라카미 하루키", value: 11 }, { name: "생텍쥐페리", value: 9 }, { name: "유발 하라리", value: 8 },
  ],
  "인기 출판사": [
    { name: "창비", value: 55 }, { name: "민음사", value: 48 }, { name: "문학동네", value: 39 },
    { name: "위즈덤하우스", value: 31 }, { name: "현대문학", value: 24 }, { name: "문학과지성사", value: 21 },
    { name: "열린책들", value: 18 }, { name: "arte", value: 16 }, { name: "한겨레출판", value: 14 }, { name: "북하우스", value: 12 },
  ],
};

const GENRE_DATA = [
  { name: "소설", value: 38, color: "#ff7618" }, { name: "에세이", value: 22, color: "#ffd5b5" },
  { name: "시", value: 12, color: "#ffe8d6" }, { name: "자기계발", value: 11, color: "#ffb37c" },
  { name: "인문학", value: 9, color: "#ffa05c" }, { name: "기타", value: 8, color: "#f0eeec" },
];

const EXCHANGE_DATA = [
  { name: "직접 교환", value: 54, color: "#ff7618" },
  { name: "택배 교환", value: 46, color: "#ffd5b5" },
];

const STAGE_DATA: Record<ExchangeFilter, { name: string; value: number }[]> = {
  "직접 교환": [
    { name: "모집 중", value: 10 }, { name: "내 책 읽기", value: 28 }, { name: "교환", value: 22 },
    { name: "파트너 책 읽기", value: 19 }, { name: "반납", value: 8 }, { name: "종료", value: 42 },
  ],
  "택배 교환": [
    { name: "모집 중", value: 7 }, { name: "내 책 읽기", value: 19 }, { name: "교환", value: 15 },
    { name: "파트너 책 읽기", value: 14 }, { name: "반납", value: 10 }, { name: "종료", value: 30 },
  ],
};

const SUMMARY_CARDS = [
  { label: "전체 그룹 수", value: "183개" },
  { label: "진행 중 그룹", value: "94개" },
  { label: "완료된 그룹", value: "72개" },
  { label: "모집 중 그룹", value: "17개" },
];

const PAGE_SIZE_OPTIONS: PageSize[] = [20, 50, 100, 200];

export default function GroupStats() {
  const navigate = useNavigate();
  const [contentTab, setContentTab] = useState<ContentTab>("인기 책");
  const [exchangeFilter, setExchangeFilter] = useState<ExchangeFilter>("직접 교환");
  const [pageSize, setPageSize] = useState<PageSize>(20);
  const [currentPage, setCurrentPage] = useState(1);

  const sortedGroups = [...DUMMY_GROUPS].sort((a, b) => b.id - a.id);
  const totalPages = Math.ceil(sortedGroups.length / pageSize);
  const pagedGroups = sortedGroups.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageSizeChange = (size: PageSize) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#242322]">그룹 통계</h1>
        <p className="text-[#858481] mt-1">그룹 현황과 콘텐츠 트렌드를 분석합니다</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {SUMMARY_CARDS.map((card) => (
          <div key={card.label} className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
            <p className="text-sm text-[#858481]">{card.label}</p>
            <p className="text-3xl font-bold text-[#242322] mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* 섹션 1: 인기 콘텐츠 */}
      <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#242322]">인기 콘텐츠 TOP 10</h2>
          <div className="flex gap-1 bg-[#f4f3f1] rounded-[10px] p-1">
            {(["인기 책", "인기 저자", "인기 출판사"] as ContentTab[]).map((tab) => (
              <button key={tab} onClick={() => setContentTab(tab)}
                className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                  contentTab === tab ? "bg-[#ff7618] text-white" : "text-[#858481] hover:text-[#242322]"
                }`}
              >{tab}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={CONTENT_DATA[contentTab]} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0eeec" />
            <XAxis type="number" tick={{ fontSize: 12, fill: "#858481" }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#858481" }} width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="#ff7618" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 섹션 2, 3: 장르 + 교환 방식 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
          <h2 className="text-lg font-bold text-[#242322] mb-4">장르 분포</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={GENRE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {GENRE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
          <h2 className="text-lg font-bold text-[#242322] mb-4">교환 방식 분포</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={EXCHANGE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {EXCHANGE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 섹션 4: 그룹 진행 단계 현황 */}
      <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#242322]">그룹 진행 단계 현황</h2>
          <div className="flex gap-1 bg-[#f4f3f1] rounded-[10px] p-1">
            {(["직접 교환", "택배 교환"] as ExchangeFilter[]).map((filter) => (
              <button key={filter} onClick={() => setExchangeFilter(filter)}
                className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                  exchangeFilter === filter ? "bg-[#ff7618] text-white" : "text-[#858481] hover:text-[#242322]"
                }`}
              >{filter}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={STAGE_DATA[exchangeFilter]} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0eeec" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#858481" }} />
            <YAxis tick={{ fontSize: 12, fill: "#858481" }} />
            <Tooltip formatter={(v) => `${v}개`} />
            <Bar dataKey="value" fill="#ff7618" radius={[6, 6, 0, 0]} label={{ position: "top", fontSize: 12, fill: "#858481" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 섹션 5: 그룹 목록 테이블 */}
      <div className="bg-white rounded-[20px] border border-[#e2e1df] overflow-hidden">
        <div className="p-6 border-b border-[#e2e1df] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#242322]">그룹 목록</h2>
            <p className="text-sm text-[#858481] mt-0.5">총 {sortedGroups.length}개 · 최신순</p>
          </div>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value) as PageSize); setCurrentPage(1); }}
            className="text-sm border border-[#e2e1df] rounded-[8px] px-3 py-2 bg-white text-[#242322] focus:outline-none focus:ring-2 focus:ring-[#ff7618]/30"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}개씩 보기</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e1df] bg-[#f4f3f1]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] whitespace-nowrap">그룹명</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] whitespace-nowrap">현재 단계</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] whitespace-nowrap">호스트 닉네임</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] whitespace-nowrap">호스트 선정 책</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] whitespace-nowrap">게스트 닉네임</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] whitespace-nowrap">게스트 선정 책</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] whitespace-nowrap">생성일</th>
              </tr>
            </thead>
            <tbody>
              {pagedGroups.map((group) => (
                <tr
                  key={group.id}
                  onClick={() => navigate(`/group-stats/${group.id}`)}
                  className="border-b border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 text-sm font-medium text-[#242322] whitespace-nowrap">{group.name}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STAGE_BADGE[group.stage]}`}>
                      {group.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-[#858481] whitespace-nowrap">{group.hostNickname}</td>
                  <td className="py-3 px-4 text-sm text-[#858481] whitespace-nowrap">{group.hostBook}</td>
                  <td className="py-3 px-4 text-sm text-[#858481] whitespace-nowrap">{group.guestNickname}</td>
                  <td className="py-3 px-4 text-sm text-[#858481] whitespace-nowrap">{group.guestBook}</td>
                  <td className="py-3 px-4 text-sm text-[#858481] whitespace-nowrap">{group.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#e2e1df] flex items-center justify-between">
            <p className="text-sm text-[#858481]">
              {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedGroups.length)} / {sortedGroups.length}개
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-[8px] text-sm border border-[#e2e1df] text-[#5e5d5b] hover:bg-[#f4f3f1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                이전
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                const page = start + i;
                if (page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 text-sm rounded-[8px] font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#ff7618] text-white"
                        : "border border-[#e2e1df] text-[#5e5d5b] hover:bg-[#f4f3f1]"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-[8px] text-sm border border-[#e2e1df] text-[#5e5d5b] hover:bg-[#f4f3f1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
