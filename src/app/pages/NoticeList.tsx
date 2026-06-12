import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Plus } from "lucide-react";
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
import { formatRelativeTime } from "../../lib/dateUtils";

interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  authorNickname: string;
}



function formatNoticeId(id: number): string {
  return `N-${String(id).padStart(3, "0")}`;
}

export default function NoticeList() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/admin/notice");
      if (data.isSuccess) {
        const sorted = (data.result || []).sort((a: Notice, b: Notice) => b.id - a.id);
        setNotices(sorted);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "서버 통신 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { data } = await api.delete(`/api/admin/notice/${deleteId}`);
      if (data.isSuccess) {
        setNotices((prev) => prev.filter((n) => n.id !== deleteId));
        toast.success("공지사항이 삭제되었습니다.");
      } else {
        toast.error(data.message || "공지사항 삭제에 실패했습니다.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "서버 통신 오류가 발생했습니다.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#242322]">공지사항 관리</h1>
          <p className="text-[#858481] mt-1">공지사항을 등록하고 관리하세요</p>
        </div>
        <Link
          to="/notices/new"
          className="flex items-center gap-2 bg-[#ff7618] text-white px-4 py-3 rounded-[10px] font-medium hover:bg-[#e66815] transition-colors"
        >
          <Plus className="w-5 h-5" />
          공지 등록
        </Link>
      </div>

      <div className="bg-white rounded-[20px] border border-[#e2e1df] overflow-hidden">
        <div className="p-6 border-b border-[#e2e1df]">
          <p className="text-sm text-[#858481]">
            총 <span className="font-semibold text-[#242322]">{notices.length}</span>건
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e1df] bg-[#f4f3f1]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] w-28">공지 ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">제목</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] w-36">최초 작성일</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] w-36">수정일</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] w-28">작성자</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-[#ff7618] border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : notices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[#858481]">
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              ) : (
                notices.map((notice) => {
                  const isUpdated = notice.updatedAt && notice.updatedAt !== notice.createdAt;
                  return (
                    <tr
                      key={notice.id}
                      onClick={() => navigate(`/notices/${notice.id}`)}
                      className="border-b border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 text-sm text-[#858481] font-mono">
                        {formatNoticeId(notice.id)}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#242322] font-medium">
                        {notice.title}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#858481]">
                        {formatRelativeTime(notice.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#858481]">
                        {isUpdated ? formatRelativeTime(notice.updatedAt!) : ""}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#858481]">
                        {notice.authorNickname}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
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
