import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchApi } from "../utils/api";
import { toast } from "sonner";

// 1. 서버 응답 데이터 구조에 맞춘 타입 정의
interface ReportItem {
  reportId: number;
  reporterNickname: string; // 신고자 닉네임
  targetNickname: string; // 피신고자 닉네임
  groupName: string; // 그룹명 (소모임 등)
  reportType: "ABUSE" | "SPAM" | "INAPPROPRIATE" | "OTHER"; // 예시 포함
  supportStatus: "PENDING" | "RESOLVED" | "REJECTED"; // 처리 상태
  resolvedAt: string | null; // 처리 일시
}

export default function ReportList() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({ totalElements: 0 }); // 전체 개수 표시용
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      // 💡 GET /api/admin/report
      const response = await fetchApi("/api/admin/report?page=0&size=10");
      const data = await response.json();

      if (data.isSuccess && data.result) {
        const rawContent = data.result.content || [];

        // 💡 reportId 기준 오름차순 정렬 (낮은 번호가 위로)
        const sortedReports = [...rawContent].sort(
          (a: ReportItem, b: ReportItem) => a.reportId - b.reportId,
        );

        setReports(sortedReports);
        setPageInfo({ totalElements: data.result.totalElements });
      } else {
        toast.error(data.message || "신고 목록을 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("신고 목록 조회 에러:", error);
      toast.error("서버 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // 상태 텍스트 및 색상 변환 함수
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-600";
      case "RESOLVED":
        return "bg-green-100 text-green-600";
      case "REJECTED":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getReportTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      ABUSE: "욕설/비방",
      SPAM: "스팸/광고",
      NO_SHOW: "책 미발송/노쇼/연락두절",
      DAMAGED_BOOK: "책 파손/낙서",
    };
    return types[type] || type; // 정의되지 않은 타입은 그대로 출력
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#242322]">신고 관리</h1>
        <p className="text-[#858481] mt-1">
          총{" "}
          <span className="font-semibold text-[#242322]">
            {pageInfo.totalElements}
          </span>
          건의 신고가 접수되었습니다.
        </p>
      </div>

      <div className="bg-white rounded-[20px] border border-[#e2e1df] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#f4f3f1] border-b border-[#e2e1df]">
            <tr>
              <th className="py-4 px-6 text-sm font-medium text-[#858481]">
                신고 ID
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#858481]">
                그룹명
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#858481]">
                신고 유형
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#858481]">
                신고자 / 대상자
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#858481]">
                처리 상태
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-20 text-[#858481]">
                  데이터를 불러오는 중입니다...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-20 text-[#858481]">
                  접수된 신고 내역이 없습니다.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr
                  key={report.reportId}
                  className="border-b border-[#e2e1df] hover:bg-[#f9f9f1] transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/reports/${report.reportId}`)}
                >
                  <td className="py-4 px-6 text-sm font-medium text-[#242322]">
                    #{report.reportId}
                  </td>
                  <td className="py-4 px-6 text-sm text-[#5e5d5b]">
                    {report.groupName}
                  </td>

                  <td className="py-4 px-6 text-sm">
                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold">
                      {getReportTypeLabel(report.reportType)}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-sm text-[#242322]">
                    <span className="font-medium">
                      {report.reporterNickname}
                    </span>
                    <span className="mx-2 text-[#e2e1df]">|</span>
                    <span className="text-[#858481]">
                      {report.targetNickname}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusStyle(report.supportStatus)}`}
                    >
                      {report.supportStatus === "PENDING"
                        ? "대기중"
                        : report.supportStatus === "RESOLVED"
                          ? "처리완료"
                          : "반려"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
