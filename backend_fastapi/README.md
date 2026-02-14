# FastAPI + PostgreSQL Backend

기존 정적 FE(`public/*.html`)와 연동하기 위한 Python 백엔드입니다.

## 1) 실행

```bash
cd backend_fastapi
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL='postgresql+psycopg2://newhomepage:newhomepage@localhost:5432/newhomepage'
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 2) 테이블 자동 생성/시드

서버 시작 시 아래 테이블이 자동 생성됩니다.
- `todos`
- `hotel_bookings`
- `medical_reservations`

`hotel_bookings`, `medical_reservations`는 최초 1회 샘플 데이터가 자동 입력됩니다.

## 3) API

- `GET /health`
- `GET /api/todos`
- `POST /api/todos`
- `GET /api/bookings` : `work.html` 객실 예약 데이터
- `GET /api/reservations` : `consultation.html` 병원 예약 데이터
- `POST /login` : `login.html` 로그인 요청(`admin/manager/guest`, 비밀번호 `1111`)

## 4) FE 연동 포인트

프론트 스크립트는 기본적으로 `http://localhost:8000`을 API 베이스로 사용합니다.

```js
const API_BASE = window.APP_API_BASE || 'http://localhost:8000';
```

필요 시 HTML에서 `window.APP_API_BASE`를 먼저 세팅해서 다른 API 주소를 사용할 수 있습니다.
