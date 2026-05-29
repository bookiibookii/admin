interface Admin {
  id: number;
  nickname: string;
  email: string;
  provider: string;
  createdAt: string;
}

const DUMMY_ADMINS: Admin[] = [
  { id: 1, nickname: "noshel", email: "admin@bookiibookii.com", provider: "Google", createdAt: "2024.11.01" },
  { id: 2, nickname: "booky", email: "booky@bookiibookii.com", provider: "Kakao", createdAt: "2025.01.15" },
];

// TODO: API 연동 시 교체
// const { data } = await api.get("/api/admin/users?role=ADMIN");

export default function AdminManagement() {
  return (
    <div className="p-8">
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e1df] bg-[#f4f3f1]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] w-16">번호</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">닉네임</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481]">이메일</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] w-32">소셜 로그인</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#858481] w-32">등록일</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_ADMINS.map((admin) => (
                <tr key={admin.id} className="border-b border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors">
                  <td className="py-3 px-4 text-sm text-[#858481]">{admin.id}</td>
                  <td className="py-3 px-4 text-sm font-medium text-[#242322]">{admin.nickname}</td>
                  <td className="py-3 px-4 text-sm text-[#858481]">{admin.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      admin.provider === "Google"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {admin.provider}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-[#858481]">{admin.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
