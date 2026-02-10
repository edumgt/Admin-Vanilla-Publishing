import json
import os
from datetime import date, datetime, timedelta
from typing import Any

import asyncpg
from fastapi import Depends, FastAPI, File, HTTPException, Query, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.staticfiles import StaticFiles
from jose import JWTError, jwt
from pydantic import BaseModel


APP_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(APP_ROOT, "public")
UPLOAD_DIR = os.path.join(PUBLIC_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "edumgtedumgt")
ALGORITHM = "HS256"

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/kegtest",
)

app = FastAPI(title="WMS FastAPI", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://kegdemo.edumgt.co.kr:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.mount("/static", StaticFiles(directory=PUBLIC_DIR), name="static")

security = HTTPBearer()


@app.on_event("startup")
async def startup() -> None:
    app.state.pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=10)
    async with app.state.pool.acquire() as conn:
        try:
            await conn.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
        except asyncpg.PostgresError:
            pass


@app.on_event("shutdown")
async def shutdown() -> None:
    await app.state.pool.close()


async def fetch_all(query: str, *args: Any) -> list[dict[str, Any]]:
    async with app.state.pool.acquire() as conn:
        rows = await conn.fetch(query, *args)
        return [dict(row) for row in rows]


async def execute(query: str, *args: Any) -> str:
    async with app.state.pool.acquire() as conn:
        return await conn.execute(query, *args)


async def authenticate_user(username: str, password: str) -> dict[str, Any] | None:
    """Authenticate user against PostgreSQL member table."""
    async with app.state.pool.acquire() as conn:
        try:
            row = await conn.fetchrow(
                """
                SELECT id, name, email
                FROM member
                WHERE id = $1
                  AND pwd = crypt($2, pwd)
                LIMIT 1
                """,
                username,
                password,
            )
            if row:
                return dict(row)
        except (asyncpg.UndefinedFunctionError, asyncpg.UndefinedTableError):
            # pgcrypto 미설치 or member 테이블 미생성 환경 fallback
            pass

        try:
            row = await conn.fetchrow(
                """
                SELECT id, name, email
                FROM member
                WHERE id = $1
                  AND pwd = $2
                LIMIT 1
                """,
                username,
                password,
            )
            if row:
                return dict(row)
        except asyncpg.UndefinedTableError:
            pass

    return None


class SQLQuery(BaseModel):
    query: str


class BulkUpdate(BaseModel):
    id: str
    changes: dict[str, Any]


class IdsPayload(BaseModel):
    ids: list[Any]


class LoginPayload(BaseModel):
    username: str
    password: str


class GlosPayload(BaseModel):
    en: str
    ko: str
    desc: str | None = None
    img: str | None = None


@app.post("/upload/image")
async def upload_image(image: UploadFile = File(...)) -> dict[str, str]:
    ext = os.path.splitext(image.filename or "")[1]
    filename = f"{int(datetime.now().timestamp() * 1000)}{ext}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        f.write(await image.read())
    return {"url": f"/uploads/{filename}"}


@app.get("/db/connect")
async def db_connect() -> dict[str, Any]:
    rows = await fetch_all("SELECT NOW() AS current_time")
    return {"success": True, "message": "DB Connection Succeeded", "data": rows}


@app.post("/db/query")
async def db_query(payload: SQLQuery) -> dict[str, Any]:
    rows = await fetch_all(payload.query)
    return {"success": True, "message": "Query executed successfully", "data": rows}


@app.get("/db/codes")
async def db_codes() -> list[dict[str, Any]]:
    return await fetch_all("SELECT * FROM t_code")


@app.get("/db/inbound")
async def db_inbound() -> list[dict[str, Any]]:
    return await fetch_all("SELECT * FROM inbound_data ORDER BY date DESC")


@app.get("/db/outbound")
async def db_outbound() -> list[dict[str, Any]]:
    return await fetch_all("SELECT * FROM outbound_data ORDER BY date DESC")


@app.post("/db/inbound/add")
async def add_inbound(payload: dict[str, Any]) -> dict[str, Any]:
    await execute(
        "INSERT INTO inbound_data (id, date, title, quantity, isbn) VALUES ($1, $2, $3, $4, $5)",
        payload.get("id"),
        payload.get("date"),
        payload.get("title"),
        payload.get("quantity"),
        payload.get("isbn"),
    )
    return {"success": True, "message": "Inbound data added successfully"}


