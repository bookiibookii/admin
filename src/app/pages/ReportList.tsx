import { useState } from "react";
import { Link } from "react-router";
import { Search } from "lucide-react";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function ReportList() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const reports = [
    { id: 1, reporter: "noshel", target: "user123", group: "괴테는 모든 것을 말했다", type: "욕설/비방", date: "2024.11.29" },
    { id: 2, reporter: "bookworm", target: "reader99", group: "해리포터 읽기 모임", type: "스팸/광고", date: "2024.11.28" },
    { id: 3, reporter: "user456", target: "member789", group: "경제 서적 교환", type: "책 미발송/노쇼/연락두절", date: "2024.11.28" },
    { id: 4, reporter: "reader_a", target: "member_b", group: "SF 소설 모임", type: "책 파손/낙서", date: "2024.11.27" },
    { id: 5, reporter: "bookclub", target: "user_x", group: "고전 문학 읽기", type: "기타", date: "2024.11.27" },
    { id: 6, reporter: "reader123", target: "user999", group: "자기계발서 교환", type: "욕설/비방", date: "2024.11.26" },
    { id: 7, reporter: "member_c", target: "user_d", group: "추리소설 읽기", type: "스팸/광고", date: "2024.11.26" },
    { id: 8, reporter: "user_e", target: "member_f", group: "역사서 모임", type: "책 미발송/노쇼/연락두절", date: "2024.11.25" },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesSearch =
      searchQuery === "" ||
      report.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.group.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#242322]">신고 관리</h1>
        <p className="text-[#858481] mt-1">사용자 신고 목록을 확인하고 처리하세요</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df] mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[#242322] mb-2 block">신고 유형</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-[#f4f3f1] border-[#e2e1df] rounded-[10px]">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="욕설/비방">욕설/비방</SelectItem>
                <SelectItem value="스팸/광고">스팸/광고</SelectItem>
                <SelectItem value="책 미발송/노쇼/연락두절">책 미발송/노쇼/연락두절</SelectItem>
                <SelectItem value="책 파손/낙서">책 파손/낙서</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-[#242322] mb-2 block">검색</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858481]" />
              <Input
                type="text"
                placeholder="닉네임 또는 그룹명 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#f4f3f1] border-[#e2e1df] rounded-[10px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[20px] border border-[#e2e1df] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#e2e1df]">
          <p className="text-sm text-[#858481]">
            총 <span className="font-semibold text-[#242322]">{filteredReports.length}</span>건
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e1df] bg-[#f4f3f1]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">신고 ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">신고자</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">신고 대상</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">그룹명</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">신고 유형</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">접수일</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors">
                  <td className="py-3 px-4 text-sm text-[#242322] font-medium">#{report.id}</td>
                  <td className="py-3 px-4 text-sm text-[#242322]">{report.reporter}</td>
                  <td className="py-3 px-4 text-sm text-[#242322]">{report.target}</td>
                  <td className="py-3 px-4 text-sm text-[#242322]">{report.group}</td>
                  <td className="py-3 px-4 text-sm text-[#5e5d5b]">{report.type}</td>
                  <td className="py-3 px-4 text-sm text-[#858481]">{report.date}</td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/admin/reports/${report.id}`}
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