import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { toast } from "sonner";
import api from "../../lib/api";

interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  authorNickname: string;
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

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/api/notice/${id}`);
        if (data.isSuccess) {
          setNotice(data.result);
        } else {
          toast.error("공지사항을 찾을 수 없습니다.");
          navigate("/notices");
        }
      } catch {
        toast.error("공지사항을 불러오지 못했습니다.");
        navigate("/notices");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/notice/${id}`);
      toast.success("공지사항이 삭제되었습니다.");
      navigate("/notices");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "삭제에 실패했습니다.");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const isUpdated = notice?.updatedAt && notice.updatedAt !== notice.createdAt;

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-6 h-6 border-2 border-[#ff7618] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!notice) return null;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/notices")}
          className="flex items-center gap-2 text-[#5e5d5b] hover:text-[#242322] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </button>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-[20px] p-8 border border-[#e2e1df]">
          <div className="mb-6 pb-6 border-b border-[#e2e1df]">
            <h1 className="text-2xl font-bold text-[#242322] mb-4">{notice.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-[#858481]">
              <span>작성자: <span className="text-[#242322]">{notice.authorNickname}</span></span>
              <span>최초 작성일: <span className="text-[#242322]">{formatDateTime(notice.createdAt)}</span></span>
              {isUpdated && (
                <span className="flex items-center gap-1">
                  수정일: <span className="text-[#242322]">{formatDateTime(notice.updatedAt!)}</span>
                  <span className="text-xs bg-[#fff3eb] text-[#ff7618] px-2 py-0.5 rounded-full font-semibold">수정됨</span>
                </span>
              )}
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-[#242322]">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mt-4 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold mt-3 mb-1">{children}</h3>,
                p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
              }}
            >
              {notice.content}
            </ReactMarkdown>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-[#e2e1df]">
            <button
              onClick={() => navigate(`/notices/${notice.id}/edit`)}
              className="flex items-center gap-2 bg-[#ff7618] text-white px-5 py-3 rounded-[10px] font-medium hover:bg-[#e66815] transition-colors"
            >
              <Pencil className="w-4 h-4" />
              수정
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="px-5 py-3 rounded-[10px] font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white rounded-[20px] border border-[#e2e1df]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#242322]">공지사항 삭제</AlertDialogTitle>
            <AlertDialogDescription className="text-[#5e5d5b]">
              정말로 이 공지사항을 삭제하시겠습니까?
              <br />
              삭제된 공지사항은 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#f4f3f1] text-[#242322] border-[#e2e1df] rounded-[10px] hover:bg-[#e2e1df]">
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white rounded-[10px] hover:bg-red-600"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