@app.post("/db/outbound/add")
async def add_outbound(payload: dict[str, Any]) -> dict[str, Any]:
    await execute(
        "INSERT INTO outbound_data (id, date, title, quantity, isbn) VALUES ($1, $2, $3, $4, $5)",
        payload.get("id"),
        payload.get("date"),
        payload.get("title"),
        payload.get("quantity"),
        payload.get("isbn"),
    )
    return {"success": True, "message": "Outbound data added successfully"}


def build_update_statement(table: str, update: BulkUpdate) -> tuple[str, list[Any]]:
    allowed = {"date", "title", "quantity", "isbn"}
    keys = [k for k in update.changes.keys() if k in allowed]
    if not keys:
        raise HTTPException(status_code=400, detail="No valid updatable fields.")
    set_parts = [f"{key} = ${idx + 2}" for idx, key in enumerate(keys)]
    params: list[Any] = [update.id] + [update.changes[key] for key in keys]
    return f"UPDATE {table} SET {', '.join(set_parts)} WHERE id = $1", params


@app.post("/db/inbound/update")
async def update_inbound(updates: list[BulkUpdate]) -> dict[str, Any]:
    for update in updates:
        sql, params = build_update_statement("inbound_data", update)
        await execute(sql, *params)
    return {"success": True, "message": "Inbound data updated"}


@app.post("/db/outbound/update")
async def update_outbound(updates: list[BulkUpdate]) -> dict[str, Any]:
    for update in updates:
        sql, params = build_update_statement("outbound_data", update)
        await execute(sql, *params)
    return {"success": True, "message": "Outbound data updated"}


@app.post("/db/inbound/delete")
async def delete_inbound(payload: IdsPayload) -> dict[str, Any]:
    await execute("DELETE FROM inbound_data WHERE id = ANY($1::text[])", payload.ids)
    return {"success": True, "message": "Selected inbound data deleted successfully"}


@app.post("/db/outbound/delete")
async def delete_outbound(payload: IdsPayload) -> dict[str, Any]:
    await execute("DELETE FROM outbound_data WHERE id = ANY($1::text[])", payload.ids)
    return {"success": True, "message": "Selected outbound data deleted successfully"}


@app.get("/db/SurveyQstn")
async def survey_qstn() -> list[dict[str, Any]]:
    return await fetch_all(
        "SELECT seq, question, kind, type, sort, rd_seq FROM t_survey_question ORDER BY rd_seq, sort, type"
    )


@app.get("/db/SurveyRslt")
async def survey_rslt() -> list[dict[str, Any]]:
    return await fetch_all("SELECT * FROM t_survey_result ORDER BY seq DESC LIMIT 100")


@app.get("/db/SurveyDate")
async def survey_date() -> list[dict[str, Any]]:
    return await fetch_all("SELECT * FROM t_survey_date ORDER BY seq DESC")


@app.post("/db/SiteUser")
async def site_user(payload: dict[str, Any]) -> dict[str, Any]:
    userid = payload.get("userid", "test0001")
    rows = await fetch_all("SELECT * FROM vwsiteuser WHERE userid = $1", userid)
    return {"success": True, "data": rows}


@app.post("/db/PlaceUser")
async def place_user(payload: dict[str, Any]) -> dict[str, Any]:
    userid = payload.get("userid", "test0001")
    rows = await fetch_all("SELECT * FROM vwplaceuser WHERE userid = $1", userid)
    return {"success": True, "data": rows}


@app.post("/db/SitePlace")
async def site_place(payload: dict[str, Any]) -> dict[str, Any]:
    sitecode = payload.get("sitecode", "01")
    rows = await fetch_all("SELECT * FROM vwsiteplace WHERE sitecode = $1", sitecode)
    return {"success": True, "data": rows}


@app.post("/listbox/SitePlace")
async def listbox_site_place(payload: dict[str, Any]) -> dict[str, Any]:
    sitecode = payload.get("sitecode", "01")
    rows = await fetch_all("SELECT placeseq AS opt, placename AS val FROM vwsiteplace WHERE sitecode = $1", sitecode)
    return {"success": True, "data": rows}


@app.post("/listbox/SiteUser")
async def listbox_site_user(payload: dict[str, Any]) -> dict[str, Any]:
    userid = payload.get("userid", "test0001")
    rows = await fetch_all("SELECT sitecode AS opt, sitename AS val FROM vwsiteuser WHERE userid = $1", userid)
    return {"success": True, "data": rows}


