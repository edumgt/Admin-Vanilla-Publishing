# FastAPI + PostgreSQL Backend (FE 연동용)

이 디렉터리는 기존 FE와 연동할 수 있는 Python FastAPI 백엔드 예시입니다.

## 1) 실행 방법 (로컬)

```bash
cd backend_fastapi
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

PostgreSQL을 먼저 실행한 뒤 API를 실행합니다.

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 2) Docker Compose 실행

```bash
cd backend_fastapi
cp .env.example .env
docker compose up --build
```

## 3) 기본 API

- `GET /health` : 서버 헬스체크
- `GET /api/todos` : TODO 목록 조회
- `POST /api/todos` : TODO 생성

### POST 예시

```json
{
  "title": "FE 연동 테스트",
  "description": "FastAPI + PostgreSQL 연결 확인"
}
```

## 4) FE 연동 예시 (fetch)

```js
const API_BASE = 'http://localhost:8000';

export async function fetchTodos() {
  const res = await fetch(`${API_BASE}/api/todos`);
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

export async function createTodo(payload) {
  const res = await fetch(`${API_BASE}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to create todo');
  return res.json();
}
```
