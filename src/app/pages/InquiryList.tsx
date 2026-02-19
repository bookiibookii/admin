import { useState } from "react";
import { Link } from "react-router";
import { Search } from "lucide-react";
import { Input } from "../components/ui/input";

export default function InquiryList() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const inquiries = [
    { id: 1, author: "noshel", title: "독서 카드 사용법", date: "2024.11.29" },
    { id: 2, author: "bookworm", title: "책 배송 관련 문의드립니다.", date: "2024.11.29" },
    { id: 3, author: "user456", title: "그룹 탈퇴는 어떻게 하나요?", date: "2024.11.28" },
    { id: 4, author: "reader_a", title: "매너온도 시스템 문의", date: "2024.11.28" },
    { id: 5, author: "bookclub", title: "앱 오류 신고", date: "2024.11.27" },
    { id: 6, author: "member123", title: "회원 탈퇴 문의", date: "2024.11.26" },
    { id: 7, author: "user789", title: "독서 카드 교환 방법", date: "2024.11.26" },
    { id: 8, author: "reader_b", title: "알림 설정 변경 문의", date: "2024.11.25" },
  ];

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      searchQuery === "" ||
      inquiry.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#242322]">문의 관리</h1>
        <p className="text-[#858481] mt-1">사용자 문의를 확인하고 답변하세요</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df] mb-6">
        <div>
          <label className="text-sm font-medium text-[#242322] mb-2 block">검색</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858481]" />
            <Input
              type="text"
              placeholder="닉네임 또는 제목 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#f4f3f1] border-[#e2e1df] rounded-[10px]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[20px] border border-[#e2e1df] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#e2e1df]">
          <p className="text-sm text-[#858481]">
            총 <span className="font-semibold text-[#242322]">{filteredInquiries.length}</span>건
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e1df] bg-[#f4f3f1]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">문의 ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">문의자</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">제목</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">접수일</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors">
                  <td className="py-3 px-4 text-sm text-[#242322] font-medium">#{inquiry.id}</td>
                  <td className="py-3 px-4 text-sm text-[#242322]">{inquiry.author}</td>
                  <td className="py-3 px-4 text-sm text-[#242322]">{inquiry.title}</td>
                  <td className="py-3 px-4 text-sm text-[#858481]">{inquiry.date}</td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/admin/inquiries/${inquiry.id}`}
                      className="text-sm text-[#ff7618] hover:underline"
                    >
                      상세보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}