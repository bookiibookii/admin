import { Link } from "react-router";
import { AlertCircle, MessageSquare, Bell, ArrowRight } from "lucide-react";

export default function Dashboard() {
  // Mock data
  const recentReports = [
    { id: 1, reporter: "noshel", target: "user123", group: "괴테는 모든 것을 말했다", type: "욕설/비방", date: "2024.11.29" },
    { id: 2, reporter: "bookworm", target: "reader99", group: "해리포터 읽기 모임", type: "스팸/광고", date: "2024.11.28" },
    { id: 3, reporter: "user456", target: "member789", group: "경제 서적 교환", type: "책 미발송/노쇼/연락두절", date: "2024.11.28" },
    { id: 4, reporter: "reader_a", target: "member_b", group: "SF 소설 모임", type: "책 파손/낙서", date: "2024.11.27" },
    { id: 5, reporter: "bookclub", target: "user_x", group: "고전 문학 읽기", type: "기타", date: "2024.11.27" },
  ];

  const recentInquiries = [
    { id: 1, author: "noshel", title: "독서 카드 사용법", date: "2024.11.29" },
    { id: 2, author: "bookworm", title: "책 배송 관련 문의드립니다.", date: "2024.11.29" },
    { id: 3, author: "user456", title: "그룹 탈퇴는 어떻게 하나요?", date: "2024.11.28" },
    { id: 4, author: "reader_a", title: "매너온도 시스템 문의", date: "2024.11.28" },
    { id: 5, author: "bookclub", title: "앱 오류 신고", date: "2024.11.27" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#242322]">대시보드</h1>
        <p className="text-[#858481] mt-1">부키부키 관리자 현황</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#ff7618]/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-[#ff7618]" />
            </div>
            <h3 className="font-semibold text-[#242322]">신규 신고</h3>
          </div>
          <p className="text-3xl font-bold text-[#242322]">5건</p>
          <p className="text-sm text-[#858481] mt-1">최근 접수</p>
        </div>

        <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#ff7618]/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#ff7618]" />
            </div>
            <h3 className="font-semibold text-[#242322]">신규 문의</h3>
          </div>
          <p className="text-3xl font-bold text-[#242322]">5건</p>
          <p className="text-sm text-[#858481] mt-1">최근 접수</p>
        </div>

        <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#ff7618]/10 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#ff7618]" />
            </div>
            <h3 className="font-semibold text-[#242322]">최근 공지사항</h3>
          </div>
          <p className="text-sm font-medium text-[#242322] line-clamp-1">12월 업데이트 안내</p>
          <p className="text-sm text-[#858481] mt-1">2024.11.29</p>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df] mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#242322]">최근 신고</h2>
          <Link
            to="/admin/reports"
            className="flex items-center gap-1 text-sm text-[#ff7618] hover:underline"
          >
            전체보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e1df]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">신고 ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">신고자</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">신고 대상</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">그룹명</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">신고 유형</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">접수일</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id} className="border-b border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors">
                  <td className="py-3 px-4 text-sm text-[#242322]">#{report.id}</td>
                  <td className="py-3 px-4 text-sm text-[#242322]">{report.reporter}</td>
                  <td className="py-3 px-4 text-sm text-[#242322]">{report.target}</td>
                  <td className="py-3 px-4 text-sm text-[#242322]">{report.group}</td>
                  <td className="py-3 px-4 text-sm text-[#5e5d5b]">{report.type}</td>
                  <td className="py-3 px-4 text-sm text-[#858481]">{report.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#242322]">최근 문의</h2>
          <Link
            to="/admin/inquiries"
            className="flex items-center gap-1 text-sm text-[#ff7618] hover:underline"
          >
            전체보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e1df]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">문의 ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">문의자</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">제목</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">접수일</th>
              </tr>
            </thead>
            <tbody>
              {recentInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors">
                  <td className="py-3 px-4 text-sm text-[#242322]">#{inquiry.id}</td>
                  <td className="py-3 px-4 text-sm text-[#242322]">{inquiry.author}</td>
                  <td className="py-3 px-4 text-sm text-[#242322]">{inquiry.title}</td>
                  <td className="py-3 px-4 text-sm text-[#858481]">{inquiry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}