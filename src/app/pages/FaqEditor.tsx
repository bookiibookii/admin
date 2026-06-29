import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import api from "../../lib/api";

export default function FaqEditor() {
  const { id: faqId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!faqId;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const fetchDetail = async () => {
      try {
        const { data } = await api.get(`/api/admin/faq/${faqId}`);
        if (data.isSuccess) {
          setQuestion(data.result.question || "");
          setAnswer(data.result.answer || "");
        } else {
          toast.error("FAQ를 불러오지 못했습니다.");
        }
      } catch {
        toast.error("기존 FAQ를 불러오지 못했습니다.");
      }
    };

    fetchDetail();
  }, [faqId, isEdit]);

  const handleSave = async () => {
    if (!question.trim()) {
      toast.error("질문을 입력해주세요.");
      return;
    }
    if (!answer.trim()) {
      toast.error("답변을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      const body = { question: question.trim(), answer: answer.trim() };

      if (isEdit) {
        await api.patch(`/api/admin/faq/${faqId}`, body);
      } else {
        await api.post("/api/admin/faq", body);
      }

      toast.success(isEdit ? "FAQ가 수정되었습니다." : "FAQ가 등록되었습니다.");
      navigate("/faqs");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/faqs")}
          className="flex items-center gap-2 text-[#5e5d5b] hover:text-[#242322] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </button>
        <h1 className="text-2xl font-bold text-[#242322]">
          {isEdit ? "FAQ 수정" : "FAQ 등록"}
        </h1>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-[20px] p-8 border border-[#e2e1df]">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-[#242322] font-medium">
                질문 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="질문을 입력하세요"
                className="bg-[#f4f3f1] border-[#e2e1df] rounded-[10px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer" className="text-[#242322] font-medium">
                답변 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="답변을 입력하세요"
                className="bg-[#f4f3f1] border-[#e2e1df] rounded-[10px] min-h-[240px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-[#ff7618] text-white py-3 rounded-[10px] font-medium hover:bg-[#e66815] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isEdit ? "수정 저장" : "등록"}
              </button>
              <button
                onClick={() => navigate("/faqs")}
                className="px-6 bg-white text-[#5e5d5b] py-3 rounded-[10px] font-medium border border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
