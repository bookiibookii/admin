import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

type ContentTab = "인기 책" | "인기 저자" | "인기 출판사";

type GroupStage = "모집 중" | "책 선정" | "독서 중" | "교환 진행" | "완료";

interface Group {
  id: number;
  name: string;
  stage: GroupStage;
  memberCount: number;
  book: string;
  createdAt: string;
}

const DUMMY_GROUPS: Group[] = [
  { id: 1, name: "책과 함께하는 20대", stage: "독서 중", memberCount: 4, book: "채식주의자", createdAt: "2026.04.12" },
  { id: 2, name: "한강 작품 탐독 클럽", stage: "교환 진행", memberCount: 6, book: "아몬드", createdAt: "2026.04.08" },
  { id: 3, name: "느리게 읽는 사람들", stage: "완료", memberCount: 3, book: "달러구트 꿈 백화점", createdAt: "2026.03.22" },
  { id: 4, name: "서울 독서 모임", stage: "모집 중", memberCount: 2, book: "(미정)", createdAt: "2026.05.25" },
  { id: 5, name: "에세이 좋아하는 사람", stage: "책 선정", memberCount: 4, book: "(투표 중)", createdAt: "2026.05.20" },
  { id: 6, name: "밤에 읽는 소설", stage: "독서 중", memberCount: 5, book: "82년생 김지영", createdAt: "2026.04.30" },
  { id: 7, name: "고전 문학 탐구반", stage: "완료", memberCount: 4, book: "연을 쫓는 아이", createdAt: "2026.03.10" },
  { id: 8, name: "주말 독서 클럽", stage: "교환 진행", memberCount: 3, book: "해리포터", createdAt: "2026.04.20" },
  { id: 9, name: "인문학 읽는 사람들", stage: "독서 중", memberCount: 6, book: "사피엔스", createdAt: "2026.05.01" },
  { id: 10, name: "봄 독서 챌린지", stage: "모집 중", memberCount: 1, book: "(미정)", createdAt: "2026.05.28" },
];

const CONTENT_DATA: Record<ContentTab, { name: string; value: number }[]> = {
  "인기 책": [
    { name: "채식주의자", value: 23 },
    { name: "아몬드", value: 19 },
    { name: "달러구트 꿈 백화점", value: 17 },
    { name: "해리포터", value: 15 },
    { name: "82년생 김지영", value: 14 },
    { name: "연을 쫓는 아이", value: 12 },
    { name: "사피엔스", value: 11 },
    { name: "어린왕자", value: 9 },
    { name: "데미안", value: 8 },
    { name: "노르웨이의 숲", value: 7 },
  ],
  "인기 저자": [
    { name: "한강", value: 41 },
    { name: "정유정", value: 28 },
    { name: "김혜진", value: 22 },
    { name: "J.K.롤링", value: 19 },
    { name: "오정희", value: 15 },
    { name: "조남주", value: 14 },
    { name: "헤르만 헤세", value: 12 },
    { name: "무라카미 하루키", value: 11 },
    { name: "생텍쥐페리", value: 9 },
    { name: "유발 하라리", value: 8 },
  ],
  "인기 출판사": [
    { name: "창비", value: 55 },
    { name: "민음사", value: 48 },
    { name: "문학동네", value: 39 },
    { name: "위즈덤하우스", value: 31 },
    { name: "현대문학", value: 24 },
    { name: "문학과지성사", value: 21 },
    { name: "열린책들", value: 18 },
    { name: "arte", value: 16 },
    { name: "한겨레출판", value: 14 },
    { name: "북하우스", value: 12 },
  ],
};

const GENRE_DATA = [
  { name: "소설", value: 38, color: "#ff7618" },
  { name: "에세이", value: 22, color: "#ffd5b5" },
  { name: "시", value: 12, color: "#ffe8d6" },
  { name: "자기계발", value: 11, color: "#ffb37c" },
  { name: "인문학", value: 9, color: "#ffa05c" },
  { name: "기타", value: 8, color: "#f0eeec" },
];

const EXCHANGE_DATA = [
  { name: "직접 교환", value: 54, color: "#ff7618" },
  { name: "택배 교환", value: 46, color: "#ffd5b5" },
];

const STAGE_DATA = [
  { name: "모집 중", value: 17 },
  { name: "책 선정", value: 12 },
  { name: "독서 중", value: 45 },
  { name: "교환 진행", value: 37 },
  { name: "완료", value: 72 },
];

const STAGE_BADGE: Record<GroupStage, string> = {
  "모집 중": "bg-blue-100 text-blue-700",
  "책 선정": "bg-yellow-100 text-yellow-700",
  "독서 중": "bg-green-100 text-green-700",
  "교환 진행": "bg-orange-100 text-orange-700",
  "완료": "bg-gray-100 text-gray-600",
};

const SUMMARY_CARDS = [
  { label: "전체 그룹 수", value: "183개" },
  { label: "진행 중 그룹", value: "94개" },
  { label: "완료된 그룹", value: "72개" },
  { label: "모집 중 그룹", value: "17개" },
];

export default function GroupStats() {
  const [contentTab, setContentTab] = useState<ContentTab>("인기 책");

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
              <button
                key={tab}
                onClick={() => setContentTab(tab)}
                className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                  contentTab === tab ? "bg-[#ff7618] text-white" : "text-[#858481] hover:text-[#242322]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={CONTENT_DATA[contentTab]}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
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
              <Pie
                data={GENRE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
                labelLine={false}
              >
                {GENRE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
          <h2 className="text-lg font-bold text-[#242322] mb-4">교환 방식 분포</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={EXCHANGE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
                labelLine={false}
              >
                {EXCHANGE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 섹션 4: 그룹 진행 단계 현황 */}
      <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6 mb-8">
        <h2 className="text-lg font-bold text-[#242322] mb-4">그룹 진행 단계 현황</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={STAGE_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
        <div className="p-6 border-b border-[#e2e1df]">
          <h2 className="text-lg font-bold text-[#242322]">그룹 목록</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e1df] bg-[#f4f3f1]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">그룹명</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">현재 단계</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">참여 인원</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">선정 책</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">생성일</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_GROUPS.map((group) => (
                <tr key={group.id} className="border-b border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-[#242322]">{group.name}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STAGE_BADGE[group.stage]}`}>
                      {group.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-[#858481]">{group.memberCount}명</td>
                  <td className="py-3 px-4 text-sm text-[#858481]">{group.book}</td>
                  <td className="py-3 px-4 text-sm text-[#858481]">{group.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
