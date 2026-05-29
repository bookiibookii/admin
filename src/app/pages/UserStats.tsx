import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

type PeriodTab = "일간" | "주간" | "월간" | "연간";
type CrossGroup =
  | "여성" | "남성" | "선택 안함"
  | "10대" | "20대" | "30대" | "40대" | "50대 이상";

function generateDailyData() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return { label: `${d.getMonth() + 1}/${d.getDate()}`, 가입자수: Math.floor(Math.random() * 26) + 5 };
  });
}
function generateWeeklyData() {
  return Array.from({ length: 12 }, (_, i) => ({
    label: `${12 - i}주 전`,
    가입자수: Math.floor(Math.random() * 121) + 30,
  })).reverse();
}
function generateMonthlyData() {
  const months = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  return Array.from({ length: 12 }, (_, i) => ({
    label: months[i],
    가입자수: Math.floor(Math.random() * 401) + 100,
  }));
}

const DAILY_DATA = generateDailyData();
const WEEKLY_DATA = generateWeeklyData();
const MONTHLY_DATA = generateMonthlyData();
const YEARLY_DATA = [
  { label: "2024", 가입자수: 823 },
  { label: "2025", 가입자수: 1451 },
  { label: "2026", 가입자수: 987 },
];
const PERIOD_DATA: Record<PeriodTab, typeof DAILY_DATA> = {
  일간: DAILY_DATA, 주간: WEEKLY_DATA, 월간: MONTHLY_DATA, 연간: YEARLY_DATA,
};

const GENDER_DATA = [
  { name: "여성", value: 71, color: "#ff7618" },
  { name: "남성", value: 23, color: "#ffd5b5" },
  { name: "선택 안함", value: 6, color: "#ffe8d6" },
];
const AGE_DATA = [
  { name: "10대", value: 8 },
  { name: "20대", value: 61 },
  { name: "30대", value: 22 },
  { name: "40대", value: 9 },
  { name: "50대 이상", value: 5 },  // 50대 이상 추가
];
const BOOK_TOP5 = [
  { name: "채식주의자", value: 89 },
  { name: "달러구트 꿈 백화점", value: 76 },
  { name: "아몬드", value: 65 },
  { name: "해리포터", value: 54 },
  { name: "연을 쫓는 아이", value: 48 },
];
const READING_STYLE = [
  { name: "직접 메모", value: 28 },
  { name: "포스트잇 활용", value: 23 },
  { name: "사진으로 기록", value: 19 },
  { name: "상관 없음", value: 22 },
  { name: "잘 모름", value: 8 },
];
const SUMMARY_CARDS = [
  { label: "전체 가입자 수", value: "1,247명" },
  { label: "오늘 신규 가입", value: "23명" },
  { label: "이번 달 가입", value: "312명" },
];

interface CrossGroupData {
  topBooks: { name: string; value: number }[];
  readingStyles: { name: string; value: number }[];
}

