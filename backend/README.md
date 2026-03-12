# backend

이 디렉터리는 legacy FastAPI 구현 보관용입니다.

## 현재 상태

- 운영/개발 기준 백엔드는 `backend_fastapi/` 입니다.
- 신규 수정, 실행 문서, API 기준선은 `backend_fastapi` 를 따릅니다.
- `backend/` 의 라우트는 과거 구현 참고용이며 점진적으로 정리 대상입니다.

## 사용 지침

- 새 작업은 `backend_fastapi/` 에 반영합니다.
- 화면별 API 매핑은 [docs/api-mapping.md](/home/Admin-Vanilla-Publishing/docs/api-mapping.md) 를 확인합니다.
- 루트 실행은 `./run_backend.sh` 만 사용합니다.
