# NewHomePage 리팩토링 가이드

이 문서는 프로젝트를 **전체 구조 관점에서 정리(리팩토링)** 하고, 현재 사용 중인 **기술 스택**과 **운영 방식**을 한 번에 파악할 수 있도록 작성되었습니다.

## 1) 프로젝트 개요

- Express 기반 API 서버와 정적 HTML/JS UI를 함께 제공하는 하이브리드 구조입니다.
- DB는 목적별로 MSSQL(`dbConfig.js`)과 MySQL(`wms-api.js`)을 분리해서 사용합니다.
- 프런트엔드는 `public/` 정적 리소스 + `src/index.jsx` 진입 로직(Vite 빌드)으로 동작합니다.

---

## 2) 리팩토링 요약

### ✅ 적용된 정리 내용

1. **초기 라우팅 로직 분리**
   - `src/index.jsx`에 있던 로그인/즐겨찾기 경로 분기 로직을 `src/utils/routeResolver.js`로 분리했습니다.
   - `favorite-1st`가 문자열/JSON 모두 가능하도록 안정성을 개선했습니다.

2. **MSSQL 설정 구조 개선**
   - `dbConfig.js`를 환경변수 중심으로 재구성했습니다.
   - 숫자형 설정(pool 옵션)을 안전하게 파싱하도록 개선했습니다.

3. **MySQL 설정 하드코딩 완화**
   - `wms-api.js`에서 DB 연결 정보를 환경변수 우선으로 변경했습니다.
   - 포트 설정을 명시하고, 연결 로그 흐름을 정리했습니다.

---

## 3) 기술 스택 (관련 기술 정리)

### Frontend
- HTML5 / CSS3 / Vanilla JavaScript
- React 18 (`src/index.jsx` 진입 처리)
- Vite 6 (프런트 번들링)
- UI/시각화 라이브러리
  - Toast UI Calendar / Editor
  - FullCalendar
  - TUI Grid
  - Chart.js
  - ApexCharts
  - Handsontable
  - TinyMCE

### Backend
- Node.js
- Express 4
- 인증: `jsonwebtoken` (JWT)
- 파일 업로드: `multer`
- API 문서: `swagger-jsdoc`, `swagger-ui-express`

### Database
- MSSQL (`mssql`)
- MySQL/MariaDB (`mysql2`)

### DevOps / Infra
- Docker (`Dockerfile`, `Dockerfile_nginx`)
- Nginx (`nginx.conf`)
- DevContainer (`.devcontainer/devcontainer.json`)

---

## 4) 디렉터리 구조 (핵심)

```text
.
├─ public/                  # 정적 페이지/리소스
│  ├─ assets/               # 공통 JS/CSS/Mock/이미지
│  ├─ calendar/             # 캘린더 샘플 페이지
│  └─ *.html                # 주요 화면
├─ src/
│  ├─ index.jsx             # 진입점 (라우팅 리디렉션)
│  └─ utils/routeResolver.js
├─ server.js                # Express 메인 서버
├─ wms-api.js               # MySQL 기반 API 라우터
├─ dbConfig.js              # MSSQL 연결 설정
└─ swagger.json             # Swagger 스키마
```

---

## 5) 실행 방법

### 로컬 개발
```bash
npm install
npm run dev
```

### 프런트 빌드
```bash
npm run build
```

### 서버 실행
```bash
npm start
```

---

## 6) 환경변수 권장 목록

### MSSQL
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_NAME`
- `DB_ENCRYPT` (`true`/`false`)
- `DB_TRUST_CERT` (`true`/`false`)
- `DB_POOL_MAX`
- `DB_POOL_MIN`
- `DB_IDLE_TIMEOUT_MS`

### MySQL
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`

---

## 7) 다음 리팩토링 제안

- `server.js`의 DB 핸들러를 도메인별 라우터/서비스로 분리
- 공통 응답 포맷(`success`, `message`, `data`) 유틸 통합
- `public/assets/js` 파일을 화면 단위 모듈로 재정리
- 테스트 기반 추가(Jest + supertest)로 API 안정성 강화
