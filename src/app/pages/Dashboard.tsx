import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { AlertCircle, MessageSquare, Bell, ArrowRight } from "lucide-react";
import { fetchApi } from "../utils/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    recentReports: [] as any[],
    recentInquiries: [] as any[],
    latestNotice: null as any,
    reportCount: 0,
    inquiryCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  // 유형 한글 매핑
  const getReportTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      ABUSE: "욕설/비방",
      SPAM: "스팸/광고",
      NO_SHOW: "책 미발송/노쇼/연락두절",
      DAMAGED_BOOK: "책 파손/낙서",
    };
    return types[type] || type;
  };

  // 상태 스타일 로직
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

  const fetchDashboardData = async () => {
    try {
      const [reportRes, inquiryRes, noticeRes] = await Promise.all([
        fetchApi("/api/admin/report?page=0&size=10"),
        fetchApi("/api/admin/inquiry?page=0&size=10"),
        fetchApi("/api/admin/notice?page=0&size=5"),
      ]);

      const reportData = await reportRes.json();
      const inquiryData = await inquiryRes.json();
      const noticeData = await noticeRes.json();

      // 최신순(ID 내림차순) 정렬 후 5개 추출
      const reports = (reportData.result?.content || [])
        .sort((a: any, b: any) => b.reportId - a.reportId)
        .slice(0, 5);
      const inquiries = (inquiryData.result?.content || [])
        .sort((a: any, b: any) => b.inquiryId - a.inquiryId)
        .slice(0, 5);
      const latestNotice = (noticeData.result?.content || []).sort(
        (a: any, b: any) => b.noticeId - a.noticeId,
      )[0];

      setData({
        recentReports: reports,
        recentInquiries: inquiries,
        latestNotice: latestNotice,
        reportCount: reportData.result?.totalElements || 0,
        inquiryCount: inquiryData.result?.totalElements || 0,
      });
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading)
    return (
      <div className="p-8 text-center text-[#858481]">대시보드 로딩 중...</div>
    );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#242322]">대시보드</h1>
        <p className="text-[#858481] mt-1">부키부키 관리자 현황</p>
      </div>

      {/* 요약 카드 (이전과 동일) */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#ff7618]/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-[#ff7618]" />
            </div>
            <h3 className="font-semibold text-[#242322]">신규 신고</h3>
          </div>
          <p className="text-3xl font-bold text-[#242322]">
            {data.reportCount}건
          </p>
          <p className="text-sm text-[#858481] mt-1">전체 접수 현황</p>
        </div>

        <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#ff7618]/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#ff7618]" />
            </div>
            <h3 className="font-semibold text-[#242322]">신규 문의</h3>
          </div>
          <p className="text-3xl font-bold text-[#242322]">
            {data.inquiryCount}건
          </p>
          <p className="text-sm text-[#858481] mt-1">전체 접수 현황</p>
        </div>

        <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#ff7618]/10 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#ff7618]" />
            </div>
            <h3 className="font-semibold text-[#242322]">최근 공지사항</h3>
          </div>
          <p className="text-sm font-medium text-[#242322] line-clamp-1">
            {data.latestNotice?.title || "공지 없음"}
          </p>
          <p className="text-sm text-[#858481] mt-1">
            {data.latestNotice
              ? new Date(data.latestNotice.createdAt).toLocaleDateString()
              : "-"}
          </p>
        </div>
      </div>

      {/* 최근 신고 내역 (ReportList UI 통일) */}
      <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df] mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#242322]">최근 신고 내역</h2>
          <Link
            to="/admin/reports"
            className="flex items-center gap-1 text-sm text-[#ff7618] hover:underline"
          >
            전체보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#f4f3f1] border-b border-[#e2e1df]">
              <tr>
                <th className="py-3 px-4 text-sm font-medium text-[#858481]">
                  신고 ID
                </th>
                <th className="py-3 px-4 text-sm font-medium text-[#858481]">
                  그룹명
                </th>
                <th className="py-3 px-4 text-sm font-medium text-[#858481]">
                  신고 유형
                </th>
                <th className="py-3 px-4 text-sm font-medium text-[#858481]">
                  신고자 / 대상자
                </th>
                <th className="py-3 px-4 text-sm font-medium text-[#858481]">
                  처리 상태
                </th>
              </tr>
            </thead>
            <tbody>
              {data.recentReports.map((report) => (
                <tr
                  key={report.reportId}
                  className="border-b border-[#e2e1df] hover:bg-[#f9f9f1] cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/reports/${report.reportId}`)}
                >
                  <td className="py-4 px-4 text-sm font-medium text-[#242322]">
                    #{report.reportId}
                  </td>
                  <td className="py-4 px-4 text-sm text-[#5e5d5b]">
                    {report.groupName}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold">
                      {getReportTypeLabel(report.reportType)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-[#242322]">
                    <span className="font-medium">
                      {report.reporterNickname}
                    </span>
                    <span className="mx-2 text-[#e2e1df]">|</span>
                    <span className="text-[#858481]">
                      {report.targetNickname}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 최근 문의 내역 */}
      <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#242322]">최근 문의 내역</h2>
          <Link
            to="/admin/inquiries"
            className="flex items-center gap-1 text-sm text-[#ff7618] hover:underline"
          >
            전체보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#f4f3f1] border-b border-[#e2e1df]">
              <tr>
                <th className="py-3 px-4 text-sm font-medium text-[#858481]">
                  ID
                </th>
                <th className="py-3 px-4 text-sm font-medium text-[#858481]">
                  문의자
                </th>
                <th className="py-3 px-4 text-sm font-medium text-[#858481]">
                  제목
                </th>
                <th className="py-3 px-4 text-sm font-medium text-[#858481]">
                  접수일
                </th>
              </tr>
            </thead>
            <tbody>
              {data.recentInquiries.map((inquiry) => (
                <tr
                  key={inquiry.inquiryId}
                  className="border-b border-[#e2e1df] hover:bg-[#f9f9f1] cursor-pointer transition-colors"
                  onClick={() =>
                    navigate(`/admin/inquiries/${inquiry.inquiryId}`)
                  }
                >
                  <td className="py-4 px-4 text-sm">#{inquiry.inquiryId}</td>
                  <td className="py-4 px-4 text-sm">{inquiry.nickname}</td>
                  <td className="py-4 px-4 text-sm font-medium">
                    {inquiry.title}
                  </td>
                  <td className="py-4 px-4 text-sm text-[#858481]">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
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
