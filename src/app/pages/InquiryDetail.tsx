import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchApi } from "../utils/api";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface InquiryDetail {
  inquiryId: number;
  title: string;
  content: string;
  nickname: string;
  supportStatus: "PENDING" | "ANSWERED";
  adminReply: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export default function InquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<InquiryDetail | null>(null);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 상세 조회
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetchApi(`/api/admin/inquiry/${id}`);
        const data = await response.json();

        console.log("🟡 Inquiry detail response:", data);

        if (response.ok && data.isSuccess) {
          setDetail(data.result);

          if (data.result.adminReply) {
            setAnswer(data.result.adminReply);
          }
        } else {
          toast.error(data.message || "상세 조회 실패");
        }
      } catch (error) {
        console.error("🔴 Detail API error:", error);
        toast.error("상세 내용을 가져오는데 실패했습니다.");
      }
    };

    fetchDetail();
  }, [id]);

  // ✅ 답변 등록/수정 (PATCH + adminReply)
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      return toast.error("답변 내용을 입력해주세요.");
    }

    setIsSubmitting(true);

    try {
      const response = await fetchApi(`/api/admin/inquiry/${id}/answer`, {
        method: "PATCH",
        body: JSON.stringify({
          adminReply: answer,
        }),
      });

      const data = await response.json();

      console.log("🟡 Answer PATCH response:", data);

      if (response.ok && data.isSuccess) {
        toast.success("답변이 성공적으로 저장되었습니다.");
        navigate("/admin/inquiries");
      } else {
        toast.error(data.message || "답변 저장 실패");
      }
    } catch (error) {
      console.error("🔴 Answer API error:", error);
      toast.error("서버 통신 에러가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!detail) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  return (
    <div className="p-8 max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-[#858481] hover:text-[#242322]"
      >
        <ArrowLeft className="w-4 h-4" /> 뒤로가기
      </button>

      <div className="bg-white rounded-[20px] border border-[#e2e1df] p-8 shadow-sm">
        <div className="mb-6 border-b border-[#f4f3f1] pb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-[#242322]">
              {detail.title}
            </h2>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                detail.supportStatus === "ANSWERED"
                  ? "bg-green-100 text-green-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              {detail.supportStatus === "ANSWERED" ? "답변완료" : "답변대기"}
            </span>
          </div>

          <div className="text-sm text-[#858481] flex gap-4">
            <span>작성자: {detail.nickname}</span>
            <span>작성일: {new Date(detail.createdAt).toLocaleString()}</span>
            {detail.resolvedAt && (
              <span>
                처리일: {new Date(detail.resolvedAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="mb-10 text-[#5e5d5b] leading-relaxed whitespace-pre-wrap">
          {detail.content}
        </div>

        {/* 답변 작성 영역 */}
        <div className="bg-[#f4f3f1] rounded-[15px] p-6">
          <h3 className="font-semibold text-[#242322] mb-4">관리자 답변</h3>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="답변 내용을 입력하세요..."
            className="w-full h-40 p-4 rounded-[10px] border border-[#e2e1df] focus:outline-none focus:ring-2 focus:ring-[#ff7618] resize-none"
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting}
              className="bg-[#ff7618] text-white px-8 py-3 rounded-[10px] font-bold hover:bg-[#e66815] transition-colors disabled:bg-[#ccc]"
            >
              {detail.adminReply ? "답변 수정하기" : "답변 등록하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
