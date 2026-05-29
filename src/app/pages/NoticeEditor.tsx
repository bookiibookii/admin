import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import api from "../../lib/api";

interface NoticeDetail {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

function formatDateTime(dateString: string): string {
  const d = new Date(dateString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

const DUMMY_NOTICES: Record<string, NoticeDetail> = {
  "3": {
    title: "베스트 부키 메이트 시스템 오픈",
    content: "이번 달부터 베스트 부키 메이트 랭킹을 확인할 수 있어요.\n\n## 선정 기준\n- 교환독서 완료 횟수\n- 감사 하트 수\n- 문장 공유 수\n\n많은 참여 부탁드려요! 📚",
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    updatedAt: null,
  },
  "2": {
    title: "12월 업데이트 안내",
    content: "새로운 기능이 추가되었습니다! **독서 카드 꾸미기** 기능을 확인해보세요.\n\n### 주요 변경사항\n1. 독서 카드 꾸미기 기능 추가\n2. 그룹 초대 알림 개선\n3. 버그 수정",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  "1": {
    title: "서비스 점검 완료 안내",
    content: "11월 25일 새벽 2시~4시 진행된 서비스 점검이 완료되었습니다.\n\n이용에 불편을 드려 죄송합니다.",
    createdAt: new Date("2026-05-07T10:00:00Z").toISOString(),
    updatedAt: null,
  },
};

export default function NoticeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [detail, setDetail] = useState<NoticeDetail | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const fetchDetail = async () => {
      try {
        // TODO: API 연동 시 아래 주석 해제 후 더미 데이터 제거
        // const { data } = await api.get(`/api/notice/${id}`);
        // if (data.isSuccess) {
        //   setTitle(data.result.title || "");
        //   setContent(data.result.content || "");
        //   setDetail(data.result);
        // }
        const dummy = DUMMY_NOTICES[id!];
        if (dummy) {
          setTitle(dummy.title);
          setContent(dummy.content);
          setDetail(dummy);
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
      const body = { title: title.trim(), content: content.trim() };

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

  const isUpdated = detail?.updatedAt && detail.updatedAt !== detail.createdAt;

  return (
    <div className="p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(isEdit ? `/notices/${id}` : "/notices")}
          className="flex items-center gap-2 text-[#5e5d5b] hover:text-[#242322] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {isEdit ? "상세로" : "목록으로"}
        </button>
        <h1 className="text-2xl font-bold text-[#242322]">
          {isEdit ? "공지사항 수정" : "공지사항 등록"}
        </h1>
        {isEdit && detail && (
          <div className="flex items-center gap-3 mt-2 text-sm text-[#858481]">
            <span>최초 작성: {formatDateTime(detail.createdAt)}</span>
            {isUpdated && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  수정: {formatDateTime(detail.updatedAt!)}
                  <span className="text-xs bg-[#fff3eb] text-[#ff7618] px-2 py-0.5 rounded-full font-semibold">수정됨</span>
                </span>
              </>
            )}
          </div>
        )}
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
              <Label htmlFor="content" className="text-[#242322] font-medium">
                내용 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="줄바꿈, 마크다운(**, ##), 이모지 모두 사용 가능합니다"
                className="bg-[#f4f3f1] border-[#e2e1df] rounded-[10px] min-h-[400px] font-mono"
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
                onClick={() => navigate(isEdit ? `/notices/${id}` : "/notices")}
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
