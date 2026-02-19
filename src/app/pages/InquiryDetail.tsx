import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "../components/ui/textarea";

export default function InquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const inquiry = {
    id: id,
    author: "noshel",
    title: "독서 카드 사용법",
    content: "독서 카드는 어떻게 사용하나요?",
    date: "2024.11.29 14:32",
  };

  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<Array<{ from: string; content: string; date: string }>>([]);

  const handleSendAnswer = () => {
    if (!answer.trim()) {
      toast.error("답변 내용을 입력해주세요");
      return;
    }

    const newAnswer = {
      from: "부키부키 팀",
      content: answer,
      date: new Date().toLocaleString('ko-KR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\. /g, '.').replace(/\.$/, ''),
    };

    setAnswers([...answers, newAnswer]);
    setAnswer("");
    toast.success("답변이 사용자에게 전송되었습니다");
  };

  const handleSaveDraft = () => {
    toast.success("임시저장되었습니다");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/inquiries")}
          className="flex items-center gap-2 text-[#5e5d5b] hover:text-[#242322] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </button>
        <h1 className="text-2xl font-bold text-[#242322]">문의 상세</h1>
        <p className="text-[#858481] mt-1">문의 ID: #{inquiry.id}</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Inquiry Information Card */}
        <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-bold text-[#242322] mb-1">{inquiry.title}</h2>
              <div className="flex items-center gap-3 text-sm text-[#858481]">
                <span>문의자: <span className="text-[#242322] font-medium">{inquiry.author}</span></span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {inquiry.date}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-[#e2e1df]">
            <p className="text-[#242322] leading-relaxed">{inquiry.content}</p>
          </div>
        </div>

        {/* Previous Answers */}
        {answers.length > 0 && (
          <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df]">
            <h2 className="font-bold text-[#242322] mb-4">답변 이력</h2>
            <div className="space-y-4">
              {answers.map((ans, index) => (
                <div key={index} className="bg-[#f4f3f1] rounded-[10px] p-4 border border-[#e2e1df]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#ff7618]">{ans.from}</span>
                    <span className="text-xs text-[#858481]">{ans.date}</span>
                  </div>
                  <p className="text-[#242322] leading-relaxed">{ans.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answer Section */}
        <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df]">
          <h2 className="font-bold text-[#242322] mb-4">답변 작성</h2>
          
          <div className="space-y-4">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="사용자에게 전송할 답변을 입력하세요"
              className="bg-[#f4f3f1] border-[#e2e1df] rounded-[10px] min-h-[200px]"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSendAnswer}
                className="flex-1 bg-[#ff7618] text-white py-3 rounded-[10px] font-medium hover:bg-[#e66815] transition-colors"
              >
                답변 전송
              </button>
              <button
                onClick={handleSaveDraft}
                className="px-6 bg-[#f4f3f1] text-[#242322] py-3 rounded-[10px] font-medium hover:bg-[#e2e1df] transition-colors"
              >
                임시저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}