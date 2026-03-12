# backend_fastapi

현재 저장소의 기준 백엔드입니다.

## 역할

- `public/` 정적 파일 서빙
- 로그인/JWT 발급
- 블루마블을 포함한 HTML 화면용 데모 API 제공
- PostgreSQL 기반 `todos`, `hotel_bookings`, `medical_reservations` 테이블 관리

## 실행

루트에서 실행:

```bash
./run_backend.sh
```

또는 수동 실행:

```bash
cd backend_fastapi
python3 -m venv ../.venv
source ../.venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL='postgresql+psycopg2://newhomepage:newhomepage@localhost:5432/newhomepage'
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 핵심 엔드포인트

- `GET /health`
- `GET /health/live`
- `GET /health/ready`
- `POST /login`
- `POST /auth/refresh`
- `GET /api/bookings`
- `GET /api/reservations`
- `GET /api/menu`
- `GET /api/members`
- `GET /api/data`
- `GET /db/inbound`
- `GET /db/outbound`

화면별 전체 매핑은 [docs/api-mapping.md](/home/Admin-Vanilla-Publishing/docs/api-mapping.md) 를 참고하세요.

## 설정

샘플 환경 변수는 [backend_fastapi/.env.example](/home/Admin-Vanilla-Publishing/backend_fastapi/.env.example) 에 있습니다.

주요 항목:

- `APP_ENV`
- `DATABASE_URL`
- `CORS_ALLOW_ORIGINS`
- `JWT_SECRET_KEY`
- `DEMO_AUTH_ENABLED`
- `DEMO_USERS_JSON`
