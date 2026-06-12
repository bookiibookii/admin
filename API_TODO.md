# 부키부키 어드민 웹 — API 연동 현황 및 요청 목록

> 마지막 업데이트: 2026-06-12  
> 어드민 웹 기준으로 아직 연결되지 않았거나, 서버팀 개발이 필요한 항목을 정리합니다.

---

## 1. 서버팀 신규 개발이 필요한 API

현재 Swagger에 존재하지 않으며, 어드민 웹 기능 구현을 위해 서버에서 새로 만들어야 하는 엔드포인트입니다.

### 1-1. 공지사항 어드민 상세 조회
| 항목 | 내용 |
|---|---|
| 메서드 | `GET` |
| 경로 | `/api/admin/notice/{noticeId}` |
| 필요 이유 | 현재 어드민 공지 상세 페이지에서 공개 API(`GET /api/notice/{noticeId}`)를 사용 중. 공개 API는 `authorNickname`, `updatedAt`, `summary` 필드를 반환하지 않아 어드민 목록 API를 병렬 호출하는 우회책을 사용 중. 전용 어드민 상세 API가 필요함. |
| 필요 응답 필드 | `noticeId`, `title`, `summary`, `content`, `authorNickname`, `updatedByNickname`, `createdAt`, `updatedAt` |

### 1-2. 관리자 계정 목록 조회
| 항목 | 내용 |
|---|---|
| 메서드 | `GET` |
| 경로 | `/api/admin/users` (예시, 실제 경로는 서버팀과 협의) |
| 필요 이유 | 관리자 페이지(`/admins`)에서 ADMIN 권한 계정 목록을 표시해야 하나 현재 API 없음. 페이지 UI는 준비 완료(번호·닉네임·이메일 컬럼). |
| 필요 응답 필드 | `id`, `nickname`, `email` |

### 1-3. 그룹 강제 종료
| 항목 | 내용 |
|---|---|
| 메서드 | `PATCH` |
| 경로 | `/api/admin/groups/{groupId}/force-close` |
| 필요 이유 | 그룹 상세 페이지(`GroupDetail.tsx`)에 강제 종료 버튼 UI가 있으나 API 없어 TODO로만 남겨진 상태. |
| 필요 응답 | 성공/실패 여부 |

### 1-4. 유저 통계 조회
| 항목 | 내용 |
|---|---|
| 메서드 | `GET` |
| 경로 | `/api/admin/stats/users` (예시) |
| 필요 이유 | 유저 통계 페이지(`/user-stats`)와 대시보드 유저 통계 카드가 현재 전부 하드코딩 더미 데이터. 실제 데이터 연동 불가. |
| 필요 응답 필드 (제안) | 기간별 신규 가입자 수, 전체 가입자 수, 성별 분포, 연령대 분포 |

### 1-5. 그룹 통계 조회
| 항목 | 내용 |
|---|---|
| 메서드 | `GET` |
| 경로 | `/api/admin/stats/groups` (예시) |
| 필요 이유 | 그룹 통계 페이지(`/group-stats`)와 대시보드 그룹 통계 카드가 현재 전부 더미 데이터. |
| 필요 응답 필드 (제안) | 전체 그룹 수, 진행 중/종료 그룹 수, 오늘 생성된 그룹 수, 기간별 생성 추이 |

---

## 2. 기존 API 응답 필드 보완 요청

Swagger에 정의되어 있으나 실제 응답에서 필드가 누락되어 있거나 잘못 동작하는 항목입니다.

### 2-1. 공지 작성자 저장 안 됨
| 항목 | 내용 |
|---|---|
| 관련 API | `POST /api/admin/notice`, `PATCH /api/admin/notice/{noticeId}` |
| 현상 | 공지를 등록·수정해도 DB의 `authorNickname`이 null로 저장됨. 어드민 웹에서는 로그인한 계정 닉네임을 임시 폴백으로 표시 중. |
| 요청 | 서버에서 JWT 토큰의 `userId`로 `users.nickname`을 조회해 자동 저장되도록 수정 필요. |

