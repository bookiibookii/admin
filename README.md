# BOOKIIBOOKII 어드민

부키부키(교환 독서 서비스) 관리자 대시보드.

배포 URL: **https://admin.bookiibookii.com**

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | React 18 + TypeScript |
| 빌드 | Vite 6 |
| 스타일 | Tailwind CSS v4 |
| 라우팅 | React Router v7 |
| UI 컴포넌트 | Radix UI + shadcn/ui |
| 차트 | Recharts |
| HTTP 클라이언트 | Axios |
| 인증 | Google OAuth (`@react-oauth/google`) |
| 알림 | Sonner (toast) |
| 마크다운 | react-markdown |
| 배포 | Vercel |

---

## 로컬 실행

```bash
npm install
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.  
Vite 프록시가 `/api/*` 요청을 `https://bookii.gyeonseo.com`으로 포워딩합니다.

---

## 빌드 및 배포

```bash
npm run build   # dist/ 폴더 생성
```

`main` 브랜치에 푸시하면 Vercel이 자동으로 빌드·배포합니다.  
Vercel `rewrites` 설정으로 `/api/*` → `https://bookii.gyeonseo.com/api/*` 프록시가 적용됩니다.

---

## 환경변수

| 변수 | 설명 | 예시 |
|------|------|------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | `*.apps.googleusercontent.com` |

`.env` (로컬) 또는 Vercel 대시보드 환경변수에 설정합니다.

---

## 프로젝트 구조

```
src/
├── app/
│   ├── components/
│   │   ├── AdminLayout.tsx   # 사이드바 + 레이아웃 (반응형, 접기/펼치기)
│   │   └── PrivateRoute.tsx  # 인증 가드
│   └── pages/
│       ├── AdminLogin.tsx        # Google 소셜 로그인
│       ├── Dashboard.tsx         # 대시보드 (최근 공지, 유저·그룹 요약)
│       ├── NoticeList.tsx        # 공지사항 목록
│       ├── NoticeDetail.tsx      # 공지사항 상세 (마크다운 렌더링)
│       ├── NoticeEditor.tsx      # 공지사항 등록·수정
│       ├── UserStats.tsx         # 유저 통계 (가입 추이, 온보딩, 교차 통계)
│       ├── GroupStats.tsx        # 그룹 통계 (인기 콘텐츠, 단계 현황, 목록)
│       ├── GroupDetail.tsx       # 그룹 상세 + 강제 종료
│       └── AdminManagement.tsx   # 관리자 계정 목록
├── lib/
│   └── api.ts                # Axios 인스턴스 (baseURL, 인터셉터)
└── main.tsx
```

---

## 주요 기능

### 인증
- Google 소셜 로그인 — 로그인 응답의 `role === "ADMIN"` 여부로 접근 제어
- 로그인 성공 시 `accessToken`, `refreshToken`, `adminNickname` localStorage 저장
- 401 응답 시 자동 로그아웃

### 공지사항 관리
- 목록: 공지 ID(`N-001`), 제목, 최초 작성일(상대시간), 수정일, 작성자
- 상세: react-markdown 렌더링, 수정됨 배지
- 등록·수정: 제목 + 내용(markdown, emoji 지원)
- 삭제: AlertDialog 확인 후 처리

### 유저 통계
- 가입자 수 추이 (일간 / 주간 / 월간 / 연간 라인차트)
- 온보딩 결과: 성별·연령대 분포, 인생 책 TOP 5, 독서 스타일
- 교차 통계: 성별(0~1개) + 연령대(0~1개) 독립 선택 → 조합 인사이트 카드

### 그룹 통계
- 인기 콘텐츠 TOP 10 (책 / 저자 / 출판사)
- 장르·교환 방식 분포 도넛차트
- 진행 단계 현황: 직접 교환 / 택배 교환 전환 (모집 중→내 책 읽기→교환→파트너 책 읽기→반납→종료)
- 그룹 목록: 최신순, 20/50/100/200개씩 보기, 페이지네이션

### 그룹 상세
- 진행 단계 스테퍼
- 호스트·게스트 정보
- 강제 종료 (AlertDialog 확인)

### 관리자
- ADMIN 권한 계정 읽기 전용 목록

---

## API 연동 현황

현재 **공지사항 CRUD**와 **Google 소셜 로그인**만 실제 API와 연동됩니다.  
나머지 페이지(유저 통계, 그룹 통계, 관리자)는 더미 데이터로 동작합니다.

API 연동이 준비되면 각 파일 내 `// TODO: API 연동 시 교체` 주석을 참고하세요.

---

## 로고 이미지

`public/logo.png`에 로고 파일을 배치하면 사이드바에 표시됩니다.  
파일이 없으면 주황 배경의 "B" 텍스트로 폴백합니다.