const CROSS_GROUP_DATA: Record<CrossGroup, CrossGroupData> = {
  "여성": {
    topBooks: [
      { name: "채식주의자", value: 52 },
      { name: "달러구트 꿈 백화점", value: 41 },
      { name: "아몬드", value: 38 },
      { name: "연을 쫓는 아이", value: 31 },
      { name: "82년생 김지영", value: 28 },
    ],
    readingStyles: [
      { name: "포스트잇 활용", value: 187 },
      { name: "직접 메모", value: 143 },
      { name: "상관 없음", value: 98 },
      { name: "사진으로 기록", value: 87 },
      { name: "잘 모름", value: 32 },
    ],
  },
  "남성": {
    topBooks: [
      { name: "해리포터와 마법사의 돌", value: 21 },
      { name: "채식주의자", value: 18 },
      { name: "사피엔스", value: 16 },
      { name: "아몬드", value: 14 },
      { name: "데미안", value: 12 },
    ],
    readingStyles: [
      { name: "상관 없음", value: 63 },
      { name: "직접 메모", value: 51 },
      { name: "포스트잇 활용", value: 38 },
      { name: "사진으로 기록", value: 22 },
      { name: "잘 모름", value: 15 },
    ],
  },
  "선택 안함": {
    topBooks: [
      { name: "아몬드", value: 7 },
      { name: "어린왕자", value: 5 },
      { name: "채식주의자", value: 4 },
      { name: "노르웨이의 숲", value: 3 },
      { name: "달러구트 꿈 백화점", value: 3 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 18 },
      { name: "잘 모름", value: 14 },
      { name: "상관 없음", value: 12 },
      { name: "포스트잇 활용", value: 9 },
      { name: "사진으로 기록", value: 6 },
    ],
  },
  "10대": {
    topBooks: [
      { name: "해리포터와 마법사의 돌", value: 31 },
      { name: "아몬드", value: 24 },
      { name: "어린왕자", value: 19 },
      { name: "채식주의자", value: 12 },
      { name: "데미안", value: 10 },
    ],
    readingStyles: [
      { name: "사진으로 기록", value: 28 },
      { name: "잘 모름", value: 22 },
      { name: "포스트잇 활용", value: 18 },
      { name: "상관 없음", value: 16 },
      { name: "직접 메모", value: 9 },
    ],
  },
  "20대": {
    topBooks: [
      { name: "채식주의자", value: 89 },
      { name: "달러구트 꿈 백화점", value: 74 },
      { name: "아몬드", value: 61 },
      { name: "82년생 김지영", value: 52 },
      { name: "연을 쫓는 아이", value: 44 },
    ],
    readingStyles: [
      { name: "포스트잇 활용", value: 134 },
      { name: "직접 메모", value: 98 },
      { name: "상관 없음", value: 87 },
      { name: "사진으로 기록", value: 64 },
      { name: "잘 모름", value: 31 },
    ],
  },
  "30대": {
    topBooks: [
      { name: "연을 쫓는 아이", value: 44 },
      { name: "채식주의자", value: 38 },
      { name: "달러구트 꿈 백화점", value: 32 },
      { name: "사피엔스", value: 27 },
      { name: "아몬드", value: 24 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 72 },
      { name: "포스트잇 활용", value: 58 },
      { name: "상관 없음", value: 41 },
      { name: "사진으로 기록", value: 29 },
      { name: "잘 모름", value: 12 },
    ],
  },
  "40대": {
    topBooks: [
      { name: "달러구트 꿈 백화점", value: 19 },
      { name: "채식주의자", value: 16 },
      { name: "노르웨이의 숲", value: 13 },
      { name: "사피엔스", value: 11 },
      { name: "연을 쫓는 아이", value: 9 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 31 },
      { name: "상관 없음", value: 24 },
      { name: "포스트잇 활용", value: 19 },
      { name: "사진으로 기록", value: 11 },
      { name: "잘 모름", value: 6 },
    ],
  },
  "50대 이상": {
    topBooks: [
      { name: "노르웨이의 숲", value: 11 },
      { name: "사피엔스", value: 9 },
      { name: "달러구트 꿈 백화점", value: 8 },
      { name: "채식주의자", value: 6 },
      { name: "어린왕자", value: 5 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 22 },
      { name: "상관 없음", value: 17 },
      { name: "포스트잇 활용", value: 12 },
      { name: "사진으로 기록", value: 7 },
      { name: "잘 모름", value: 4 },
    ],
  },
};

const GENDER_OPTIONS: CrossGroup[] = ["여성", "남성", "선택 안함"];
const AGE_OPTIONS: CrossGroup[] = ["10대", "20대", "30대", "40대", "50대 이상"];