@app.get("/api/list")
async def api_list() -> list[dict[str, Any]]:
    return [
        {"url": "/api/member-permissions", "method": "GET", "description": "권한 목록"},
        {"url": "/db/inbound", "method": "GET", "description": "Local 입고 목록"},
        {"url": "/db/outbound", "method": "GET", "description": "출고 목록"},
    ]


@app.get("/api/calendar")
async def get_calendar() -> dict[str, list[str]]:
    rows = await fetch_all(
        """
        SELECT d.date::text AS date,
               ARRAY_AGG(TO_CHAR(e.time, 'HH24:MI') || ' - ' || e.description || ' - ' || e.event_id) AS events
        FROM dates d
        JOIN events e ON d.date_id = e.date_id
        GROUP BY d.date
        """
    )
    return {row["date"]: row["events"] for row in rows}


@app.post("/api/calendar/mock-seed")
async def seed_mock_calendar() -> dict[str, Any]:
    items = [
        {"event_id": "MOCK-CALENDAR-001", "offset": 0, "time": "09:00", "description": "프로젝트 킥오프 회의"},
        {"event_id": "MOCK-CALENDAR-002", "offset": 1, "time": "13:30", "description": "백엔드 API 연동 점검"},
        {"event_id": "MOCK-CALENDAR-003", "offset": 2, "time": "16:00", "description": "가상 일정 데모 리허설"},
    ]
    inserted = 0
    skipped = 0
    for item in items:
        event_date = (date.today() + timedelta(days=item["offset"])).isoformat()
        date_row = await fetch_all("SELECT date_id FROM dates WHERE date = $1 LIMIT 1", event_date)
        if date_row:
            date_id = date_row[0]["date_id"]
        else:
            ret = await fetch_all("INSERT INTO dates (date) VALUES ($1) RETURNING date_id", event_date)
            date_id = ret[0]["date_id"]

        exists = await fetch_all("SELECT event_id FROM events WHERE event_id = $1 LIMIT 1", item["event_id"])
        if exists:
            skipped += 1
            continue

        await execute(
            "INSERT INTO events (date_id, time, description, event_id) VALUES ($1, $2, $3, $4)",
            date_id,
            item["time"],
            item["description"],
            item["event_id"],
        )
        inserted += 1

    return {
        "message": "Mock calendar schedule upsert completed",
        "insertedCount": inserted,
        "skippedCount": skipped,
        "total": len(items),
    }


@app.post("/api/addDate")
async def add_date(payload: dict[str, Any]) -> dict[str, Any]:
    date_value = payload.get("date")
    if not date_value:
        raise HTTPException(status_code=400, detail="Missing required field: date")
    found = await fetch_all("SELECT date_id FROM dates WHERE date = $1 LIMIT 1", date_value)
    if found:
        return {"message": "Date already exists", "dateId": found[0]["date_id"]}
    inserted = await fetch_all("INSERT INTO dates (date) VALUES ($1) RETURNING date_id", date_value)
    return {"message": "Date added successfully", "dateId": inserted[0]["date_id"]}


@app.post("/api/addEvent")
async def add_event(payload: dict[str, Any]) -> dict[str, Any]:
    date_id = payload.get("date_id")
    time = payload.get("time")
    description = payload.get("description")
    event_id = payload.get("event_id")
    if not date_id or not time or not description:
        raise HTTPException(status_code=400, detail="Missing required fields")
    await execute(
        "INSERT INTO events (date_id, time, description, event_id) VALUES ($1, $2, $3, $4)",
        date_id,
        time,
        description,
        event_id,
    )
    return {"message": "Event added successfully", "eventId": event_id}


@app.delete("/api/deleteEvent/{event_id}")
async def delete_event(event_id: str) -> dict[str, str]:
    result = await execute("DELETE FROM events WHERE event_id = $1", event_id)
    if result.endswith("0"):
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}


@app.get("/api/reservations")
async def reservations() -> list[dict[str, Any]]:
    return await fetch_all("SELECT * FROM reservations")


@app.get("/api/members")
async def members() -> list[dict[str, Any]]:
    return await fetch_all("SELECT * FROM employees")


@app.get("/api/bookings")
async def bookings() -> dict[str, Any]:
    rows = await fetch_all("SELECT * FROM booking")
    grouped: dict[str, list[dict[str, Any]]] = {}
    for row in rows:
        key = str(row["room_number"])
        grouped.setdefault(key, []).append(
            {
                "guestName": row.get("guest_name"),
                "checkInDate": row.get("check_in_date"),
                "checkOutDate": row.get("check_out_date"),
                "arrivalTime": row.get("arrival_time"),
                "departureTime": row.get("departure_time"),
                "cost": row.get("cost"),
            }
        )
    return grouped


