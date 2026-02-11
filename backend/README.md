# FastAPI Backend

백엔드를 **FastAPI + PostgreSQL 단일 DB** 구조로 전환했습니다.
Node/Express 기반 백엔드 실행 경로는 제거하고 Python 실행 경로만 유지합니다.

## 실행

### 권장: 루트 실행 스크립트 사용

```bash
./run_backend.sh
```

### 수동 실행

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
export DATABASE_URL='postgresql://postgres:postgres@localhost:5432/newhomepage'
uvicorn backend.main:app --host 0.0.0.0 --port 3000 --reload
```

## 주요 변경점

- 기존 `Express + MSSQL/MySQL` 백엔드를 `FastAPI + asyncpg(PostgreSQL)`로 통합
- `/db/*`, `/api/*`, `/login`, `/protected`, 파일 업로드 라우트를 FastAPI로 이관
- 정적 파일(`public`) 서빙 유지
- OpenAPI 문서는 FastAPI 기본 `/docs` 사용
- 그리드 화면용 `/db/inbound`, `/db/outbound`, `/api/member-permissions` 데이터는 시작 시 PostgreSQL에 최소 50건 mock 데이터로 자동 보정
- 수동 보정 엔드포인트: `POST /api/grid/mock-seed`
