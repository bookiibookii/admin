import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

type PeriodTab = "일간" | "주간" | "월간" | "연간";
type CrossGroup =
  | "여성" | "남성" | "선택 안함"
  | "10대" | "20대" | "30대" | "40대" | "50대 이상"
  | "여성_10대" | "여성_20대" | "여성_30대" | "여성_40대" | "여성_50대 이상"
  | "남성_10대" | "남성_20대" | "남성_30대" | "남성_40대" | "남성_50대 이상"
  | "선택 안함_10대" | "선택 안함_20대" | "선택 안함_30대" | "선택 안함_40대" | "선택 안함_50대 이상";

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
  { name: "50대 이상", value: 5 },
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
  // 단일 키
  "여성": {
    topBooks: [
      { name: "채식주의자", value: 52 }, { name: "달러구트 꿈 백화점", value: 41 },
      { name: "아몬드", value: 38 }, { name: "연을 쫓는 아이", value: 31 }, { name: "82년생 김지영", value: 28 },
    ],
    readingStyles: [
      { name: "포스트잇 활용", value: 187 }, { name: "직접 메모", value: 143 },
      { name: "상관 없음", value: 98 }, { name: "사진으로 기록", value: 87 }, { name: "잘 모름", value: 32 },
    ],
  },
  "남성": {
    topBooks: [
      { name: "해리포터와 마법사의 돌", value: 21 }, { name: "채식주의자", value: 18 },
      { name: "사피엔스", value: 16 }, { name: "아몬드", value: 14 }, { name: "데미안", value: 12 },
    ],
    readingStyles: [
      { name: "상관 없음", value: 63 }, { name: "직접 메모", value: 51 },
      { name: "포스트잇 활용", value: 38 }, { name: "사진으로 기록", value: 22 }, { name: "잘 모름", value: 15 },
    ],
  },
  "선택 안함": {
    topBooks: [
      { name: "아몬드", value: 7 }, { name: "어린왕자", value: 5 },
      { name: "채식주의자", value: 4 }, { name: "노르웨이의 숲", value: 3 }, { name: "달러구트 꿈 백화점", value: 3 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 18 }, { name: "잘 모름", value: 14 },
      { name: "상관 없음", value: 12 }, { name: "포스트잇 활용", value: 9 }, { name: "사진으로 기록", value: 6 },
    ],
  },
  "10대": {
    topBooks: [
      { name: "해리포터와 마법사의 돌", value: 31 }, { name: "아몬드", value: 24 },
      { name: "어린왕자", value: 19 }, { name: "채식주의자", value: 12 }, { name: "데미안", value: 10 },
    ],
    readingStyles: [
      { name: "사진으로 기록", value: 28 }, { name: "잘 모름", value: 22 },
      { name: "포스트잇 활용", value: 18 }, { name: "상관 없음", value: 16 }, { name: "직접 메모", value: 9 },
    ],
  },
  "20대": {
    topBooks: [
      { name: "채식주의자", value: 89 }, { name: "달러구트 꿈 백화점", value: 74 },
      { name: "아몬드", value: 61 }, { name: "82년생 김지영", value: 52 }, { name: "연을 쫓는 아이", value: 44 },
    ],
    readingStyles: [
      { name: "포스트잇 활용", value: 134 }, { name: "직접 메모", value: 98 },
      { name: "상관 없음", value: 87 }, { name: "사진으로 기록", value: 64 }, { name: "잘 모름", value: 31 },
    ],
  },
  "30대": {
    topBooks: [
      { name: "연을 쫓는 아이", value: 44 }, { name: "채식주의자", value: 38 },
      { name: "달러구트 꿈 백화점", value: 32 }, { name: "사피엔스", value: 27 }, { name: "아몬드", value: 24 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 72 }, { name: "포스트잇 활용", value: 58 },
      { name: "상관 없음", value: 41 }, { name: "사진으로 기록", value: 29 }, { name: "잘 모름", value: 12 },
    ],
  },
  "40대": {
    topBooks: [
      { name: "달러구트 꿈 백화점", value: 19 }, { name: "채식주의자", value: 16 },
      { name: "노르웨이의 숲", value: 13 }, { name: "사피엔스", value: 11 }, { name: "연을 쫓는 아이", value: 9 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 31 }, { name: "상관 없음", value: 24 },
      { name: "포스트잇 활용", value: 19 }, { name: "사진으로 기록", value: 11 }, { name: "잘 모름", value: 6 },
    ],
  },
  "50대 이상": {
    topBooks: [
      { name: "노르웨이의 숲", value: 11 }, { name: "사피엔스", value: 9 },
      { name: "달러구트 꿈 백화점", value: 8 }, { name: "채식주의자", value: 6 }, { name: "어린왕자", value: 5 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 22 }, { name: "상관 없음", value: 17 },
      { name: "포스트잇 활용", value: 12 }, { name: "사진으로 기록", value: 7 }, { name: "잘 모름", value: 4 },
    ],
  },
  // 여성 조합
  "여성_10대": {
    topBooks: [
      { name: "아몬드", value: 18 }, { name: "해리포터와 마법사의 돌", value: 14 },
      { name: "채식주의자", value: 9 }, { name: "어린왕자", value: 7 }, { name: "달러구트 꿈 백화점", value: 5 },
    ],
    readingStyles: [
      { name: "사진으로 기록", value: 21 }, { name: "포스트잇 활용", value: 16 },
      { name: "잘 모름", value: 12 }, { name: "상관 없음", value: 9 }, { name: "직접 메모", value: 5 },
    ],
  },
  "여성_20대": {
    topBooks: [
      { name: "채식주의자", value: 71 }, { name: "달러구트 꿈 백화점", value: 58 },
      { name: "아몬드", value: 49 }, { name: "82년생 김지영", value: 41 }, { name: "연을 쫓는 아이", value: 35 },
    ],
    readingStyles: [
      { name: "포스트잇 활용", value: 112 }, { name: "직접 메모", value: 84 },
      { name: "상관 없음", value: 67 }, { name: "사진으로 기록", value: 53 }, { name: "잘 모름", value: 21 },
    ],
  },
  "여성_30대": {
    topBooks: [
      { name: "연을 쫓는 아이", value: 36 }, { name: "채식주의자", value: 29 },
      { name: "달러구트 꿈 백화점", value: 24 }, { name: "아몬드", value: 18 }, { name: "82년생 김지영", value: 14 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 58 }, { name: "포스트잇 활용", value: 44 },
      { name: "상관 없음", value: 31 }, { name: "사진으로 기록", value: 22 }, { name: "잘 모름", value: 8 },
    ],
  },
  "여성_40대": {
    topBooks: [
      { name: "달러구트 꿈 백화점", value: 14 }, { name: "채식주의자", value: 11 },
      { name: "연을 쫓는 아이", value: 8 }, { name: "아몬드", value: 6 }, { name: "노르웨이의 숲", value: 4 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 24 }, { name: "상관 없음", value: 17 },
      { name: "포스트잇 활용", value: 13 }, { name: "사진으로 기록", value: 7 }, { name: "잘 모름", value: 3 },
    ],
  },
  "여성_50대 이상": {
    topBooks: [
      { name: "달러구트 꿈 백화점", value: 7 }, { name: "채식주의자", value: 5 },
      { name: "노르웨이의 숲", value: 4 }, { name: "연을 쫓는 아이", value: 3 }, { name: "어린왕자", value: 2 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 14 }, { name: "상관 없음", value: 9 },
      { name: "포스트잇 활용", value: 7 }, { name: "사진으로 기록", value: 4 }, { name: "잘 모름", value: 2 },
    ],
  },
  // 남성 조합
  "남성_10대": {
    topBooks: [
      { name: "해리포터와 마법사의 돌", value: 19 }, { name: "아몬드", value: 11 },
      { name: "데미안", value: 8 }, { name: "어린왕자", value: 6 }, { name: "채식주의자", value: 4 },
    ],
    readingStyles: [
      { name: "잘 모름", value: 17 }, { name: "상관 없음", value: 14 },
      { name: "사진으로 기록", value: 9 }, { name: "포스트잇 활용", value: 6 }, { name: "직접 메모", value: 3 },
    ],
  },
  "남성_20대": {
    topBooks: [
      { name: "채식주의자", value: 16 }, { name: "사피엔스", value: 13 },
      { name: "해리포터와 마법사의 돌", value: 11 }, { name: "아몬드", value: 9 }, { name: "데미안", value: 7 },
    ],
    readingStyles: [
      { name: "상관 없음", value: 39 }, { name: "직접 메모", value: 28 },
      { name: "포스트잇 활용", value: 19 }, { name: "사진으로 기록", value: 12 }, { name: "잘 모름", value: 8 },
    ],
  },
  "남성_30대": {
    topBooks: [
      { name: "사피엔스", value: 14 }, { name: "채식주의자", value: 10 },
      { name: "연을 쫓는 아이", value: 7 }, { name: "노르웨이의 숲", value: 6 }, { name: "데미안", value: 4 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 22 }, { name: "상관 없음", value: 18 },
      { name: "포스트잇 활용", value: 12 }, { name: "사진으로 기록", value: 7 }, { name: "잘 모름", value: 4 },
    ],
  },
  "남성_40대": {
    topBooks: [
      { name: "사피엔스", value: 8 }, { name: "노르웨이의 숲", value: 6 },
      { name: "채식주의자", value: 4 }, { name: "데미안", value: 3 }, { name: "연을 쫓는 아이", value: 2 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 13 }, { name: "상관 없음", value: 10 },
      { name: "포스트잇 활용", value: 6 }, { name: "잘 모름", value: 3 }, { name: "사진으로 기록", value: 2 },
    ],
  },
  "남성_50대 이상": {
    topBooks: [
      { name: "사피엔스", value: 6 }, { name: "노르웨이의 숲", value: 5 },
      { name: "채식주의자", value: 3 }, { name: "데미안", value: 2 }, { name: "달러구트 꿈 백화점", value: 2 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 10 }, { name: "상관 없음", value: 8 },
      { name: "포스트잇 활용", value: 5 }, { name: "잘 모름", value: 3 }, { name: "사진으로 기록", value: 2 },
    ],
  },
  // 선택 안함 조합 (샘플 수 적음 — 일부만 정의, 나머지는 키 없으면 데이터 부족 안내)
  "선택 안함_10대": {
    topBooks: [
      { name: "어린왕자", value: 4 }, { name: "해리포터와 마법사의 돌", value: 3 },
      { name: "아몬드", value: 2 }, { name: "데미안", value: 2 }, { name: "채식주의자", value: 1 },
    ],
    readingStyles: [
      { name: "잘 모름", value: 5 }, { name: "상관 없음", value: 4 },
      { name: "사진으로 기록", value: 3 }, { name: "직접 메모", value: 2 }, { name: "포스트잇 활용", value: 1 },
    ],
  },
  "선택 안함_20대": {
    topBooks: [
      { name: "아몬드", value: 5 }, { name: "채식주의자", value: 3 },
      { name: "어린왕자", value: 2 }, { name: "달러구트 꿈 백화점", value: 2 }, { name: "노르웨이의 숲", value: 1 },
    ],
    readingStyles: [
      { name: "잘 모름", value: 8 }, { name: "상관 없음", value: 6 },
      { name: "직접 메모", value: 4 }, { name: "포스트잇 활용", value: 3 }, { name: "사진으로 기록", value: 2 },
    ],
  },
  "선택 안함_30대": {
    topBooks: [
      { name: "채식주의자", value: 3 }, { name: "노르웨이의 숲", value: 3 },
      { name: "달러구트 꿈 백화점", value: 2 }, { name: "아몬드", value: 2 }, { name: "어린왕자", value: 1 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 5 }, { name: "상관 없음", value: 4 },
      { name: "잘 모름", value: 3 }, { name: "포스트잇 활용", value: 2 }, { name: "사진으로 기록", value: 2 },
    ],
  },
  "선택 안함_40대": {
    topBooks: [
      { name: "노르웨이의 숲", value: 3 }, { name: "사피엔스", value: 2 },
      { name: "채식주의자", value: 2 }, { name: "달러구트 꿈 백화점", value: 1 }, { name: "데미안", value: 1 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 4 }, { name: "상관 없음", value: 3 },
      { name: "잘 모름", value: 2 }, { name: "포스트잇 활용", value: 2 }, { name: "사진으로 기록", value: 1 },
    ],
  },
  "선택 안함_50대 이상": {
    topBooks: [
      { name: "노르웨이의 숲", value: 2 }, { name: "사피엔스", value: 2 },
      { name: "달러구트 꿈 백화점", value: 1 }, { name: "어린왕자", value: 1 }, { name: "채식주의자", value: 1 },
    ],
    readingStyles: [
      { name: "직접 메모", value: 3 }, { name: "상관 없음", value: 2 },
      { name: "잘 모름", value: 2 }, { name: "포스트잇 활용", value: 1 }, { name: "사진으로 기록", value: 1 },
    ],
  },
};

