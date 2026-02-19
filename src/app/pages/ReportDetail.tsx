import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "../components/ui/textarea";

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const report = {
    id: id,
    reporter: "noshel",
    target: "user123",
    group: "괴테는 모든 것을 말했다",
    type: "욕설/비방",
    content: "책에 코멘트로 욕설을 너무 많이 달아서 책 돌려받았을 때 기분이 너무 나빴어요ㅠ",
    date: "2024.11.29 14:32",
  };

  const [internalMemo, setInternalMemo] = useState("");
  const [userMessage, setUserMessage] = useState("");

  const handleSubmit = () => {
    toast.success("처리 완료되었으며 사용자에게 전송되었습니다");
    setTimeout(() => {
      navigate("/admin/reports");
    }, 1500);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/reports")}
          className="flex items-center gap-2 text-[#5e5d5b] hover:text-[#242322] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </button>
        <h1 className="text-2xl font-bold text-[#242322]">신고 상세</h1>
        <p className="text-[#858481] mt-1">신고 ID: #{report.id}</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Report Information Card */}
        <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df]">
          <h2 className="font-bold text-[#242322] mb-4">신고 정보</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[#858481] mb-1 block">신고자</label>
                <p className="text-[#242322] font-medium">{report.reporter}</p>
              </div>
              <div>
                <label className="text-sm text-[#858481] mb-1 block">신고 대상</label>
                <p className="text-[#242322] font-medium">{report.target}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-[#858481] mb-1 block">그룹명</label>
              <p className="text-[#242322] font-medium">{report.group}</p>
            </div>

            <div>
              <label className="text-sm text-[#858481] mb-1 block">신고 유형</label>
              <p className="text-[#242322] font-medium">{report.type}</p>
            </div>

            <div>
              <label className="text-sm text-[#858481] mb-1 block">신고 내용</label>
              <p className="text-[#242322] leading-relaxed">{report.content}</p>
            </div>

            <div>
              <label className="text-sm text-[#858481] mb-1 block">접수일</label>
              <p className="text-[#242322]">{report.date}</p>
            </div>
          </div>
        </div>

        {/* Processing Panel */}
        <div className="bg-white rounded-[20px] p-6 border border-[#e2e1df]">
          <h2 className="font-bold text-[#242322] mb-4">처리</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#242322] mb-2 block">
                처리 메모 <span className="text-[#858481] font-normal">(운영진 내부용)</span>
              </label>
              <Textarea
                value={internalMemo}
                onChange={(e) => setInternalMemo(e.target.value)}
                placeholder="내부 메모를 입력하세요"
                className="bg-[#f4f3f1] border-[#e2e1df] rounded-[10px] min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#242322] mb-2 block">
                사용자 안내 메시지
              </label>
              <Textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="사용자에게 전송할 메시지를 입력하세요"
                className="bg-[#f4f3f1] border-[#e2e1df] rounded-[10px] min-h-[120px]"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#ff7618] text-white py-3 rounded-[10px] font-medium hover:bg-[#e66815] transition-colors"
            >
              처리 완료 및 사용자 전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}