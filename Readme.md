# Admin Vanilla Publishing

정적 HTML/Vanilla JS 화면과 Python(FastAPI)+PostgreSQL 백엔드를 함께 사용하는 샘플 프로젝트입니다.

## 1. 기술 스택 분석

### Frontend
- **Vanilla JavaScript + HTML/CSS** 기반 멀티 페이지 구성 (`public/*.html`).
- **Tailwind CSS(번들 파일)** 및 커스텀 CSS 사용.
- 주요 UI 라이브러리(정적 번들 포함):
  - TUI Grid
  - TUI Pagination
  - FullCalendar (calendar3)
  - AG Grid

### Backend
- **Python 3 + FastAPI** (`backend_fastapi/app/main.py`).
- **SQLAlchemy 2.x ORM** (`backend_fastapi/app/models.py`, `database.py`).
- **PostgreSQL** 연결 (`DATABASE_URL`, `psycopg2-binary`).
- `uvicorn`으로 API 서버 실행.

### Infra/실행
- `docker compose`로 PostgreSQL 컨테이너 실행 (`backend_fastapi/docker-compose.yml`).
- `run_backend.sh`로 백엔드 + 프론트 정적 서버 동시 실행.

---

## 2. Python만으로 실행되는 모듈 체크

아래는 Node/Express 없이 **Python 실행만으로 동작 가능한 모듈**입니다.

1. **FastAPI 백엔드 모듈**
   - 경로: `backend_fastapi/app/*`
   - 실행: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

2. **정적 프론트 서빙(파이썬 기본 모듈)**
   - 경로: `public/*`
   - 실행: `python3 -m http.server 5173 --directory public`

3. **통합 실행 스크립트(파이썬 런타임 의존)**
   - 파일: `run_backend.sh`
   - 내부적으로 Python venv 구성, 의존성 설치, FastAPI 실행, `http.server` 실행.

---

## 3. HTML 화면 기준 PostgreSQL 테이블/데이터 매핑

이번 반영에서 아래 화면과 API를 직접 연결했습니다.

### A) `public/work.html` (객실/예약 화면)
- FE API: `GET /api/bookings`
- DB 테이블: `hotel_bookings`
  - `room_id`, `guest_name`, `check_in_date`, `check_out_date`, `arrival_time`, `departure_time`, `cost`
- 서버 시작 시 샘플 데이터 자동 시드.

### B) `public/consultation.html` (병원 예약 화면)
- FE API: `GET /api/reservations`
- DB 테이블: `medical_reservations`
  - `name`, `department_id`, `date`, `time`
- 서버 시작 시 샘플 데이터 자동 시드.

> 기존 `todos` 테이블 및 `/api/todos` API는 그대로 유지됩니다.

---

## 4. FE-Backend 연동 개선 내용

- `public/assets/js/work.js`
  - 상대경로(`/api/bookings`) 대신 `API_BASE` 기반 호출로 변경.
- `public/assets/js/hospital.js`
  - 상대경로(`/api/reservations`) 대신 `API_BASE` 기반 호출로 변경.
- 기본값: `http://localhost:8000`
  - 필요 시 `window.APP_API_BASE`로 오버라이드 가능.

이제 프론트를 `:5173`에서 띄워도 백엔드 `:8000`과 직접 통신할 수 있습니다.

---

## 5. 실행 방법

### 5.1 빠른 실행
```bash
./run_backend.sh
```
- PostgreSQL 컨테이너 실행
- FastAPI 실행 (`:8000`)
- 정적 프론트 실행 (`:5173`)

### 5.2 수동 실행
```bash
# 1) DB 실행
cd backend_fastapi
docker compose up -d db

# 2) 백엔드 실행
cd ../backend_fastapi
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL='postgresql+psycopg2://newhomepage:newhomepage@localhost:5432/newhomepage'
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 3) 프론트 실행(별도 터미널)
cd ..
python3 -m http.server 5173 --directory public
```

### 5.3 확인 URL
- Health: `http://localhost:8000/health`
- Work 화면: `http://localhost:5173/work.html`
- Consultation 화면: `http://localhost:5173/consultation.html`
