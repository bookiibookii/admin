import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

export default function NoticeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isEdit) {
      // Mock data for editing
      setTitle("12월 업데이트 안내");
      setContent("새로운 기능이 추가되었습니다! 독서 카드 꾸미기 기능을 확인해보세요.");
    }
  }, [isEdit]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요");
      return;
    }
    if (!content.trim()) {
      toast.error("내용을 입력해주세요");
      return;
    }

    toast.success(isEdit ? "공지사항이 수정되었습니다" : "공지사항이 등록되었습니다");
    setTimeout(() => {
      navigate("/admin/notices");
    }, 1500);
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
          {isEdit ? "공지사항 내용을 수정하세요" : "새로운 공지사항을 작성하세요"}
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