@app.get("/api/glos")
async def glos() -> list[dict[str, Any]]:
    return await fetch_all("SELECT * FROM glos ORDER BY id DESC")


@app.post("/api/glos_req")
async def glos_req(payload: dict[str, Any]) -> dict[str, Any]:
    glos_id = payload.get("glos_id")
    req_msg = payload.get("req_msg")
    if not glos_id or not req_msg:
        raise HTTPException(status_code=400, detail="Missing fields")
    row = await fetch_all(
        "INSERT INTO glos_req (glos_id, req_msg, req_date) VALUES ($1, $2, CURRENT_DATE) RETURNING id",
        glos_id,
        req_msg,
    )
    return {"success": True, "message": "정정 요청이 DB에 저장되었습니다.", "insertId": row[0]["id"]}


@app.put("/api/glos/{item_id}")
async def update_glos(item_id: int, payload: GlosPayload) -> dict[str, Any]:
    result = await execute(
        'UPDATE glos SET en = $1, ko = $2, "desc" = $3, img = $4 WHERE id = $5',
        payload.en,
        payload.ko,
        payload.desc,
        payload.img,
        item_id,
    )
    if result.endswith("0"):
        raise HTTPException(status_code=404, detail="No row updated")
    return {"success": True, "message": "Row updated successfully"}


@app.post("/api/setGlos")
async def set_glos(payload: GlosPayload) -> dict[str, Any]:
    row = await fetch_all(
        'INSERT INTO glos (en, ko, "desc", img) VALUES ($1, $2, $3, $4) RETURNING id',
        payload.en,
        payload.ko,
        payload.desc,
        payload.img,
    )
    return {"success": True, "message": "New row inserted", "id": row[0]["id"]}


@app.post("/api/glos/delete")
async def delete_glos(payload: IdsPayload) -> dict[str, Any]:
    result = await execute("DELETE FROM glos WHERE id = ANY($1::int[])", payload.ids)
    return {"success": True, "message": f"{result.split(' ')[-1]} rows deleted"}


@app.get("/api/getGlosReq")
async def get_glos_req(glos_id: int = Query(...)) -> list[dict[str, Any]]:
    return await fetch_all("SELECT * FROM glos_req WHERE glos_id = $1", glos_id)


@app.get("/api/menu")
async def menu() -> dict[str, Any]:
    rows = await fetch_all(
        """
        SELECT mp.page_name, mi.href, mi.label, im.icon_class
        FROM menu_page mp
        JOIN menu_item mi ON mp.id = mi.menu_page_id
        LEFT JOIN icon_mapping im ON mi.label = im.label
        ORDER BY mp.page_name, mi.id
        """
    )
    data: dict[str, list[dict[str, Any]]] = {}
    for row in rows:
        page = row["page_name"]
        data.setdefault(page, []).append(
            {"href": row["href"], "text": row["label"], "icon": row.get("icon_class")}
        )
    return data


@app.get("/api/data")
async def departments_data() -> list[dict[str, Any]]:
    dept_rows = await fetch_all("SELECT * FROM departments ORDER BY row_key DESC")
    attr_rows = await fetch_all("SELECT * FROM department_attributes")
    attr_map: dict[Any, dict[str, Any]] = {}
    for attr in attr_rows:
        attr_map[attr["row_key"]] = {
            "rowNum": attr.get("row_num"),
            "checked": bool(attr.get("checked")),
            "disabled": bool(attr.get("disabled")),
            "checkDisabled": bool(attr.get("check_disabled")),
            "className": {
                "row": json.loads(attr.get("class_name_row") or "[]"),
                "column": json.loads(attr.get("class_name_col") or "{}"),
            },
        }
    return [
        {
            "Key": d.get("id"),
            "tpCd": d.get("tp_cd"),
            "tpNm": d.get("tp_nm"),
            "descCntn": d.get("desc_cntn"),
            "useYn": d.get("use_yn"),
            "createdAt": d.get("created_at"),
            "view": d.get("view"),
            "rowKey": d.get("row_key"),
            "_attributes": attr_map.get(d.get("row_key"), {}),
        }
        for d in dept_rows
    ]