### 2-2. 공지 목록/상세 응답 필드 누락
| 항목 | 내용 |
|---|---|
| 관련 API | `GET /api/admin/notice`, `GET /api/notice/{noticeId}` |
| 현상 | Swagger 스키마에 `authorNickname`, `updatedAt`, `updatedByNickname`, `summary` 미정의. 실제 응답에도 누락되거나 null로 반환됨. |
| 요청 | 어드민 목록 및 상세 응답에 위 필드를 포함시켜줄 것. |

### 2-3. 공개 공지 상세 날짜 포맷 불일치
| 항목 | 내용 |
|---|---|
| 관련 API | `GET /api/notice/{noticeId}` |
| 현상 | 어드민 목록 API(`/api/admin/notice`)는 날짜를 정상 파싱할 수 있는 포맷으로 반환하지만, 공개 상세 API는 다른 포맷(또는 `null`)으로 반환해 프론트에서 NaN 발생. |
| 요청 | 전 API에서 날짜를 ISO 8601 형식(`yyyy-MM-dd'T'HH:mm:ss.SSS+09:00`)으로 통일해줄 것. |

---

## 3. Swagger에 API는 있으나 어드민 웹 페이지 미구현

서버 API는 이미 존재하지만, 어드민 웹에서 해당 페이지/기능을 아직 만들지 않은 항목입니다.

### 3-1. 신고 관리 페이지
현재 사이드바에 메뉴 없음. 아래 API 사용 가능.

| 메서드 | 경로 | 설명 |
|---|---|---|
| `GET` | `/api/admin/report` | 신고 목록 조회 (페이징) |
| `GET` | `/api/admin/report/{reportId}` | 신고 상세 조회 |
| `POST` | `/api/admin/report/{reportId}/process` | 신고 처리 |

### 3-2. 문의 관리 페이지
현재 사이드바에 메뉴 없음. 아래 API 사용 가능.

| 메서드 | 경로 | 설명 |
|---|---|---|
| `GET` | `/api/admin/inquiry` | 전체 문의 내역 조회 (페이징) |
| `GET` | `/api/admin/inquiry/{inquiryId}` | 문의 상세 조회 |
| `PATCH` | `/api/admin/inquiry/{inquiryId}/answer` | 문의 답변 등록/수정 |

---

## 4. 어드민 웹 기능 구현 현황 요약

| 기능 | 상태 | 비고 |
|---|---|---|
| 로그인 (구글) | ✅ 완료 | `/api/auth/login` |
| 닉네임 불러오기 | ✅ 완료 | `/api/mypage` |
| 공지사항 목록 | ✅ 완료 | `/api/admin/notice` |
| 공지사항 등록 | ✅ 완료 | `POST /api/admin/notice` |
| 공지사항 수정 | ✅ 완료 | `PATCH /api/admin/notice/{noticeId}` |
| 공지사항 삭제 | ✅ 완료 | `DELETE /api/admin/notice/{noticeId}` |
| 공지사항 상세 | ⚠️ 우회 | 어드민 목록 + 공개 API 병렬 호출로 대응 중. 전용 어드민 상세 API 필요 |
| 공지 작성자 표시 | ⚠️ 임시 | 서버 미저장으로 인해 로그인 닉네임 폴백 사용 중 |
| 관리자 계정 목록 | ❌ 미연동 | API 없음. UI 준비 완료, 연동 대기 중 |
| 신고 관리 | ❌ 미구현 | API는 있음. 페이지 제작 필요 |
| 문의 관리 | ❌ 미구현 | API는 있음. 페이지 제작 필요 |
| 유저 통계 | ❌ 더미 | 통계 API 없음. 전체 데이터 하드코딩 |
| 그룹 통계 | ❌ 더미 | 통계 API 없음. 전체 데이터 하드코딩 |
| 대시보드 유저/그룹 통계 카드 | ❌ 더미 | 통계 API 없음 |
| 대시보드 공지사항 | ✅ 완료 | `/api/admin/notice` |
| 그룹 강제 종료 | ❌ 미연동 | API 없음. UI 버튼 있음 (TODO 상태) |
