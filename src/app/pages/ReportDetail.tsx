import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchApi } from "../utils/api";
import { toast } from "sonner";
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

interface ReportDetail {
  reportId: number;
  reporterNickname: string;
  targetNickname: string;
  groupName: string;
  reportType: string;
  content: string; // 신고된 콘텐츠 내용
  createdAt: string;
  supportStatus: "PENDING" | "RESOLVED" | "REJECTED";
  adminReply: string | null;
  adminMemo: string | null;
  resolvedAt: string | null;
}

// 💡 신고 유형 한글 매핑 함수
const getReportTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    ABUSE: "욕설/비방",
    SPAM: "스팸/광고",
    NO_SHOW: "책 미발송/노쇼/연락두절",
    DAMAGED_BOOK: "책 파손/낙서",
  };
  return types[type] || type;
};

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ReportDetail | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetchApi(`/api/admin/report/${id}`);
        const data = await response.json();
        if (data.isSuccess) setDetail(data.result);
      } catch (error) {
        toast.error("상세 정보를 가져오는데 실패했습니다.");
      }
    };
    fetchDetail();
  }, [id]);

  // 신고 처리 로직 (승인/반려 등)
  const handleProcess = async (status: "RESOLVED" | "REJECTED") => {
    const actionText = status === "RESOLVED" ? "승인(콘텐츠 조치)" : "반려";
    if (!window.confirm(`이 신고를 ${actionText} 처리하시겠습니까?`)) return;

    setIsSubmitting(true);
    try {
      const response = await fetchApi(`/api/admin/report/${id}/process`, {
        method: "POST",
        body: JSON.stringify({ status }),
      });
      const data = await response.json();

      if (data.isSuccess) {
        toast.success(`신고가 ${actionText}되었습니다.`);
        navigate("/admin/reports");
      } else {
        toast.error(data.message || "처리 실패");
      }
    } catch (error) {
      toast.error("통신 에러");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!detail)
    return (
      <div className="p-8 text-center text-[#858481]">데이터 로딩 중...</div>
    );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-[#858481] hover:text-[#242322] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
      </button>

      <div className="bg-white rounded-[24px] border border-[#e2e1df] overflow-hidden shadow-sm">
        {/* 상단 헤더 섹션 */}
        <div className="p-8 border-b border-[#f4f3f1] bg-[#fafafa]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#242322]">
                  신고 번호 #{detail.reportId}
                </h2>
                <p className="text-[#858481] text-sm">
                  신고 일시: {new Date(detail.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                detail.supportStatus === "PENDING"
                  ? "bg-amber-100 text-amber-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {detail.supportStatus === "PENDING" ? "검토 대기중" : "처리 완료"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <InfoCard
              label="신고 유형"
              // 💡 한글 매핑 적용
              value={getReportTypeLabel(detail.reportType)}
              color="text-red-600"
            />
            <InfoCard label="대상 그룹" value={detail.groupName} />
            <InfoCard
              label="신고자 / 피신고자"
              value={`${detail.reporterNickname} → ${detail.targetNickname}`}
            />
          </div>
        </div>

        {/* 본문 섹션 */}
        <div className="p-8 space-y-8">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#242322] mb-4">
              <MessageSquare className="w-4 h-4 text-[#ff7618]" />
              신고된 콘텐츠 내용
            </h3>
            <div className="p-6 bg-[#f4f3f1] rounded-[16px] text-[#5e5d5b] leading-relaxed whitespace-pre-wrap border border-[#e2e1df]">
              {detail.content}
            </div>
          </div>

          {detail.supportStatus !== "PENDING" && (
            <div className="p-6 bg-blue-50 rounded-[16px] border border-blue-100">
              <h3 className="text-sm font-bold text-blue-700 mb-2">
                관리자 처리 결과
              </h3>
              <p className="text-blue-900 mb-1">
                <span className="font-medium">답변:</span>{" "}
                {detail.adminReply || "없음"}
              </p>
              <p className="text-blue-900">
                <span className="font-medium">메모:</span>{" "}
                {detail.adminMemo || "없음"}
              </p>
            </div>
          )}
        </div>

        {/* 하단 액션바 */}
        {detail.supportStatus === "PENDING" && (
          <div className="p-6 bg-[#f4f3f1] border-t border-[#e2e1df] flex justify-end gap-3">
            <button
              disabled={isSubmitting}
              onClick={() => handleProcess("REJECTED")}
              className="px-6 py-3 rounded-[12px] font-bold text-[#5e5d5b] bg-white border border-[#e2e1df] hover:bg-[#fafafa] transition-all"
            >
              신고 반려
            </button>
            <button
              disabled={isSubmitting}
              onClick={() => handleProcess("RESOLVED")}
              className="px-6 py-3 rounded-[12px] font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-100 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              신고 승인 및 콘텐츠 삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 정보 표시용 컴포넌트
function InfoCard({
  label,
  value,
  color = "text-[#242322]",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-white p-4 rounded-[12px] border border-[#e2e1df]">
      <p className="text-[11px] font-bold text-[#858481] uppercase mb-1">
        {label}
      </p>
      <p className={`text-sm font-bold truncate ${color}`}>{value}</p>
    </div>
  );
}
