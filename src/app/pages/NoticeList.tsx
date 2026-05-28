import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
  createdAt: string;
}

export default function NoticeList() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/admin/notice");
      if (data.isSuccess) {
        const sorted = (data.result || []).sort(
          (a: Notice, b: Notice) => b.id - a.id
        );
        setNotices(sorted);
      } else {
        toast.error(data.message || "공지사항 목록을 불러오는데 실패했습니다.");
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
    <div className="p-8">
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
            총{" "}
            <span className="font-semibold text-[#242322]">{notices.length}</span>건
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e1df] bg-[#f4f3f1]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">공지 ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">제목</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">작성일</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">작업</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-[#ff7618] border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : notices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-[#858481]">
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              ) : (
                notices.map((notice) => (
                  <tr
                    key={notice.id}
                    className="border-b border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-[#242322] font-medium">
                      #{notice.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#242322]">{notice.title}</td>
                    <td className="py-3 px-4 text-sm text-[#858481]">
                      {formatDate(notice.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/notices/${notice.id}/edit`}
                          className="flex items-center gap-1 text-sm text-[#ff7618] hover:underline"
                        >
                          <Pencil className="w-4 h-4" />
                          수정
                        </Link>
                        <button
                          onClick={() => setDeleteId(notice.id)}
                          className="flex items-center gap-1 text-sm text-red-500 hover:underline"
                        >
                          <Trash2 className="w-4 h-4" />
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
