import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

type PeriodTab = "일간" | "주간" | "월간" | "연간";
type CrossBasis = "gender" | "ageGroup";
type CrossItem = "lifeBook" | "readingStyle";

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

const PERIOD_DATA: Record<PeriodTab, typeof DAILY_DATA> = {
  일간: DAILY_DATA,
  주간: WEEKLY_DATA,
  월간: MONTHLY_DATA,
  연간: YEARLY_DATA,
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

interface CrossEntry {
  group: string;
  top: string;
  count: number;
}

interface CrossResult {
  label: string;
  data: CrossEntry[];
}

const CROSS_DUMMY: Record<CrossBasis, Record<CrossItem, CrossResult>> = {
  gender: {
    lifeBook: {
      label: "성별 × 인생 책",
      data: [
        { group: "여성", top: "채식주의자", count: 52 },
        { group: "남성", top: "해리포터와 마법사의 돌", count: 21 },
        { group: "선택 안함", top: "아몬드", count: 7 },
      ],
    },
    readingStyle: {
      label: "성별 × 독서 스타일",
      data: [
        { group: "여성", top: "포스트잇 활용", count: 187 },
        { group: "남성", top: "상관 없음", count: 63 },
        { group: "선택 안함", top: "직접 메모", count: 18 },
      ],
    },
  },
  ageGroup: {
    lifeBook: {
      label: "연령대 × 인생 책",
      data: [
        { group: "10대", top: "해리포터와 마법사의 돌", count: 31 },
        { group: "20대", top: "채식주의자", count: 89 },
        { group: "30대", top: "연을 쫓는 아이", count: 44 },
        { group: "40대 이상", top: "달러구트 꿈 백화점", count: 19 },
      ],
    },
    readingStyle: {
      label: "연령대 × 독서 스타일",
      data: [
        { group: "10대", top: "사진으로 기록", count: 28 },
        { group: "20대", top: "포스트잇 활용", count: 134 },
        { group: "30대", top: "직접 메모", count: 72 },
        { group: "40대 이상", top: "직접 메모", count: 31 },
      ],
    },
  },
};

function buildInsightText(basis: CrossBasis, item: CrossItem, entry: CrossEntry): string {
  const isBook = item === "lifeBook";
  const suffix = isBook ? `인생 책으로 '${entry.top}'을(를) 가장 많이 골랐어요.` : `독서 스타일로 '${entry.top}'을(를) 가장 많이 선택했어요.`;
  if (basis === "gender") return `${entry.group} 유저의 경우, ${suffix}`;
  return `${entry.group}의 경우, ${suffix}`;
}

export default function UserStats() {
  const [period, setPeriod] = useState<PeriodTab>("일간");
  const [crossBasis, setCrossBasis] = useState<CrossBasis>("gender");
  const [crossItem, setCrossItem] = useState<CrossItem>("lifeBook");

  const chartData = PERIOD_DATA[period];
  const crossResult = CROSS_DUMMY[crossBasis][crossItem];

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
          <div className="flex gap-2">
            <select
              value={crossBasis}
              onChange={(e) => setCrossBasis(e.target.value as CrossBasis)}
              className="text-sm border border-[#e2e1df] rounded-[10px] px-3 py-2 bg-white text-[#242322] focus:outline-none focus:border-[#ff7618]"
            >
              <option value="gender">성별</option>
              <option value="ageGroup">연령대</option>
            </select>
            <select
              value={crossItem}
              onChange={(e) => setCrossItem(e.target.value as CrossItem)}
              className="text-sm border border-[#e2e1df] rounded-[10px] px-3 py-2 bg-white text-[#242322] focus:outline-none focus:border-[#ff7618]"
            >
              <option value="lifeBook">인생 책</option>
              <option value="readingStyle">독서 스타일</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-[#858481] mb-4">{crossResult.label}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crossResult.data.map((entry) => (
            <div
              key={entry.group}
              className="bg-[#fff8f4] border border-[#ffdcc3] rounded-[16px] p-5"
            >
              <p className="text-[#242322] font-medium leading-relaxed">
                {buildInsightText(crossBasis, crossItem, entry)}
              </p>
              <p className="text-sm text-[#858481] mt-2">
                선택 인원: <span className="font-semibold text-[#ff7618]">{entry.count}명</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