@app.post("/api/save")
async def save_department(payload: dict[str, Any]) -> dict[str, str]:
    row_key = payload.get("rowKey")
    tp_cd = payload.get("tpCd")
    tp_nm = payload.get("tpNm")
    desc_cntn = payload.get("descCntn")
    use_yn = payload.get("useYn")
    key = payload.get("Key")

    if not row_key or not tp_cd or not tp_nm:
        raise HTTPException(status_code=400, detail="rowKey, tpCd, tpNm are required")

    exists = await fetch_all("SELECT 1 FROM departments WHERE row_key = $1", row_key)
    if exists:
        await execute(
            "UPDATE departments SET tp_cd = $1, tp_nm = $2, desc_cntn = $3, use_yn = $4 WHERE row_key = $5",
            tp_cd,
            tp_nm,
            desc_cntn,
            use_yn,
            row_key,
        )
        return {"message": "Updated successfully", "type": "update"}

    await execute(
        "INSERT INTO departments (id, tp_cd, tp_nm, desc_cntn, use_yn) VALUES ($1, $2, $3, $4, $5)",
        key,
        tp_cd,
        tp_nm,
        desc_cntn,
        use_yn,
    )
    return {"message": "Inserted successfully", "type": "insert"}


@app.post("/api/delete")
async def delete_department(payload: dict[str, Any]) -> dict[str, Any]:
    row_keys = payload.get("rowKeys")
    if not isinstance(row_keys, list) or len(row_keys) == 0:
        raise HTTPException(status_code=400, detail="rowKeys must be a non-empty array")
    await execute("DELETE FROM department_attributes WHERE row_key = ANY($1::text[])", row_keys)
    await execute("DELETE FROM departments WHERE row_key = ANY($1::text[])", row_keys)
    return {"message": "Rows deleted successfully", "deleted": row_keys}


@app.get("/api/permissions")
async def permissions(memberId: str, menuPath: str) -> dict[str, bool]:
    menu_rows = await fetch_all("SELECT id FROM menu_page WHERE page_name = $1", menuPath)
    if not menu_rows:
        raise HTTPException(status_code=404, detail="Menu not found")

    menu_id = menu_rows[0]["id"]
    perm_rows = await fetch_all(
        """
        SELECT can_search, can_add, can_delete, can_reset_search, can_save, can_view
        FROM member_menu_permission
        WHERE member_id = $1 AND menu_page_id = $2
        """,
        memberId,
        menu_id,
    )
    if not perm_rows:
        return {
            "canSearch": False,
            "canAdd": False,
            "canDelete": False,
            "canResetSearch": False,
            "canSave": False,
            "canView": False,
        }

    p = perm_rows[0]
    return {
        "canSearch": bool(p["can_search"]),
        "canAdd": bool(p["can_add"]),
        "canDelete": bool(p["can_delete"]),
        "canResetSearch": bool(p["can_reset_search"]),
        "canSave": bool(p["can_save"]),
        "canView": bool(p["can_view"]),
    }


@app.get("/api/member-permissions")
async def member_permissions() -> list[dict[str, Any]]:
    return await fetch_all(
        """
        SELECT mmp.id AS permission_id, mmp.member_id, mem.name AS member_name,
               mp.id AS menu_page_id, mp.page_name,
               mmp.can_search, mmp.can_add, mmp.can_delete, mmp.can_reset_search, mmp.can_save, mmp.can_view
        FROM member_menu_permission mmp
        JOIN member mem ON mmp.member_id = mem.id
        JOIN menu_page mp ON mmp.menu_page_id = mp.id
        ORDER BY mem.name, mp.page_name
        """
    )


@app.post("/login")
async def login(payload: LoginPayload) -> dict[str, str]:
    user = await authenticate_user(payload.username, payload.password)

    if not user and payload.username == "admin" and payload.password == "1111":
        user = {"id": "admin", "name": "Administrator", "email": None}

    if user:
        token_payload = {
            "username": payload.username,
            "memberId": user["id"],
            "name": user.get("name"),
            "exp": datetime.utcnow() + timedelta(hours=1),
        }
        token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)
        return {"token": token}

    raise HTTPException(status_code=401, detail="Invalid credentials")


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict[str, Any]:
    token = credentials.credentials
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise HTTPException(status_code=403, detail="Invalid token") from exc


@app.get("/protected")
async def protected(user: dict[str, Any] = Depends(verify_token)) -> dict[str, Any]:
    return {"message": "This is a protected route", "user": user}


@app.get("/")
async def root() -> FileResponse:
    return FileResponse(os.path.join(PUBLIC_DIR, "index.html"))


@app.get("/{full_path:path}")
async def catch_all(full_path: str, request: Request) -> FileResponse:
    file_path = os.path.join(PUBLIC_DIR, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail=f"Path not found: {request.url.path}")
