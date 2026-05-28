import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { fetchApi } from "../utils/api";

export default function NoticeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  // 수정 모드일 때 기존 데이터 불러오기 (GET)
  useEffect(() => {
    const fetchNoticeDetail = async () => {
      if (!isEdit) return;

      try {
        const response = await fetchApi(`/api/admin/notice/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.result.title || "");
          setSummary(data.result.summary || "");
          setContent(data.result.content || "");
        }
      } catch (error) {
        toast.error("기존 공지사항을 불러오지 못했습니다.");
      }
    };

    fetchNoticeDetail();
  }, [id, isEdit]);

  // 공지사항 저장 (POST / PATCH)
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요");
      return;
    }
    if (!summary.trim()) {
      toast.error("요약을 입력해주세요");
      return;
    }
    if (!content.trim()) {
      toast.error("내용을 입력해주세요");
      return;
    }

    // 스웨거 명세에 맞춘 Request Body
    const requestBody = {
      title: title.trim(),
      content: content.trim(),
      summary: summary.trim(),
    };

    try {
      const url = isEdit ? `/api/admin/notice/${id}` : "/api/admin/notice";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetchApi(url, {
        method: method,
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        toast.success(
          isEdit ? "공지사항이 수정되었습니다" : "공지사항이 등록되었습니다",
        );
        setTimeout(() => {
          navigate("/admin/notices");
        }, 1500);
      } else {
        toast.error("저장에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("저장 통신 에러:", error);
      toast.error("서버 통신 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/admin/notices");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/notices")}
          className="flex items-center gap-2 text-[#5e5d5b] hover:text-[#242322] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </button>
        <h1 className="text-2xl font-bold text-[#242322]">
          {isEdit ? "공지사항 수정" : "공지사항 등록"}
        </h1>
        <p className="text-[#858481] mt-1">
          {isEdit
            ? "공지사항 내용을 수정하세요"
            : "새로운 공지사항을 작성하세요"}
        </p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-[20px] p-8 border border-[#e2e1df]">
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#242322] font-medium">
                제목
              </Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="공지사항 제목을 입력하세요"
                className="bg-[#f4f3f1] border-[#e2e1df] rounded-[10px]"
              />
            </div>

            {/* Summary (새로 추가된 부분) */}
            <div className="space-y-2">
              <Label htmlFor="summary" className="text-[#242322] font-medium">
                요약 (Summary)
              </Label>
              <Input
                id="summary"
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="목록에 보여질 공지사항 요약을 짧게 입력하세요"
                className="bg-[#f4f3f1] border-[#e2e1df] rounded-[10px]"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-[#242322] font-medium">
                내용
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="공지사항 내용을 입력하세요"
                className="bg-[#f4f3f1] border-[#e2e1df] rounded-[10px] min-h-[300px]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-[#ff7618] text-white py-3 rounded-[10px] font-medium hover:bg-[#e66815] transition-colors"
              >
                {isEdit ? "수정 저장" : "등록"}
              </button>
              <button
                onClick={handleCancel}
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
