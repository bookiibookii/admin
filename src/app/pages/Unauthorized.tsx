import { useNavigate } from "react-router";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] p-10 shadow-sm text-center max-w-md w-full">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[#242322] mb-2">접근 권한 없음</h1>
        <p className="text-[#858481] mb-6">
          접근 권한이 없습니다.<br />관리자에게 문의하세요.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#ff7618] text-white px-6 py-3 rounded-[10px] font-medium hover:bg-[#e66815] transition-colors"
        >
          로그인 페이지로 이동
        </button>
      </div>
    </div>
  );
}
