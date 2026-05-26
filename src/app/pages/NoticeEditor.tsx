import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import api from "../../lib/api";

export default function NoticeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const fetchDetail = async () => {
      try {
        // Admin GET by ID가 없으므로 공개 notice API 사용
        const { data } = await api.get(`/api/notice/${id}`);
        if (data.isSuccess) {
          setTitle(data.result.title || "");
          setSummary(data.result.summary || "");
          setContent(data.result.content || "");
        } else {
          toast.error("공지사항을 불러오지 못했습니다.");
        }
      } catch {
        toast.error("기존 공지사항을 불러오지 못했습니다.");
      }
    };

    fetchDetail();
  }, [id, isEdit]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      const body = {
        title: title.trim(),
        content: content.trim(),
        ...(summary.trim() && { summary: summary.trim() }),
      };

      if (isEdit) {
        await api.patch(`/api/admin/notice/${id}`, body);
      } else {
        await api.post("/api/admin/notice", body);
      }

      toast.success(isEdit ? "공지사항이 수정되었습니다." : "공지사항이 등록되었습니다.");
      navigate("/notices");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/notices")}
          className="flex items-center gap-2 text-[#5e5d5b] hover:text-[#242322] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </button>
        <h1 className="text-2xl font-bold text-[#242322]">
          {isEdit ? "공지사항 수정" : "공지사항 등록"}
        </h1>
        <p className="text-[#858481] mt-1">
          {isEdit ? "공지사항 내용을 수정하세요." : "새로운 공지사항을 작성하세요."}
        </p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-[20px] p-8 border border-[#e2e1df]">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#242322] font-medium">
                제목 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="공지사항 제목을 입력하세요"
                className="bg-[#f4f3f1] border-[#e2e1df] rounded-[10px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary" className="text-[#242322] font-medium">
                요약
              </Label>
              <Input
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="목록에 표시될 짧은 요약 (선택)"
                className="bg-[#f4f3f1] border-[#e2e1df] rounded-[10px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-[#242322] font-medium">
                내용 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="공지사항 내용을 입력하세요"
                className="bg-[#f4f3f1] border-[#e2e1df] rounded-[10px] min-h-[300px]"
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
                onClick={() => navigate("/notices")}
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
