import { useNavigate } from "react-router";
import { toast } from "sonner";
import { fetchApi } from "../utils/api";
import { GoogleLogin } from "@react-oauth/google";

export default function AdminLogin() {
  const navigate = useNavigate();

  // 구글 로그인 성공 핸들러
  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log("🟢 Google credentialResponse:", credentialResponse);

    // 💡 credentialResponse.credential에 백엔드가 원하는 ID Token(JWT)이 들어있습니다.
    const idToken = credentialResponse.credential;
    console.log("🟢 Extracted idToken:", idToken);

    try {
      // 기존 권한 정보 초기화
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");

      console.log("🟡 Sending login request to backend...");

      const response = await fetchApi("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          socialType: "GOOGLE",
          token: idToken,
        }),
      });

      console.log("🟡 Raw response object:", response);

      const data = await response.json();
      console.log("🟡 Parsed response data:", data);

      if (response.ok && data.isSuccess) {
        console.log("🟢 Login API success");

        // 관리자 권한 확인
        if (data.result.role === "ADMIN") {
          console.log("🟢 ADMIN confirmed:", data.result);

          localStorage.setItem("accessToken", data.result.accessToken);
          localStorage.setItem("refreshToken", data.result.refreshToken);
          localStorage.setItem("userRole", data.result.role);

          toast.success("관리자 로그인에 성공했습니다.");
          navigate("/admin/notices");
        } else {
          console.log("🔴 Not ADMIN:", data.result.role);
          toast.error("관리자 계정만 접근할 수 있습니다.");
        }
      } else {
        console.log("🔴 Login API failed:", data);
        toast.error(data.message || "로그인 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("🔴 로그인 API 통신 에러:", error);
      toast.error("서버와 통신 중 문제가 발생했습니다.");
    }
  };

  const handleKakaoLogin = () => {
    toast.info("카카오 로그인은 현재 준비 중입니다.");
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[20px] p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#242322] mb-2">
              BOOKIIBOOKII
            </h1>
            <p className="text-[#858481]">관리자 로그인</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleKakaoLogin}
              className="w-full bg-[#FEE500] text-[#000000] py-4 rounded-[10px] font-medium hover:bg-[#FDD835] transition-colors flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 3C5.58172 3 2 5.89543 2 9.5C2 11.6484 3.23828 13.5547 5.16797 14.7344L4.35547 17.6172C4.28516 17.8594 4.55078 18.0547 4.75781 17.9062L8.14844 15.6094C8.75781 15.7109 9.37109 15.7656 10 15.7656C14.4183 15.7656 18 12.8984 18 9.29688C18 5.69531 14.4183 3 10 3Z"
                  fill="currentColor"
                />
              </svg>
              카카오 로그인
            </button>

            <div className="flex justify-center w-full overflow-hidden rounded-[10px]">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.error("🔴 GoogleLogin onError triggered");
                  toast.error("구글 로그인에 실패했습니다.");
                }}
                useOneTap
                theme="outline"
                size="large"
                shape="rectangular"
                width="384"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
