# FastAPI Backend

백엔드를 **FastAPI + PostgreSQL 단일 DB** 구조로 전환했습니다.

## 실행

```bash
pip install -r backend/requirements.txt
export DATABASE_URL='postgresql://postgres:postgres@localhost:5432/kegtest'
uvicorn backend.main:app --host 0.0.0.0 --port 3000 --reload
```

## 주요 변경점

- 기존 `Express + MSSQL/MySQL` 백엔드를 `FastAPI + asyncpg(PostgreSQL)`로 통합
- `/db/*`, `/api/*`, `/login`, `/protected`, 파일 업로드 라우트를 FastAPI로 이관
- 정적 파일(`public`) 서빙 유지
- OpenAPI 문서는 FastAPI 기본 `/docs` 사용

- 그리드 화면용 `/db/inbound`, `/db/outbound`, `/api/member-permissions` 데이터는 시작 시 PostgreSQL에 최소 50건 mock 데이터로 자동 보정
- 수동 보정 엔드포인트: `POST /api/grid/mock-seed`
