interface Admin {
  id: number;
  nickname: string;
  email: string;
}

// TODO: API 연동 시 교체
// const { data } = await api.get("/api/admin/users?role=ADMIN");
const DUMMY_ADMINS: Admin[] = [];

export default function AdminManagement() {
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
            총 <span className="font-semibold text-[#242322]">{DUMMY_ADMINS.length}</span>명
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
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">이메일 주소</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_ADMINS.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-sm text-[#858481]">
                    API 연동 후 관리자 목록이 표시됩니다.
                  </td>
                </tr>
              ) : (
                DUMMY_ADMINS.map((admin) => (
                  <tr key={admin.id} className="border-b border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors">
                    <td className="py-3 px-4 text-sm text-[#858481]">{admin.id}</td>
                    <td className="py-3 px-4 text-sm font-medium text-[#242322]">{admin.nickname}</td>
                    <td className="py-3 px-4 text-sm text-[#858481]">{admin.email}</td>
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
