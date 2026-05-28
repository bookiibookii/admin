// app/utils/api.ts
const BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || "";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // 1. Base URL과 엔드포인트(요청 주소) 합치기
  const url = `${BASE_URL}${endpoint}`;

  // 2. 로컬 스토리지에서 액세스 토큰 꺼내기
  const token = localStorage.getItem("accessToken");

  // 3. 헤더 객체 생성
  const headers = new Headers(options.headers || {});

  // Content-Type이 따로 지정되지 않았다면 기본값으로 JSON 설정
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // 토큰이 존재하면 Authorization 헤더에 Bearer 토큰 추가
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // 4. 완성된 url과 헤더로 fetch 요청 보내기
  const response = await fetch(url, { ...options, headers });

  return response;
}
