# 시스템 구성 점검 TODO

작성일: 2026-03-11
대상 저장소: `Admin-Vanilla-Publishing`

## 1) 주요 문제점 (현황)

### A. API 계약 불일치
- [x] 프론트엔드가 호출하는 API 목록과 `backend_fastapi` 제공 API 목록 불일치 확인 완료
- [x] `public/assets/js` 기준 미구현 경로(`/api/menu`, `/api/members`, `/db/*`, `/upload/image` 등) 인벤토리 확정
- [x] 화면별(HTML 단위) 필요 API 매핑 테이블 작성

### B. 백엔드 이중화/드리프트
- [x] `backend`(legacy)와 `backend_fastapi`(current) 공존으로 유지보수 경로 혼재
- [x] README/실행 스크립트/실제 엔드포인트 간 불일치 항목 정리
- [x] 단일 백엔드 기준(권장: `backend_fastapi`) 확정 전까지 변경 동결 범위 정의

### C. 보안 취약 기본값
- [x] CORS 설정(`*` + credentials) 운영 부적합
- [x] 데모 계정/비밀번호 하드코딩 제거 필요
- [x] 기본 DB 자격증명/토큰 정책(만료/재발급) 미정

### D. 기동 안정성 부족
- [x] DB 컨테이너 readiness 확인 없이 API 시작되는 레이스 가능성
- [x] `docker-compose` healthcheck 부재
- [x] `run_backend.sh`가 개발/운영 모드 구분 없이 `--reload` 사용

### E. 환경 독립성 부족
- [x] 프론트 코드 내 `127.0.0.1:8080` 하드코딩 잔존
- [x] API base 설정 방식 혼재(상대경로 + 절대경로 혼용)

---

## 2) 고도화 대상 (우선순위)

## P0 (즉시)
- [x] API 계약 단일화
  - 기준 백엔드: `backend_fastapi`
  - 산출물: `docs/api-mapping.md` (화면별 호출 API, 구현 여부, 담당 파일)
- [x] 프론트 API 경로 정규화
  - `window.APP_API_BASE` 단일 진입점 사용
  - 하드코딩 주소(`127.0.0.1:8080`) 제거
- [x] 실행 문서 정합성 복구
  - 루트 `Readme.md`, `backend/README.md`, `backend_fastapi/README.md`를 실제 실행 경로 기준으로 일치화

## P1 (단기)
- [x] 보안 기본선 적용
  - CORS 화이트리스트 방식 전환(환경변수 기반)
  - 데모 인증 제거 또는 개발 전용 플래그로 격리
  - JWT 서명키/만료시간/리프레시 정책 도입
- [x] 기동 안정화
  - DB healthcheck 추가
  - API 시작 전 DB ready-wait 로직 추가
  - 개발/운영 실행 옵션 분리(`--reload` 개발 전용)

## P2 (중기)
- [ ] 데이터/스키마 관리 체계화
  - SQLAlchemy `create_all` 중심에서 마이그레이션(Alembic) 체계로 전환
- [ ] 테스트/CI 최소 기준 도입
  - 통합 테스트: `/health`, `/login`, `/api/bookings`, `/api/reservations`
  - PR 기준 자동 실행 파이프라인 구성
- [ ] 관측성 강화
  - 구조화 로깅(요청 ID, 상태코드, 에러코드)
  - 기본 헬스체크 분리(`/health/live`, `/health/ready`)

---

## 3) 실행 계획 (제안)

### Sprint 1
- [x] API 매핑 문서 작성
- [x] 프론트 하드코딩 URL 제거
- [x] README 정합성 정리

### Sprint 2
- [x] CORS/인증 정책 반영
- [x] DB readiness + compose healthcheck 반영
- [x] run script 개발/운영 분리

### Sprint 3
- [ ] Alembic 초기 도입
- [ ] 통합 테스트 및 CI 구성
- [ ] 운영 관측성(로그/헬스) 보강

---

## 4) 완료 기준(Definition of Done)
- [ ] 모든 주요 화면 진입 시 콘솔/네트워크에서 404 API 호출 없음
- [ ] 문서 기준 실행 절차 1개로 신규 환경에서 재현 가능
- [x] 보안 기본값(비밀키/계정/CORS) 하드코딩 제거
- [ ] CI에서 핵심 API 테스트 통과
