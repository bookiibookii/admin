import { useNavigate } from "react-router";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../lib/api";

async function checkAdminRole(accessToken: string): Promise<boolean> {
  // TODO: GET /admin/me API가 구현되면 여기서 호출하여 관리자 권한을 서버에서 확인한다.
  // 현재는 로그인 응답의 role 필드로 판단하므로 이 함수는 호출되지 않는다.
  void accessToken;
  return false;
}

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    const payload = JSON.parse(atob(idToken.split(".")[1]));
    console.log("[Login] Google 소셜 ID (sub):", payload.sub);
    console.log("[Login] Google 이메일:", payload.email);
    console.log("[Login] Google credential received, length:", idToken?.length);

    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");

      const { data } = await api.post("/api/auth/login", {
        socialType: "GOOGLE",
        token: idToken,
      });

      console.log("[Login] API response:", data);

      if (data.isSuccess) {
        const { accessToken, refreshToken, role } = data.result;

        if (role === "ADMIN") {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("userRole", role);
          toast.success("관리자 로그인에 성공했습니다.");
          navigate("/dashboard");
        } else {
          console.warn("[Login] Not ADMIN, role:", role);
          navigate("/unauthorized");
        }
      } else {
        console.warn("[Login] isSuccess false:", data);
        toast.error(data.message || "로그인 처리에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("[Login] Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const message = error.response?.data?.message;
      toast.error(`[${error.response?.status ?? "NET"}] ${message || "서버와 통신 중 문제가 발생했습니다."}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[20px] p-8 shadow-sm">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#ff7618] rounded-[20px] mb-4">
              <span className="text-white text-2xl font-bold">B</span>
            </div>
            <h1 className="text-2xl font-bold text-[#242322]">BOOKIIBOOKII</h1>
            <p className="text-[#858481] mt-1 text-sm">관리자 로그인</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-center w-full overflow-hidden rounded-[10px]">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("구글 로그인에 실패했습니다.")}
                theme="outline"
                size="large"
                shape="rectangular"
                width="384"
              />
            </div>

            <button
              disabled
              className="w-full bg-[#FEE500] text-[#000000]/40 py-4 rounded-[10px] font-medium flex items-center justify-center gap-3 cursor-not-allowed opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 3C5.58172 3 2 5.89543 2 9.5C2 11.6484 3.23828 13.5547 5.16797 14.7344L4.35547 17.6172C4.28516 17.8594 4.55078 18.0547 4.75781 17.9062L8.14844 15.6094C8.75781 15.7109 9.37109 15.7656 10 15.7656C14.4183 15.7656 18 12.8984 18 9.29688C18 5.69531 14.4183 3 10 3Z"
                  fill="currentColor"
                />
              </svg>
              카카오 로그인 (준비 중)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

void checkAdminRole;
