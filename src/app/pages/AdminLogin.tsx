import { useNavigate } from "react-router";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    // TODO: Implement Kakao OAuth login
    navigate("/admin");
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth login
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[20px] p-8 shadow-sm">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#242322] mb-2">BOOKIIBOOKII</h1>
            <p className="text-[#858481]">관리자 로그인</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleKakaoLogin}
              className="w-full bg-[#FEE500] text-[#000000] py-4 rounded-[10px] font-medium hover:bg-[#FDD835] transition-colors flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3C5.58172 3 2 5.89543 2 9.5C2 11.6484 3.23828 13.5547 5.16797 14.7344L4.35547 17.6172C4.28516 17.8594 4.55078 18.0547 4.75781 17.9062L8.14844 15.6094C8.75781 15.7109 9.37109 15.7656 10 15.7656C14.4183 15.7656 18 12.8984 18 9.29688C18 5.69531 14.4183 3 10 3Z" fill="currentColor"/>
              </svg>
              카카오 로그인
            </button>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-[#242322] py-4 rounded-[10px] font-medium border-2 border-[#e2e1df] hover:bg-[#f4f3f1] transition-colors flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18.1713 8.36788H17.5V8.33329H10V11.6666H14.7096C14.0225 13.6071 12.1762 15 10 15C7.23875 15 5 12.7612 5 9.99996C5 7.23871 7.23875 4.99996 10 4.99996C11.2746 4.99996 12.4342 5.48079 13.3171 6.26621L15.6742 3.90913C14.1858 2.52204 12.195 1.66663 10 1.66663C5.39792 1.66663 1.66667 5.39788 1.66667 9.99996C1.66667 14.602 5.39792 18.3333 10 18.3333C14.6021 18.3333 18.3333 14.602 18.3333 9.99996C18.3333 9.44121 18.2758 8.89579 18.1713 8.36788Z" fill="#FFC107"/>
                <path d="M2.6275 6.12121L5.36542 8.12954C6.10625 6.29537 7.90042 4.99996 10 4.99996C11.2746 4.99996 12.4342 5.48079 13.3171 6.26621L15.6742 3.90913C14.1858 2.52204 12.195 1.66663 10 1.66663C6.79917 1.66663 4.02334 3.47371 2.6275 6.12121Z" fill="#FF3D00"/>
                <path d="M10 18.3333C12.1525 18.3333 14.1083 17.5095 15.5871 16.1691L13.0079 13.9875C12.1431 14.6452 11.0864 15.0008 10 15C7.83251 15 5.99209 13.6179 5.29876 11.6891L2.58126 13.7829C3.96043 16.4816 6.76126 18.3333 10 18.3333Z" fill="#4CAF50"/>
                <path d="M18.1713 8.36796H17.5V8.33337H10V11.6667H14.7096C14.3809 12.5902 13.7889 13.3972 13.0067 13.9879L13.0079 13.9871L15.5871 16.1688C15.4046 16.3354 18.3333 14.1667 18.3333 10C18.3333 9.44129 18.2758 8.89587 18.1713 8.36796Z" fill="#1976D2"/>
              </svg>
              Google 로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}