const GENDER_OPTIONS = ["여성", "남성", "선택 안함"] as const;
const AGE_OPTIONS = ["10대", "20대", "30대", "40대", "50대 이상"] as const;

export default function UserStats() {
  const [period, setPeriod] = useState<PeriodTab>("일간");
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  const chartData = PERIOD_DATA[period];

  const handleGenderClick = (g: string) => {
    setSelectedGender((prev) => (prev === g ? null : g));
  };
  const handleAgeClick = (a: string) => {
    setSelectedAge((prev) => (prev === a ? null : a));
  };

  const crossKey: string | null = (() => {
    if (selectedGender && selectedAge) {
      const combinedKey = `${selectedGender}_${selectedAge}`;
      return combinedKey in CROSS_GROUP_DATA ? combinedKey : null;
    }
    if (selectedGender) return selectedGender;
    if (selectedAge) return selectedAge;
    return null;
  })();

  const crossData = crossKey ? CROSS_GROUP_DATA[crossKey as CrossGroup] : null;

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
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#242322] mb-1">교차 통계</h2>
          <p className="text-sm text-[#858481]">성별·연령대를 각각 0~1개 선택해 조합된 통계를 확인하세요</p>
        </div>

        {/* 칩 선택 영역 */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-[#858481] px-1">성별</p>
            <div className="flex gap-1.5">
              {GENDER_OPTIONS.map((g) => (
                <button
                  key={g}
                  onClick={() => handleGenderClick(g)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    selectedGender === g
                      ? "bg-[#ff7618] text-white border-[#ff7618] shadow-sm"
                      : "bg-white text-[#5e5d5b] border-[#e2e1df] hover:border-[#ff7618] hover:text-[#ff7618]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px self-stretch bg-[#e2e1df] mx-1 mt-6" />

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-[#858481] px-1">연령대</p>
            <div className="flex gap-1.5">
              {AGE_OPTIONS.map((a) => (
                <button
                  key={a}
                  onClick={() => handleAgeClick(a)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    selectedAge === a
                      ? "bg-[#ff7618] text-white border-[#ff7618] shadow-sm"
                      : "bg-white text-[#5e5d5b] border-[#e2e1df] hover:border-[#ff7618] hover:text-[#ff7618]"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 선택 없음 */}
        {!selectedGender && !selectedAge && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-4xl mb-4">📊</p>
            <p className="text-[#858481] text-sm">성별 또는 연령대를 선택하면 통계가 표시됩니다</p>
          </div>
        )}

        {/* 선택 있음 */}
        {(selectedGender || selectedAge) && (() => {
          const subjectLabel = (() => {
            if (selectedGender && selectedAge) return `${selectedAge} ${selectedGender} 유저`;
            if (selectedGender) return `${selectedGender} 유저`;
            return `${selectedAge} 유저`;
          })();

          return (
            <>
              {/* 선택된 조건 태그 */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-sm text-[#858481]">선택된 조건:</span>
                {selectedGender && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#ff7618] text-white text-xs font-semibold rounded-full">
                    {selectedGender}
                    <button onClick={() => setSelectedGender(null)} className="ml-1 hover:opacity-70 leading-none">×</button>
                  </span>
                )}
                {selectedAge && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#ff7618] text-white text-xs font-semibold rounded-full">
                    {selectedAge}
                    <button onClick={() => setSelectedAge(null)} className="ml-1 hover:opacity-70 leading-none">×</button>
                  </span>
                )}
              </div>

              {/* 데이터 없음 */}
              {!crossData && (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-[#f4f3f1] rounded-[16px]">
                  <p className="text-2xl mb-3">🔍</p>
                  <p className="text-[#858481] text-sm">
                    <span className="font-semibold text-[#242322]">{subjectLabel}</span>의 데이터가 충분하지 않아요.
                  </p>
                </div>
              )}

              {/* 인사이트 카드 */}
              {crossData && (() => {
                const topBook = crossData.topBooks[0];
                const topStyle = crossData.readingStyles[0];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#fff8f4] border border-[#ffdcc3] rounded-[16px] p-5">
                      <p className="text-xs font-semibold text-[#ff7618] mb-3 uppercase tracking-wide">인생 책</p>
                      <p className="text-[#242322] font-medium leading-relaxed text-base">
                        {subjectLabel}의 경우, 인생 책으로{" "}
                        <span className="font-bold text-[#ff7618]">'{topBook.name}'</span>을(를) 가장 많이 골랐어요.
                      </p>
                      <p className="text-sm text-[#858481] mt-3">
                        선택 인원 <span className="font-semibold text-[#ff7618]">{topBook.value}명</span>
                      </p>
                      <div className="mt-4 space-y-2">
                        {crossData.topBooks.map((book, i) => (
                          <div key={book.name} className="flex items-center gap-3">
                            <span className={`text-xs font-bold w-5 text-center shrink-0 ${i === 0 ? "text-[#ff7618]" : "text-[#b0afad]"}`}>{i + 1}</span>
                            <div className="flex-1 flex items-center justify-between gap-2">
                              <span className="text-sm text-[#242322] truncate">{book.name}</span>
                              <span className="text-xs text-[#858481] shrink-0">{book.value}명</span>
                            </div>
                            <div className="w-20 h-1.5 bg-[#f4f3f1] rounded-full overflow-hidden shrink-0">
                              <div className="h-full bg-[#ff7618] rounded-full" style={{ width: `${(book.value / crossData.topBooks[0].value) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#f4f3f1] border border-[#e2e1df] rounded-[16px] p-5">
                      <p className="text-xs font-semibold text-[#858481] mb-3 uppercase tracking-wide">독서 스타일</p>
                      <p className="text-[#242322] font-medium leading-relaxed text-base">
                        {subjectLabel}의 경우, 독서 스타일로{" "}
                        <span className="font-bold text-[#242322]">'{topStyle.name}'</span>을(를) 가장 많이 선택했어요.
                      </p>
                      <p className="text-sm text-[#858481] mt-3">
                        선택 인원 <span className="font-semibold text-[#242322]">{topStyle.value}명</span>
                      </p>
                      <div className="mt-4 space-y-2">
                        {crossData.readingStyles.map((style, i) => (
                          <div key={style.name} className="flex items-center gap-3">
                            <span className={`text-xs font-bold w-5 text-center shrink-0 ${i === 0 ? "text-[#242322]" : "text-[#b0afad]"}`}>{i + 1}</span>
                            <div className="flex-1 flex items-center justify-between gap-2">
                              <span className="text-sm text-[#242322] truncate">{style.name}</span>
                              <span className="text-xs text-[#858481] shrink-0">{style.value}명</span>
                            </div>
                            <div className="w-20 h-1.5 bg-[#e2e1df] rounded-full overflow-hidden shrink-0">
                              <div className="h-full bg-[#858481] rounded-full" style={{ width: `${(style.value / crossData.readingStyles[0].value) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          );
        })()}
      </div>
    </div>
  );
}