export default function UserStats() {
  const [period, setPeriod] = useState<PeriodTab>("일간");
  const [crossGroup, setCrossGroup] = useState<CrossGroup>("여성");

  const chartData = PERIOD_DATA[period];
  const crossData = CROSS_GROUP_DATA[crossGroup];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#242322]">유저 통계</h1>
        <p className="text-[#858481] mt-1">가입자 현황과 온보딩 응답을 분석합니다</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {SUMMARY_CARDS.map((card) => (
          <div key={card.label} className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
            <p className="text-sm text-[#858481]">{card.label}</p>
            <p className="text-3xl font-bold text-[#242322] mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* 섹션 1: 가입자 추이 */}
      <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#242322]">가입자 수 추이</h2>
          <div className="flex gap-1 bg-[#f4f3f1] rounded-[10px] p-1">
            {(["일간", "주간", "월간", "연간"] as PeriodTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setPeriod(tab)}
                className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                  period === tab ? "bg-[#ff7618] text-white" : "text-[#858481] hover:text-[#242322]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0eeec" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#858481" }} />
            <YAxis tick={{ fontSize: 12, fill: "#858481" }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e1df", fontSize: 13 }} />
            <Line type="monotone" dataKey="가입자수" stroke="#ff7618" strokeWidth={2} dot={{ fill: "#ff7618", r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 섹션 2: 온보딩 결과 통계 */}
      <h2 className="text-lg font-bold text-[#242322] mb-4">온보딩 결과 통계</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
          <h3 className="text-base font-semibold text-[#242322] mb-4">성별 분포</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={GENDER_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {GENDER_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
          <h3 className="text-base font-semibold text-[#242322] mb-4">연령대 분포</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={AGE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eeec" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#858481" }} />
              <YAxis tick={{ fontSize: 12, fill: "#858481" }} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="value" fill="#ff7618" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
          <h3 className="text-base font-semibold text-[#242322] mb-4">인생 책 TOP 5</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={BOOK_TOP5} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eeec" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#858481" }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#858481" }} width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#ff7618" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
          <h3 className="text-base font-semibold text-[#242322] mb-4">독서 스타일 분포</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={READING_STYLE} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eeec" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#858481" }} />
              <YAxis tick={{ fontSize: 12, fill: "#858481" }} unit="명" />
              <Tooltip />
              <Bar dataKey="value" fill="#ffd5b5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 섹션 3: 교차 통계 */}
      <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#242322]">교차 통계</h2>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#858481] px-1">성별</p>
              <div className="flex gap-1 bg-[#f4f3f1] rounded-[10px] p-1">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setCrossGroup(g)}
                    className={`px-3 py-1.5 rounded-[8px] text-sm font-medium transition-colors ${
                      crossGroup === g ? "bg-[#ff7618] text-white" : "text-[#858481] hover:text-[#242322]"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-px h-10 bg-[#e2e1df]" />
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#858481] px-1">연령대</p>
              <div className="flex gap-1 bg-[#f4f3f1] rounded-[10px] p-1">
                {AGE_OPTIONS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setCrossGroup(a)}
                    className={`px-3 py-1.5 rounded-[8px] text-sm font-medium transition-colors ${
                      crossGroup === a ? "bg-[#ff7618] text-white" : "text-[#858481] hover:text-[#242322]"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-[#858481] mb-5">
          <span className="font-semibold text-[#242322]">{crossGroup}</span> 유저의 온보딩 응답
        </p>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-[#242322] mb-3">인생 책 TOP 5</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={crossData.topBooks} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eeec" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#858481" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#858481" }} width={130} />
                <Tooltip />
                <Bar dataKey="value" fill="#ff7618" radius={[0, 6, 6, 0]} name="선택 인원" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#242322] mb-3">독서 스타일</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={crossData.readingStyles} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eeec" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#858481" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#858481" }} width={110} />
                <Tooltip />
                <Bar dataKey="value" fill="#ffd5b5" radius={[0, 6, 6, 0]} name="선택 인원" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
