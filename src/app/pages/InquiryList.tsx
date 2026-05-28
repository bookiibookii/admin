import { useState, useEffect } from "react";
import { fetchApi } from "../utils/api";
import { toast } from "sonner";

interface Inquiry {
  inquiryId: number;
  title: string;
  userName: string;
  status: "PENDING" | "ANSWERED" | "RESOLVED";
  createdAt: string;
}

export default function InquiryList() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      // 서버 정렬이 안될 경우를 대비해 기본 호출
      const response = await fetchApi("/api/admin/inquiry?page=0&size=10");
      const data = await response.json();

      if (response.ok && data.isSuccess) {
        const rawList = data.result.content || [];

        // 1. inquiryId 기준 오름차순 정렬 (낮은 순)
        const sorted = [...rawList].sort((a, b) => a.inquiryId - b.inquiryId);

        // 2. 데이터 매핑 및 상태 처리 (RESOLVED 도 완료로 간주)
        const mapped: Inquiry[] = sorted.map((item: any) => ({
          inquiryId: item.inquiryId,
          title: item.title,
          userName: item.nickname,
          status:
            item.supportStatus === "ANSWERED" ||
            item.supportStatus === "RESOLVED"
              ? "ANSWERED"
              : "PENDING",
          createdAt: item.createdAt,
        }));

        setInquiries(mapped);
      } else {
        toast.error(data.message || "문의 목록을 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("🔴 Inquiry API error:", error);
      toast.error("서버 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#242322]">문의 관리</h1>
        <p className="text-[#858481] mt-1">
          사용자들의 문의 내역을 확인하고 답변하세요.
        </p>
      </div>

      <div className="bg-white rounded-[20px] border border-[#e2e1df] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#f4f3f1] border-b border-[#e2e1df]">
            <tr>
              <th className="py-4 px-6 text-sm font-medium text-[#858481]">
                ID
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#858481]">
                제목
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#858481]">
                작성자
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#858481]">
                상태
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#858481]">
                작성일
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10">
                  로딩 중...
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10">
                  문의 내역이 없습니다.
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr
                  key={inquiry.inquiryId}
                  className="border-b border-[#e2e1df] hover:bg-[#f9f9f9] transition-colors cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/admin/inquiries/${inquiry.inquiryId}`)
                  }
                >
                  <td className="py-4 px-6 text-sm">#{inquiry.inquiryId}</td>
                  <td className="py-4 px-6 text-sm font-medium">
                    {inquiry.title}
                  </td>
                  <td className="py-4 px-6 text-sm">{inquiry.userName}</td>
                  <td className="py-4 px-6 text-sm">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        inquiry.status === "ANSWERED"
                          ? "bg-green-100 text-green-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {inquiry.status === "ANSWERED" ? "완료" : "답변대기"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-[#858481]">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
