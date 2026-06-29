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

interface Faq {
  id: number;
  question: string;
  answer: string;
}

function formatFaqId(id: number): string {
  return `F-${String(id).padStart(3, "0")}`;
}

export default function FaqList() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/admin/faq");
      if (data.isSuccess) {
        const sorted = (data.result || []).sort((a: Faq, b: Faq) => a.id - b.id);
        setFaqs(sorted);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "서버 통신 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { data } = await api.delete(`/api/admin/faq/${deleteId}`);
      if (data.isSuccess) {
        setFaqs((prev) => prev.filter((f) => f.id !== deleteId));
        toast.success("FAQ가 삭제되었습니다.");
      } else {
        toast.error(data.message || "FAQ 삭제에 실패했습니다.");
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
          <h1 className="text-2xl font-bold text-[#242322]">FAQ 관리</h1>
          <p className="text-[#858481] mt-1">앱 내 자주 묻는 질문을 등록하고 관리하세요</p>
        </div>
        <Link
          to="/faqs/new"
          className="flex items-center gap-2 bg-[#ff7618] text-white px-4 py-3 rounded-[10px] font-medium hover:bg-[#e66815] transition-colors"
        >
          <Plus className="w-5 h-5" />
          FAQ 등록
        </Link>
      </div>

      <div className="bg-white rounded-[20px] border border-[#e2e1df] overflow-hidden">
        <div className="p-6 border-b border-[#e2e1df]">
          <p className="text-sm text-[#858481]">
            총 <span className="font-semibold text-[#242322]">{faqs.length}</span>건
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[100px]" />
              <col />
              <col className="w-[120px]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#e2e1df] bg-[#f4f3f1]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">번호</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">질문</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">관리</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-[#ff7618] border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-[#858481]">
                    등록된 FAQ가 없습니다.
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr
                    key={faq.id}
                    onClick={() => navigate(`/faqs/${faq.id}/edit`)}
                    className="border-b border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 text-sm text-[#858481] font-mono">
                      {formatFaqId(faq.id)}
                    </td>
                    <td className="py-3 px-4 max-w-0">
                      <span className="text-sm text-[#242322] font-medium truncate block">
                        {faq.question}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(faq.id);
                        }}
                        className="text-sm text-red-500 hover:underline"
                      >
                        삭제
                      </button>
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
            <AlertDialogTitle className="text-[#242322]">FAQ 삭제</AlertDialogTitle>
            <AlertDialogDescription className="text-[#5e5d5b]">
              정말로 이 FAQ를 삭제하시겠습니까?
              <br />
              삭제된 FAQ는 복구할 수 없습니다.
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
