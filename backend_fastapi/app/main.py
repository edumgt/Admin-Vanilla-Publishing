from collections import defaultdict
from datetime import date, time
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import Depends, FastAPI, File, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from .database import Base, SessionLocal, engine, get_db
from .demo_store import DemoStore
from .models import HotelBooking, MedicalReservation, Todo
from .schemas import (
    LoginRequest,
    LoginResponse,
    MedicalReservationRead,
    RefreshTokenRequest,
    TodoCreate,
    TodoRead,
)
from .security import TokenError, decode_token, issue_token_pair
from .settings import settings

APP_ROOT = Path(__file__).resolve().parents[2]
if not (APP_ROOT / "public").exists():
    APP_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = APP_ROOT / "public"
INFRA_DIR = APP_ROOT / "infra"
UPLOAD_DIR = PUBLIC_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="NewHomePage FastAPI Backend", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_allow_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def seed_hotel_bookings(db: Session) -> None:
    if db.query(HotelBooking).count() > 0:
        return

    demo_rows = [
        HotelBooking(
            room_id="1-1",
            guest_name="김민수",
            check_in_date=date(2026, 1, 10),
            check_out_date=date(2026, 1, 12),
            arrival_time=time(14, 0),
            departure_time=time(11, 0),
            cost=180000,
        ),
        HotelBooking(
            room_id="2-3",
            guest_name="박지은",
            check_in_date=date(2026, 1, 11),
            check_out_date=date(2026, 1, 13),
            arrival_time=time(15, 0),
            departure_time=time(10, 0),
            cost=230000,
        ),
        HotelBooking(
            room_id="5-14",
            guest_name="홍길동",
            check_in_date=date(2026, 1, 12),
            check_out_date=date(2026, 1, 15),
            arrival_time=time(13, 30),
            departure_time=time(11, 30),
            cost=320000,
        ),
    ]
    db.add_all(demo_rows)


def seed_medical_reservations(db: Session) -> None:
    if db.query(MedicalReservation).count() > 0:
        return

    demo_rows = [
        MedicalReservation(
            name="이수진", department_id=1, date=date(2026, 1, 10), time=time(9, 30)
        ),
        MedicalReservation(
            name="최현우", department_id=4, date=date(2026, 1, 10), time=time(10, 15)
        ),
        MedicalReservation(
            name="강다은", department_id=7, date=date(2026, 1, 10), time=time(14, 0)
        ),
        MedicalReservation(
            name="조영호", department_id=2, date=date(2026, 1, 11), time=time(11, 45)
        ),
    ]
    db.add_all(demo_rows)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    app.state.demo_store = DemoStore(APP_ROOT)
    db = SessionLocal()
    try:
        seed_hotel_bookings(db)
        seed_medical_reservations(db)
        db.commit()
    finally:
        db.close()


def get_demo_store() -> DemoStore:
    return app.state.demo_store


def ensure_ready() -> None:
    with SessionLocal() as session:
        session.execute(text("SELECT 1"))


def resolve_safe_path(base_dir: Path, relative_path: str) -> Path | None:
    base_path = base_dir.resolve()
    candidate = (base_path / relative_path).resolve()
    if not candidate.is_relative_to(base_path):
        return None
    return candidate


def serve_file_from(base_dir: Path, relative_path: str, allow_directory_index: bool = True) -> FileResponse:
    file_path = resolve_safe_path(base_dir, relative_path)
    if file_path is None:
        raise HTTPException(status_code=404, detail=f"Path not found: /{relative_path}")

    if file_path.is_dir():
        if allow_directory_index:
            index_file = file_path / "index.html"
            if index_file.is_file():
                return FileResponse(index_file)
        raise HTTPException(status_code=404, detail=f"Path not found: /{relative_path}")

    if file_path.is_file():
        return FileResponse(file_path)

    raise HTTPException(status_code=404, detail=f"Path not found: /{relative_path}")


