import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../lib/api";

interface Admin {
  id: number;
  nickname: string;
  introduction: string;
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/api/admin/admins");
        if (data.isSuccess) {
          setAdmins(data.result || []);
        } else {
          toast.error(data.message || "관리자 목록을 불러오지 못했습니다.");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "서버 통신 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#242322]">관리자</h1>
        <p className="text-[#858481] mt-1">
          ADMIN 권한이 부여된 계정 목록입니다. 계정 권한 설정은 백엔드에서 직접 처리됩니다.
        </p>
      </div>

      <div className="bg-white rounded-[20px] border border-[#e2e1df] overflow-hidden">
        <div className="p-6 border-b border-[#e2e1df]">
          <p className="text-sm text-[#858481]">
            총 <span className="font-semibold text-[#242322]">{admins.length}</span>명
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-16" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr className="border-b border-[#e2e1df] bg-[#f4f3f1]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">번호</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">닉네임 (부키부키)</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">소개</th>
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
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-sm text-[#858481]">
                    등록된 관리자가 없습니다.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors">
                    <td className="py-3 px-4 text-sm text-[#858481]">{admin.id}</td>
                    <td className="py-3 px-4 text-sm font-medium text-[#242322]">{admin.nickname}</td>
                    <td className="py-3 px-4 text-sm text-[#858481] truncate">{admin.introduction || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
