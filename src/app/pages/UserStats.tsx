import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

type PeriodTab = "일간" | "주간" | "월간" | "연간";
type CrossTab = "성별 × 인생 책" | "연령대 × 인생 책" | "연령대 × 독서 스타일";

function generateDailyData() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return {
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      가입자수: Math.floor(Math.random() * 26) + 5,
    };
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

const GENDER_DATA = [
  { name: "여성", value: 72, color: "#ff7618" },
  { name: "남성", value: 24, color: "#ffd5b5" },
  { name: "기타", value: 4, color: "#ffe8d6" },
];

const AGE_DATA = [
  { name: "10대", value: 8 },
  { name: "20대", value: 61 },
  { name: "30대", value: 22 },
  { name: "40대 이상", value: 9 },
];

const BOOK_TOP5 = [
  { name: "채식주의자", value: 89 },
  { name: "달러구트 꿈 백화점", value: 76 },
  { name: "아몬드", value: 65 },
  { name: "해리포터", value: 54 },
  { name: "연을 쫓는 아이", value: 48 },
];

const READING_STYLE = [
  { name: "빠르게 읽기", value: 31 },
  { name: "천천히 음미", value: 45 },
  { name: "필사하며 읽기", value: 12 },
  { name: "밑줄 치며 읽기", value: 12 },
];

const CROSS_DATA: Record<CrossTab, { groups: string[]; items: { name: string; [key: string]: number | string }[] }> = {
  "성별 × 인생 책": {
    groups: ["여성", "남성"],
    items: [
      { name: "채식주의자", 여성: 65, 남성: 24 },
      { name: "달러구트", 여성: 52, 남성: 24 },
      { name: "아몬드", 여성: 41, 남성: 24 },
      { name: "해리포터", 여성: 28, 남성: 26 },
      { name: "연을 쫓는 아이", 여성: 30, 남성: 18 },
    ],
  },
  "연령대 × 인생 책": {
    groups: ["10대", "20대", "30대", "40대+"],
    items: [
      { name: "채식주의자", "10대": 5, "20대": 55, "30대": 20, "40대+": 9 },
      { name: "달러구트", "10대": 8, "20대": 48, "30대": 15, "40대+": 5 },
      { name: "아몬드", "10대": 12, "20대": 38, "30대": 10, "40대+": 5 },
      { name: "해리포터", "10대": 20, "20대": 22, "30대": 9, "40대+": 3 },
      { name: "연을 쫓는 아이", "10대": 6, "20대": 28, "30대": 10, "40대+": 4 },
    ],
  },
  "연령대 × 독서 스타일": {
    groups: ["10대", "20대", "30대", "40대+"],
    items: [
      { name: "빠르게 읽기", "10대": 15, "20대": 38, "30대": 28, "40대+": 19 },
      { name: "천천히 음미", "10대": 8, "20대": 42, "30대": 30, "40대+": 20 },
      { name: "필사하며 읽기", "10대": 5, "20대": 10, "30대": 12, "40대+": 8 },
      { name: "밑줄 치며 읽기", "10대": 6, "20대": 10, "30대": 14, "40대+": 9 },
    ],
  },
};

const CROSS_COLORS = ["#ff7618", "#ffd5b5", "#ffe8d6", "#ffb37c"];

const SUMMARY_CARDS = [
  { label: "전체 가입자 수", value: "1,247명" },
  { label: "오늘 신규 가입", value: "23명" },
  { label: "이번 달 가입", value: "312명" },
];

const PERIOD_DATA: Record<PeriodTab, typeof DAILY_DATA> = {
  일간: DAILY_DATA,
  주간: WEEKLY_DATA,
  월간: MONTHLY_DATA,
  연간: YEARLY_DATA,
};

export default function UserStats() {
  const [period, setPeriod] = useState<PeriodTab>("일간");
  const [crossTab, setCrossTab] = useState<CrossTab>("성별 × 인생 책");

  const chartData = PERIOD_DATA[period];
  const cross = CROSS_DATA[crossTab];

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
            <Tooltip
              contentStyle={{ borderRadius: 10, border: "1px solid #e2e1df", fontSize: 13 }}
            />
            <Line
              type="monotone"
              dataKey="가입자수"
              stroke="#ff7618"
              strokeWidth={2}
              dot={{ fill: "#ff7618", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 섹션 2: 온보딩 결과 통계 */}
      <h2 className="text-lg font-bold text-[#242322] mb-4">온보딩 결과 통계</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* 성별 분포 */}
        <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
          <h3 className="text-base font-semibold text-[#242322] mb-4">성별 분포</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={GENDER_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                >
                  {GENDER_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 연령대 분포 */}
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

        {/* 인생 책 TOP 5 */}
        <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
          <h3 className="text-base font-semibold text-[#242322] mb-4">인생 책 TOP 5</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={BOOK_TOP5}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eeec" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#858481" }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#858481" }} width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#ff7618" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 독서 스타일 분포 */}
        <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
          <h3 className="text-base font-semibold text-[#242322] mb-4">독서 스타일 분포</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={READING_STYLE} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eeec" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#858481" }} />
              <YAxis tick={{ fontSize: 12, fill: "#858481" }} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="value" fill="#ffd5b5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 섹션 3: 교차 통계 */}
      <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#242322]">교차 통계</h2>
          <select
            value={crossTab}
            onChange={(e) => setCrossTab(e.target.value as CrossTab)}
            className="text-sm border border-[#e2e1df] rounded-[10px] px-3 py-2 bg-white text-[#242322] focus:outline-none focus:border-[#ff7618]"
          >
            {(Object.keys(CROSS_DATA) as CrossTab[]).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={cross.items} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0eeec" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#858481" }} />
            <YAxis tick={{ fontSize: 12, fill: "#858481" }} />
            <Tooltip />
            <Legend />
            {cross.groups.map((group, i) => (
              <Bar key={group} dataKey={group} fill={CROSS_COLORS[i % CROSS_COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