def authenticate_demo_user(username: str, password: str) -> dict[str, str] | None:
    if not settings.demo_auth_enabled:
        return None
    expected_password = settings.demo_users.get(username)
    if expected_password is None or expected_password != password:
        return None
    return {
        "id": username,
        "name": username,
    }


def build_login_response(username: str, member_id: str, name: str | None = None) -> dict[str, Any]:
    tokens = issue_token_pair(
        secret_key=settings.jwt_secret_key,
        username=username,
        member_id=member_id,
        extra_claims={"name": name or username},
        access_ttl_minutes=settings.access_token_ttl_minutes,
        refresh_ttl_minutes=settings.refresh_token_ttl_minutes,
    )
    return {
        **tokens,
        "username": username,
    }


def verify_access_token(authorization: str | None) -> dict[str, Any]:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    try:
        return decode_token(token, settings.jwt_secret_key, expected_type="access")
    except TokenError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/live")
def health_live() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/ready")
def health_ready() -> dict[str, str]:
    ensure_ready()
    return {"status": "ready"}


@app.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest) -> dict[str, Any]:
    user = authenticate_demo_user(payload.username, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return build_login_response(payload.username, user["id"], user.get("name"))


@app.post("/auth/refresh", response_model=LoginResponse)
def refresh_token(payload: RefreshTokenRequest) -> dict[str, Any]:
    try:
        claims = decode_token(
            payload.refreshToken,
            settings.jwt_secret_key,
            expected_type="refresh",
        )
    except TokenError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc

    return build_login_response(
        username=str(claims["username"]),
        member_id=str(claims["sub"]),
        name=str(claims.get("name") or claims["username"]),
    )


@app.get("/protected")
def protected_route(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    claims = verify_access_token(authorization)
    return {"message": "This is a protected route", "user": claims}


@app.get("/api/todos", response_model=list[TodoRead])
def list_todos(db: Session = Depends(get_db)) -> list[Todo]:
    return db.query(Todo).order_by(Todo.created_at.desc()).all()


@app.post("/api/todos", response_model=TodoRead)
def create_todo(payload: TodoCreate, db: Session = Depends(get_db)) -> Todo:
    todo = Todo(title=payload.title, description=payload.description)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@app.get("/api/bookings")
def list_bookings(db: Session = Depends(get_db)) -> dict[str, list[dict[str, str | float | None]]]:
    grouped: dict[str, list[dict[str, str | float | None]]] = defaultdict(list)
    rows = db.query(HotelBooking).order_by(HotelBooking.room_id, HotelBooking.check_in_date).all()

    for row in rows:
        grouped[row.room_id].append(
            {
                "guestName": row.guest_name,
                "checkInDate": row.check_in_date.isoformat(),
                "checkOutDate": row.check_out_date.isoformat(),
                "arrivalTime": row.arrival_time.isoformat() if row.arrival_time else None,
                "departureTime": row.departure_time.isoformat() if row.departure_time else None,
                "cost": float(row.cost),
            }
        )

    return dict(grouped)


@app.get("/api/reservations", response_model=list[MedicalReservationRead])
def list_medical_reservations(db: Session = Depends(get_db)) -> list[MedicalReservationRead]:
    rows = (
        db.query(MedicalReservation)
        .order_by(MedicalReservation.date, MedicalReservation.time)
        .all()
    )
    return [
        MedicalReservationRead(
            id=row.id,
            name=row.name,
            departmentId=row.department_id,
            date=row.date,
            time=row.time,
        )
        for row in rows
    ]


@app.get("/api/menu")
def api_menu(store: DemoStore = Depends(get_demo_store)) -> dict[str, bool]:
    return store.list_menu()


@app.get("/api/members")
def api_members(store: DemoStore = Depends(get_demo_store)) -> list[dict[str, Any]]:
    return store.list_members()


@app.get("/api/permissions")
def api_permissions(memberId: str, menuPath: str) -> dict[str, bool]:
    if not memberId or not menuPath:
        raise HTTPException(status_code=400, detail="memberId and menuPath are required")
    return {
        "canSearch": True,
        "canAdd": True,
        "canDelete": True,
        "canResetSearch": True,
        "canSave": True,
        "canView": True,
    }


@app.get("/api/data")
def api_data(store: DemoStore = Depends(get_demo_store)) -> list[dict[str, Any]]:
    return store.list_departments()


@app.post("/api/save")
def api_save(payload: dict[str, Any], store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    return store.save_department(payload)


@app.post("/api/delete")
def api_delete(payload: dict[str, Any], store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    row_keys = payload.get("rowKeys")
    if not isinstance(row_keys, list) or not row_keys:
        raise HTTPException(status_code=400, detail="rowKeys must be a non-empty array")
    return store.delete_departments([int(row_key) for row_key in row_keys])


@app.get("/db/inbound")
def db_inbound(store: DemoStore = Depends(get_demo_store)) -> list[dict[str, Any]]:
    return store.list_inbound()


@app.get("/db/outbound")
def db_outbound(store: DemoStore = Depends(get_demo_store)) -> list[dict[str, Any]]:
    return store.list_outbound()


@app.post("/db/inbound/add")
def add_inbound(payload: dict[str, Any], store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    return store.add_inventory_row("inbound", payload)


@app.post("/db/outbound/add")
def add_outbound(payload: dict[str, Any], store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    return store.add_inventory_row("outbound", payload)


@app.post("/db/inbound/update")
def update_inbound(
    updates: list[dict[str, Any]],
    store: DemoStore = Depends(get_demo_store),
) -> dict[str, Any]:
    return store.update_inventory_rows("inbound", updates)


@app.post("/db/outbound/update")
def update_outbound(
    updates: list[dict[str, Any]],
    store: DemoStore = Depends(get_demo_store),
) -> dict[str, Any]:
    return store.update_inventory_rows("outbound", updates)


@app.post("/db/inbound/delete")
def delete_inbound(payload: dict[str, Any], store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    ids = payload.get("ids")
    if not isinstance(ids, list):
        raise HTTPException(status_code=400, detail="ids must be an array")
    return store.delete_inventory_rows("inbound", [str(item_id) for item_id in ids])


@app.post("/db/outbound/delete")
def delete_outbound(payload: dict[str, Any], store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    ids = payload.get("ids")
    if not isinstance(ids, list):
        raise HTTPException(status_code=400, detail="ids must be an array")
    return store.delete_inventory_rows("outbound", [str(item_id) for item_id in ids])


@app.post("/db/dynamicConnect")
def db_dynamic_connect(payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "success": True,
        "message": "Demo connection succeeded",
        "data": {
            "host": payload.get("host"),
            "user": payload.get("user"),
            "database": payload.get("database"),
            "mode": "demo",
        },
    }


@app.post("/db/query")
def db_query(payload: dict[str, Any], store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    query = str(payload.get("query") or "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="query is required")
    return {
        "success": True,
        "message": "Demo query executed successfully",
        "data": store.query_rows(query),
    }


@app.get("/api/list")
def api_list(store: DemoStore = Depends(get_demo_store)) -> list[dict[str, str]]:
    return store.list_api_inventory()


@app.get("/api/calendar")
def get_calendar(store: DemoStore = Depends(get_demo_store)) -> dict[str, list[str]]:
    return store.list_calendar()


@app.post("/api/calendar/mock-seed")
def seed_mock_calendar(store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    store.seed_calendar()
    return {
        "message": "Mock calendar schedule synchronized",
        "totalDates": len(store.list_calendar()),
    }


@app.post("/api/addDate")
def add_date(payload: dict[str, Any], store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    date_value = payload.get("date")
    if not date_value:
        raise HTTPException(status_code=400, detail="Missing required field: date")
    return {
        "message": "Date added successfully",
        "dateId": store.add_date(str(date_value)),
    }


@app.post("/api/addEvent")
def add_event(payload: dict[str, Any], store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    date_id = payload.get("date_id")
    time_value = payload.get("time")
    description = payload.get("description")
    event_id = payload.get("event_id")
    if not date_id or not time_value or not description:
        raise HTTPException(status_code=400, detail="Missing required fields")
    try:
        saved_event_id = store.add_event(int(date_id), str(time_value), str(description), event_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="date_id not found") from exc
    return {"message": "Event added successfully", "eventId": saved_event_id}


@app.delete("/api/deleteEvent/{event_id}")
def delete_event(event_id: str, store: DemoStore = Depends(get_demo_store)) -> dict[str, bool | str]:
    deleted = store.delete_event(event_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully", "success": True}


@app.get("/api/glos")
def glos(store: DemoStore = Depends(get_demo_store)) -> list[dict[str, Any]]:
    return store.list_glossary()


@app.post("/api/glos_req")
def glos_req(payload: dict[str, Any], store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    glos_id = payload.get("glos_id")
    request_message = payload.get("req_msg")
    if not glos_id or not request_message:
        raise HTTPException(status_code=400, detail="Missing fields")
    request_id = store.add_glossary_request(int(glos_id), str(request_message))
    return {
        "success": True,
        "message": "Glossary correction request stored",
        "insertId": request_id,
    }


@app.put("/api/glos/{item_id}")
def update_glos(item_id: int, payload: dict[str, Any], store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    updated = store.update_glossary(item_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="No row updated")
    return {"success": True, "message": "Row updated successfully"}


@app.post("/api/setGlos")
def set_glos(payload: dict[str, Any], store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    item_id = store.add_glossary(payload)
    return {"success": True, "message": "New row inserted", "id": item_id}


@app.post("/api/glos/delete")
def delete_glos(payload: dict[str, Any], store: DemoStore = Depends(get_demo_store)) -> dict[str, Any]:
    ids = payload.get("ids")
    if not isinstance(ids, list):
        raise HTTPException(status_code=400, detail="ids must be an array")
    return store.delete_glossary([int(item_id) for item_id in ids])


@app.get("/api/getGlosReq")
def get_glos_req(glos_id: int, store: DemoStore = Depends(get_demo_store)) -> list[dict[str, Any]]:
    return store.list_glossary_requests(glos_id)


@app.get("/api/codegroup")
def code_groups(store: DemoStore = Depends(get_demo_store)) -> list[dict[str, Any]]:
    return store.list_code_groups()


@app.get("/api/code")
def codes(groupcode: str | None = None, store: DemoStore = Depends(get_demo_store)) -> list[dict[str, Any]]:
    return store.list_codes(groupcode)


@app.get("/api/SitePlaceRoom")
def site_place_room(store: DemoStore = Depends(get_demo_store)) -> list[dict[str, Any]]:
    return store.list_site_place_rooms()


@app.post("/upload/image")
async def upload_image(image: UploadFile = File(...)) -> dict[str, str]:
    extension = Path(image.filename or "").suffix
    filename = f"{uuid4().hex}{extension}"
    target_path = UPLOAD_DIR / filename
    target_path.write_bytes(await image.read())
    return {"url": f"/uploads/{filename}"}


@app.api_route("/", methods=["GET", "HEAD"])
def root() -> FileResponse:
    return serve_file_from(PUBLIC_DIR, "index.html", allow_directory_index=False)


@app.api_route("/infra/{infra_path:path}", methods=["GET", "HEAD"])
def serve_infra(infra_path: str) -> FileResponse:
    return serve_file_from(INFRA_DIR, infra_path, allow_directory_index=False)


@app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
def catch_all(full_path: str) -> FileResponse:
    return serve_file_from(PUBLIC_DIR, full_path)
