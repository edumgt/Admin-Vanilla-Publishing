# API Mapping

기준 백엔드: `backend_fastapi`

## 기준 규칙

- 정적 화면과 API는 기본적으로 같은 오리진 `http://localhost:8000` 에서 제공합니다.
- 프론트 스크립트는 `window.APP_API_BASE` 가 있으면 우선 사용하고, 없으면 현재 오리진을 사용합니다.
- `backend/` 디렉터리는 참조용 legacy 구현이며, 신규 수정 기준은 `backend_fastapi/` 입니다.

## 화면별 매핑

| 화면 | HTML | 스크립트 | 호출 API | 상태 | 담당 파일 |
| --- | --- | --- | --- | --- | --- |
| 공통 메뉴 | `public/*.html` | `public/assets/js/logomodule.js` | `GET /api/menu` | 구현 | `backend_fastapi/app/main.py` |
| 로그인 | `public/index.html`, `public/login.html` | `public/assets/js/login.js` | `POST /login`, `POST /auth/refresh` | 구현 | `backend_fastapi/app/main.py` |
| 코드관리 | `public/system.html` | `public/assets/js/app.js` | `GET /api/data`, `POST /api/save`, `POST /api/delete`, `GET /api/permissions` | 구현 | `backend_fastapi/app/main.py` |
| 용어관리 목록 | `public/glos.html` | `public/assets/js/gloscrud.js` | `GET /api/glos`, `POST /api/setGlos`, `PUT /api/glos/{id}`, `POST /api/glos/delete`, `GET /api/getGlosReq` | 구현 | `backend_fastapi/app/main.py` |
| 용어 카드형 화면 | `public/3.html` | `public/assets/js/glos.js` | `GET /api/glos`, `POST /api/glos_req` | 구현 | `backend_fastapi/app/main.py` |
| 예약관리 | `public/work.html` | `public/assets/js/work.js` | `GET /api/bookings` | 구현 | `backend_fastapi/app/main.py` |
| 병원예약 | `public/hospital.html` | `public/assets/js/hospital.js` | `GET /api/reservations` | 구현 | `backend_fastapi/app/main.py` |
| 컨설팅 지정 | `public/network.html` | `public/assets/js/consultation.js` | `GET /api/members`, `GET /api/reservations` | 구현 | `backend_fastapi/app/main.py` |
| 회원통계 | `public/stati.html` | `public/assets/js/stati.js` | `GET /api/members` | 구현 | `backend_fastapi/app/main.py` |
| 계정 팝업 | `public/account-pop.html` | `public/assets/js/account-pop.js` | `GET /api/members` | 구현 | `backend_fastapi/app/main.py` |
| WMS | `public/wms.html` | `public/assets/js/wms.js` | `GET /db/inbound`, `GET /db/outbound`, `POST /db/inbound/add`, `POST /db/outbound/add`, `POST /db/inbound/update`, `POST /db/outbound/update`, `POST /db/inbound/delete`, `POST /db/outbound/delete` | 구현 | `backend_fastapi/app/main.py` |
| 일정관리 | `public/calendar.html` | `public/assets/js/calendar.js` | `GET /api/calendar`, `POST /api/calendar/mock-seed`, `POST /api/addDate`, `POST /api/addEvent`, `DELETE /api/deleteEvent/{event_id}` | 구현 | `backend_fastapi/app/main.py` |
| 코드그룹 데모 | `public/kegcode.html` | `public/assets/js/kegcode.js` | `GET /api/codegroup`, `GET /api/code` | 구현 | `backend_fastapi/app/main.py` |
| 조직/강의실 트리 | `public/orgsel.html` | `public/assets/js/orgsel.js` | `GET /api/SitePlaceRoom` | 구현 | `backend_fastapi/app/main.py` |
| SQL 콘솔 데모 | `public/4.html` | `public/assets/js/4.js` | `POST /db/dynamicConnect`, `POST /db/query` | 구현 | `backend_fastapi/app/main.py` |
| 이미지 업로드 편집기 | `public/kegeditor.html`, `public/kegeditor2.html` | 인라인 스크립트 | `POST /upload/image` | 구현 | `backend_fastapi/app/main.py` |
| API 리스트 데모 | `public/5.html` | 인라인 스크립트 | `GET /api/list` | 구현 | `backend_fastapi/app/main.py` |

## 현재 비대상 legacy 엔드포인트

아래 라우트는 `backend/main.py` 에만 남아 있고 현재 `backend_fastapi` 로는 옮기지 않았습니다.

- `POST /db/SiteUser`
- `POST /db/PlaceUser`
- `POST /db/SitePlace`
- `POST /listbox/SitePlace`
- `POST /listbox/SiteUser`
- `GET /api/member-permissions`

이 라우트들은 현재 저장소의 주요 화면 진입 경로에서 직접 사용되지 않거나, mock JSON/localStorage 로 대체되어 있습니다.

## 하드코딩 제거 반영

- `127.0.0.1:8080` 하드코딩 제거
  - `public/assets/js/kegcode.js`
  - `public/assets/js/orgsel.js`
  - `public/assets/js/wms.js`
- `localhost:8000` 기본값을 `window.APP_API_BASE || window.location.origin` 패턴으로 정규화
  - `public/assets/js/common.js`
  - `public/assets/js/login.js`
  - `public/assets/js/work.js`
  - `public/assets/js/hospital.js`
  - `public/assets/js/consultation.js`
  - `public/assets/js/account-pop.js`
  - `public/assets/js/4.js`
  - `public/assets/js/stati.js`

## 검증 포인트

- `./run_backend.sh` 실행 후 `http://localhost:8000/` 기준으로 화면 접근
- `GET /health`, `GET /health/live`, `GET /health/ready`
- 공통 메뉴가 필요한 화면에서 `/api/menu` 404 없음
- `work.html`, `hospital.html`, `calendar.html`, `wms.html`, `system.html` 진입 시 핵심 API 404 없음
