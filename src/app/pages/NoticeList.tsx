import { useState } from "react";
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

export default function NoticeList() {
  const [notices, setNotices] = useState([
    { id: 1, title: "12월 업데이트 안내", date: "2024.11.29" },
    { id: 2, title: "베스트 부키 메이트 시스템 오픈", date: "2024.11.29" },
    { id: 3, title: "서비스 점검 완료 안내", date: "2024.11.25" },
    { id: 4, title: "개인정보 처리방침 개정 안내", date: "2024.11.20" },
    { id: 5, title: "추석 연휴 고객센터 운영 안내", date: "2024.11.15" },
  ]);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      setNotices(notices.filter(notice => notice.id !== deleteId));
      toast.success("공지사항이 삭제되었습니다");
      setDeleteId(null);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#242322]">공지사항 관리</h1>
          <p className="text-[#858481] mt-1">공지사항을 등록하고 관리하세요</p>
        </div>
        <Link
          to="/admin/notices/new"
          className="flex items-center gap-2 bg-[#ff7618] text-white px-4 py-3 rounded-[10px] font-medium hover:bg-[#e66815] transition-colors"
        >
          <Plus className="w-5 h-5" />
          공지 등록
        </Link>
      </div>

      {/* Table */}
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
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">공지 ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">제목</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">작성일</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">작업</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.id} className="border-b border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors">
                  <td className="py-3 px-4 text-sm text-[#242322] font-medium">#{notice.id}</td>
                  <td className="py-3 px-4 text-sm text-[#242322]">{notice.title}</td>
                  <td className="py-3 px-4 text-sm text-[#858481]">{notice.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/notices/${notice.id}/edit`}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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