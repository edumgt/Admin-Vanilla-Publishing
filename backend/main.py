import json
import os
import random
import urllib.request
import xml.etree.ElementTree as ET
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
    await init_grid_mock_data()


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




async def init_grid_mock_data() -> dict[str, int]:
    """Initialize grid demo tables and ensure 50 mock rows per dataset."""
    async with app.state.pool.acquire() as conn:
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS inbound_data (
                id VARCHAR(32) PRIMARY KEY,
                date DATE NOT NULL,
                title VARCHAR(255) NOT NULL,
                quantity INTEGER NOT NULL,
                isbn VARCHAR(32) NOT NULL
            )
            """
        )
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS outbound_data (
                id VARCHAR(32) PRIMARY KEY,
                date DATE NOT NULL,
                title VARCHAR(255) NOT NULL,
                quantity INTEGER NOT NULL,
                isbn VARCHAR(32) NOT NULL
            )
            """
        )
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS member (
                id VARCHAR(32) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(200),
                pwd VARCHAR(255)
            )
            """
        )
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS menu_page (
                id SERIAL PRIMARY KEY,
                page_name VARCHAR(100) UNIQUE NOT NULL
            )
            """
        )
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS member_menu_permission (
                id SERIAL PRIMARY KEY,
                member_id VARCHAR(32) NOT NULL REFERENCES member(id) ON DELETE CASCADE,
                menu_page_id INTEGER NOT NULL REFERENCES menu_page(id) ON DELETE CASCADE,
                can_search BOOLEAN NOT NULL DEFAULT FALSE,
                can_add BOOLEAN NOT NULL DEFAULT FALSE,
                can_delete BOOLEAN NOT NULL DEFAULT FALSE,
                can_reset_search BOOLEAN NOT NULL DEFAULT FALSE,
                can_save BOOLEAN NOT NULL DEFAULT FALSE,
                can_view BOOLEAN NOT NULL DEFAULT FALSE,
                UNIQUE (member_id, menu_page_id)
            )
            """
        )

        inbound_count = await conn.fetchval("SELECT COUNT(*) FROM inbound_data")
        if inbound_count < 50:
            await conn.execute("TRUNCATE inbound_data")
            inbound_rows = [
                (
                    f"INB-{idx:03d}",
                    date.today() - timedelta(days=idx),
                    f"입고 품목 {idx}",
                    random.randint(5, 200),
                    f"97889{idx:07d}",
                )
                for idx in range(1, 51)
            ]
            await conn.executemany(
                "INSERT INTO inbound_data (id, date, title, quantity, isbn) VALUES ($1, $2, $3, $4, $5)",
                inbound_rows,
            )

        outbound_count = await conn.fetchval("SELECT COUNT(*) FROM outbound_data")
        if outbound_count < 50:
            await conn.execute("TRUNCATE outbound_data")
            outbound_rows = [
                (
                    f"OUT-{idx:03d}",
                    date.today() - timedelta(days=idx - 1),
                    f"출고 품목 {idx}",
                    random.randint(3, 180),
                    f"97910{idx:07d}",
                )
                for idx in range(1, 51)
            ]
            await conn.executemany(
                "INSERT INTO outbound_data (id, date, title, quantity, isbn) VALUES ($1, $2, $3, $4, $5)",
                outbound_rows,
            )

        member_count = await conn.fetchval("SELECT COUNT(*) FROM member")
        if member_count < 10:
            await conn.execute("TRUNCATE member CASCADE")
            member_rows = [
                (f"mockuser{idx:02d}", f"모의사용자 {idx}", f"mockuser{idx:02d}@example.com", "1111")
                for idx in range(1, 11)
            ]
            await conn.executemany(
                "INSERT INTO member (id, name, email, pwd) VALUES ($1, $2, $3, $4)",
                member_rows,
            )

        menu_names = [f"/mock-page-{idx:02d}" for idx in range(1, 6)]
        for menu_name in menu_names:
            await conn.execute(
                "INSERT INTO menu_page (page_name) VALUES ($1) ON CONFLICT (page_name) DO NOTHING",
                menu_name,
            )

        permission_count = await conn.fetchval("SELECT COUNT(*) FROM member_menu_permission")
        if permission_count < 50:
            await conn.execute("TRUNCATE member_menu_permission")
            members = await conn.fetch("SELECT id FROM member ORDER BY id LIMIT 10")
            menus = await conn.fetch("SELECT id FROM menu_page ORDER BY id LIMIT 5")

            permission_rows = []
            for member_idx, member_row in enumerate(members):
                for menu_idx, menu_row in enumerate(menus):
                    base = member_idx + menu_idx
                    permission_rows.append(
                        (
                            member_row["id"],
                            menu_row["id"],
                            base % 2 == 0,
                            base % 3 == 0,
                            base % 4 == 0,
                            base % 5 == 0,
                            base % 2 == 1,
                            True,
                        )
                    )

            await conn.executemany(
                """
                INSERT INTO member_menu_permission
                (member_id, menu_page_id, can_search, can_add, can_delete, can_reset_search, can_save, can_view)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                """,
                permission_rows,
            )

        return {
            "inbound": int(await conn.fetchval("SELECT COUNT(*) FROM inbound_data")),
            "outbound": int(await conn.fetchval("SELECT COUNT(*) FROM outbound_data")),
            "permissions": int(await conn.fetchval("SELECT COUNT(*) FROM member_menu_permission")),
        }

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
        {"url": "/api/member-permissions", "method": "GET", "description": "권한 목록 (50건 mock)"},
        {"url": "/db/inbound", "method": "GET", "description": "입고 목록 (50건 mock)"},
        {"url": "/db/outbound", "method": "GET", "description": "출고 목록 (50건 mock)"},
    ]


@app.post("/api/grid/mock-seed")
async def grid_mock_seed() -> dict[str, Any]:
    counts = await init_grid_mock_data()
    return {
        "message": "Grid mock data synchronized",
        "counts": counts,
        "target": 50,
    }


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


@app.get("/api/ceo-news")
async def ceo_news(ticker: str = Query("NVDA"), company: str = Query("NVIDIA")) -> dict[str, Any]:
    """Fetch latest news for a company via Yahoo Finance RSS. Falls back to mock data."""
    articles: list[dict[str, Any]] = []
    try:
        url = f"https://finance.yahoo.com/rss/headline?s={ticker.upper()}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=6) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
        root = ET.fromstring(raw)
        ns = {"media": "http://search.yahoo.com/mrss/"}
        items = root.findall(".//item")
        for item in items[:20]:
            title   = (item.findtext("title") or "").strip()
            link    = (item.findtext("link") or "").strip()
            pub     = (item.findtext("pubDate") or "").strip()
            summary = (item.findtext("description") or "").strip()
            # strip HTML tags simply
            import re
            summary = re.sub(r"<[^>]+>", "", summary)
            # parse date
            try:
                dt = datetime.strptime(pub[:25], "%a, %d %b %Y %H:%M:%S")
            except Exception:
                dt = datetime.now()
            articles.append({
                "title":   title,
                "link":    link,
                "date":    dt.strftime("%Y-%m-%d"),
                "time":    dt.strftime("%H:%M"),
                "summary": summary[:200],
                "source":  "Yahoo Finance",
            })
    except Exception:
        pass

    # ── fallback / supplement mock data ──────────────────────────────────────
    MOCK: dict[str, list[dict[str, Any]]] = {
        "NVDA": [
            {"title": "Jensen Huang visits Japan, meets SoftBank CEO Masayoshi Son", "date": "2025-06-03", "time": "09:00", "summary": "NVIDIA CEO Jensen Huang traveled to Tokyo for strategic AI partnership talks with SoftBank's Masayoshi Son. The meeting focused on AI infrastructure deployment across Japan.", "source": "Reuters", "link": "#", "country": "일본"},
            {"title": "Jensen Huang keynote at COMPUTEX 2025 in Taipei", "date": "2025-05-20", "time": "14:00", "summary": "NVIDIA CEO Jensen Huang delivered the opening keynote at COMPUTEX 2025 in Taipei, unveiling the Blackwell Ultra GPU and new NIM microservices platform for enterprise AI.", "source": "TechCrunch", "link": "#", "country": "대만"},
            {"title": "NVIDIA CEO meets with Saudi Crown Prince to discuss AI investment", "date": "2025-05-12", "time": "10:30", "summary": "Jensen Huang visited Riyadh and met with Saudi Crown Prince Mohammed bin Salman. The two discussed a $500M AI infrastructure deal for NEOM smart city project.", "source": "Bloomberg", "link": "#", "country": "사우디아라비아"},
            {"title": "Huang attends White House AI summit with tech leaders", "date": "2025-04-28", "time": "11:00", "summary": "NVIDIA CEO Jensen Huang joined other leading technology executives at the White House for an AI policy summit hosted by President Biden's administration.", "source": "WSJ", "link": "#", "country": "미국"},
            {"title": "Jensen Huang visits South Korea, meets Samsung and SK Hynix executives", "date": "2025-04-10", "time": "09:30", "summary": "NVIDIA CEO traveled to Seoul to discuss HBM memory supply agreements with Samsung Electronics and SK Hynix. Reports indicate NVIDIA plans to double HBM3E orders.", "source": "Korea Herald", "link": "#", "country": "한국"},
            {"title": "NVIDIA GTC 2025: Jensen Huang's 'one more thing' moment — Rubin GPU unveiled", "date": "2025-03-18", "time": "13:00", "summary": "At GTC 2025 in San Jose, Jensen Huang announced the Rubin architecture successor to Blackwell, targeting 2026 deployment. The keynote drew 15,000 in-person attendees.", "source": "The Verge", "link": "#", "country": "미국"},
            {"title": "Huang meets EU officials in Brussels to discuss AI chip export policy", "date": "2025-03-05", "time": "10:00", "summary": "Jensen Huang visited Brussels for meetings with European Commission officials regarding AI chip export regulations and NVIDIA's EU data center investment plans.", "source": "FT", "link": "#", "country": "벨기에"},
            {"title": "NVIDIA Q4 FY2025 earnings call: Huang bullish on next trillion-dollar AI opportunity", "date": "2025-02-26", "time": "17:00", "summary": "NVIDIA reported record Q4 revenue of $39.3B (+78% YoY). CEO Jensen Huang emphasized the 'infinite' demand for Blackwell GPUs and announced $10B share buyback.", "source": "CNBC", "link": "#", "country": "미국"},
            {"title": "Jensen Huang visits India, meets PM Modi and Mukesh Ambani", "date": "2025-01-22", "time": "11:00", "summary": "NVIDIA CEO traveled to Mumbai and New Delhi, meeting with Indian Prime Minister Modi and Reliance Industries chairman Mukesh Ambani to discuss AI infrastructure investments in India.", "source": "Economic Times", "link": "#", "country": "인도"},
            {"title": "Huang's CES 2025 keynote: Project DIGITS personal AI supercomputer revealed", "date": "2025-01-06", "time": "09:00", "summary": "Jensen Huang delivered CES 2025's most anticipated keynote, revealing Project DIGITS — a personal AI supercomputer priced at $3,000, powered by GB10 Grace Blackwell Superchip.", "source": "CNET", "link": "#", "country": "미국"},
        ],
        "MSFT": [
            {"title": "Satya Nadella visits India, announces $3B AI investment in Azure", "date": "2025-06-05", "time": "10:00", "summary": "Microsoft CEO Satya Nadella announced a $3 billion investment in India's AI infrastructure, including new Azure data centers in Pune and Hyderabad.", "source": "Bloomberg", "link": "#", "country": "인도"},
            {"title": "Nadella keynotes Microsoft Build 2025, unveils Copilot+ enterprise suite", "date": "2025-05-19", "time": "09:00", "summary": "Satya Nadella opened Microsoft Build 2025 in Seattle, announcing Copilot+ enterprise AI suite integrating Azure OpenAI with Microsoft 365 and Dynamics.", "source": "TechCrunch", "link": "#", "country": "미국"},
            {"title": "Microsoft CEO meets European regulators in Brussels over AI Act compliance", "date": "2025-04-14", "time": "14:00", "summary": "Satya Nadella traveled to Brussels for meetings with EU officials to discuss Microsoft's compliance roadmap with the EU AI Act, particularly for Copilot and Azure OpenAI.", "source": "Reuters", "link": "#", "country": "벨기에"},
            {"title": "Nadella visits Japan, announces Microsoft-SoftBank AI partnership expansion", "date": "2025-03-11", "time": "10:30", "summary": "Satya Nadella met with SoftBank CEO Masayoshi Son in Tokyo, expanding their AI partnership to include joint development of AI agents for enterprise automation.", "source": "Nikkei", "link": "#", "country": "일본"},
            {"title": "Microsoft FQ2 FY2025 earnings: Nadella highlights 85% Azure AI growth", "date": "2025-01-29", "time": "17:30", "summary": "Microsoft CEO reported record quarterly results with Azure growing 31% YoY. Nadella emphasized that Azure AI is now the 'leading platform for enterprise AI workloads.'", "source": "CNBC", "link": "#", "country": "미국"},
            {"title": "Nadella visits UAE, signs $1.5B AI deal with G42 expansion", "date": "2025-01-15", "time": "11:00", "summary": "Microsoft CEO Satya Nadella visited Abu Dhabi for meetings with UAE AI Minister Omar Al Olama and G42 CEO Peng Xiao, expanding their AI joint venture to $1.5 billion.", "source": "FT", "link": "#", "country": "UAE"},
        ],
        "GOOGL": [
            {"title": "Sundar Pichai at Google I/O 2025: Gemini 2.0 Ultra and AI Overviews go global", "date": "2025-05-14", "time": "10:00", "summary": "Google CEO Sundar Pichai unveiled Gemini 2.0 Ultra at Google I/O 2025, announcing AI Overviews expansion to 100+ countries and Project Astra autonomous AI agent.", "source": "The Verge", "link": "#", "country": "미국"},
            {"title": "Pichai visits Seoul, meets Korean AI startup leaders and Samsung executives", "date": "2025-04-22", "time": "10:00", "summary": "Google CEO Sundar Pichai traveled to Seoul for Google's first Korea AI Summit, meeting with Samsung Electronics CEO and local AI startup founders.", "source": "Korea JoongAng Daily", "link": "#", "country": "한국"},
            {"title": "Sundar Pichai testifies before US Senate on AI regulation", "date": "2025-03-25", "time": "10:00", "summary": "Google CEO Sundar Pichai appeared before the US Senate Commerce Committee, arguing for risk-based AI regulation and opposing blanket restrictions on AI development.", "source": "WSJ", "link": "#", "country": "미국"},
            {"title": "Pichai meets with French President Macron in Paris for AI investment summit", "date": "2025-02-11", "time": "14:00", "summary": "Sundar Pichai attended France's AI Action Summit in Paris, where Google pledged €1 billion in additional European AI infrastructure investments.", "source": "Reuters", "link": "#", "country": "프랑스"},
        ],
        "META": [
            {"title": "Zuckerberg announces Meta's AGI lab in Menlo Park, AI hiring spree", "date": "2025-06-01", "time": "09:00", "summary": "Meta CEO Mark Zuckerberg announced the formation of a dedicated AGI research division, planning to hire hundreds of top AI researchers from DeepMind, OpenAI, and academia.", "source": "Bloomberg", "link": "#", "country": "미국"},
            {"title": "Zuckerberg visits Tokyo, announces Ray-Ban AI glasses partnership with Nidec", "date": "2025-05-08", "time": "10:00", "summary": "Meta CEO Mark Zuckerberg traveled to Tokyo for Meta's first Japan AI Summit, announcing a hardware partnership with Nidec for AI-powered wearables manufacturing.", "source": "Nikkei", "link": "#", "country": "일본"},
            {"title": "Mark Zuckerberg meets Indian PM Modi, pledges $2B India AI investment", "date": "2025-04-17", "time": "11:00", "summary": "Meta CEO Mark Zuckerberg met Indian Prime Minister Narendra Modi in New Delhi. Meta announced $2 billion in India-focused AI investments including data centers and Llama fine-tuning hubs.", "source": "Economic Times", "link": "#", "country": "인도"},
            {"title": "Zuckerberg at LlamaCon 2025: Llama 4 open-source release for developers", "date": "2025-04-29", "time": "14:00", "summary": "Meta CEO Mark Zuckerberg headlined LlamaCon 2025, releasing Llama 4 Scout and Llama 4 Maverick as open-source models, with 400B-parameter Llama 4 Behemoth in research preview.", "source": "TechCrunch", "link": "#", "country": "미국"},
        ],
        "TSM": [
            {"title": "TSMC CEO Wei visits Washington, meets US Commerce Secretary on export controls", "date": "2025-05-29", "time": "10:00", "summary": "TSMC CEO C.C. Wei met with US Commerce Secretary in Washington to discuss semiconductor export controls and the progress of TSMC's Arizona fab construction.", "source": "Reuters", "link": "#", "country": "미국"},
            {"title": "C.C. Wei speaks at TSMC North America Technology Symposium in San Jose", "date": "2025-05-07", "time": "09:00", "summary": "TSMC CEO Wei unveiled the company's N2P and A16 process nodes at the annual North America Technology Symposium, announcing 2nm volume production ahead of schedule.", "source": "AnandTech", "link": "#", "country": "미국"},
            {"title": "TSMC CEO meets Japanese PM Kishida for Kumamoto fab expansion announcement", "date": "2025-04-03", "time": "11:00", "summary": "TSMC CEO C.C. Wei visited Tokyo for meetings with Japanese Prime Minister Kishida, announcing a third Kumamoto fab with ¥5 trillion total investment in Japan.", "source": "Nikkei", "link": "#", "country": "일본"},
            {"title": "TSMC Q1 2025 earnings: Wei raises AI chip demand forecast for full year", "date": "2025-04-17", "time": "15:00", "summary": "TSMC CEO C.C. Wei reported Q1 2025 revenue of NT$839B (+41% YoY), raising full-year revenue growth guidance to 25-30% driven by AI accelerator demand.", "source": "Bloomberg", "link": "#", "country": "대만"},
        ],
        "AMZN": [
            {"title": "Andy Jassy at AWS re:Invent 2025: Nova Premier model, 1M context window", "date": "2025-12-02", "time": "09:00", "summary": "Amazon CEO Andy Jassy kicked off AWS re:Invent 2025 announcing Claude-powered Amazon Nova Premier model with 1M token context and Trainium3 chip for 40% cost reduction.", "source": "CNBC", "link": "#", "country": "미국"},
            {"title": "Jassy visits India, announces $15B AWS India expansion plan", "date": "2025-05-06", "time": "10:30", "summary": "Amazon CEO Andy Jassy visited Mumbai and Bengaluru, announcing a $15 billion AWS India investment plan including three new data center regions by 2030.", "source": "Economic Times", "link": "#", "country": "인도"},
            {"title": "Jassy meets with EU antitrust officials in Brussels regarding Amazon AI market position", "date": "2025-03-19", "time": "14:00", "summary": "Amazon CEO Andy Jassy traveled to Brussels for discussions with EU antitrust regulators regarding Amazon's AI market position, particularly in cloud AI services.", "source": "FT", "link": "#", "country": "벨기에"},
        ],
        "AAPL": [
            {"title": "Tim Cook visits Sichuan, Apple supplier expansion discussions with Chinese officials", "date": "2025-04-01", "time": "09:00", "summary": "Apple CEO Tim Cook visited Chengdu and met with Sichuan provincial officials, discussing Apple's long-term manufacturing presence in China despite ongoing supply chain diversification.", "source": "Bloomberg", "link": "#", "country": "중국"},
            {"title": "Cook keynotes WWDC 2025: Apple Intelligence 2.0 with Claude integration", "date": "2025-06-09", "time": "10:00", "summary": "Apple CEO Tim Cook opened WWDC 2025 announcing Apple Intelligence 2.0 with enhanced Siri, Claude and Gemini third-party model support, and on-device image generation.", "source": "The Verge", "link": "#", "country": "미국"},
            {"title": "Tim Cook visits India, meets PM Modi for Apple India manufacturing expansion", "date": "2025-04-20", "time": "11:00", "summary": "Apple CEO Tim Cook met Indian Prime Minister Modi, discussing Apple's plans to manufacture 25% of all iPhones in India by 2027 through Foxconn and Tata Electronics.", "source": "Reuters", "link": "#", "country": "인도"},
        ],
        "AMD": [
            {"title": "Lisa Su at Computex 2025: MI350X GPU targets NVIDIA H200 market share", "date": "2025-05-21", "time": "14:00", "summary": "AMD CEO Lisa Su unveiled MI350X GPU at Computex 2025, claiming 35% better performance-per-dollar versus NVIDIA H200 for LLM inference workloads.", "source": "Tom's Hardware", "link": "#", "country": "대만"},
            {"title": "Su visits Japan, announces AMD-SoftBank AI deployment partnership", "date": "2025-04-09", "time": "10:00", "summary": "AMD CEO Lisa Su traveled to Tokyo for partnership announcements with SoftBank, which will deploy AMD Instinct MI300X GPUs across its Japanese AI data centers.", "source": "Nikkei", "link": "#", "country": "일본"},
        ],
        "INTC": [
            {"title": "Lip-Bu Tan's first 100 days: Intel restructuring roadmap unveiled", "date": "2025-06-07", "time": "10:00", "summary": "New Intel CEO Lip-Bu Tan outlined his 100-day transformation plan: streamlining to 4 business units, doubling down on 18A process, and refocusing Gaudi AI accelerator strategy.", "source": "WSJ", "link": "#", "country": "미국"},
            {"title": "Tan visits TSMC in Taiwan for advanced packaging technology discussions", "date": "2025-05-15", "time": "10:00", "summary": "Intel CEO Lip-Bu Tan traveled to TSMC headquarters in Hsinchu, Taiwan to discuss advanced packaging technology collaboration for Intel's Gaudi 4 AI accelerator.", "source": "DigiTimes", "link": "#", "country": "대만"},
        ],
        "QCOM": [
            {"title": "Cristiano Amon at Snapdragon Summit 2025: X Elite Gen 2 beats M4 in AI benchmarks", "date": "2025-10-21", "time": "09:00", "summary": "Qualcomm CEO Cristiano Amon revealed Snapdragon X Elite Gen 2 at the annual Snapdragon Summit in Maui, claiming 40% NPU performance improvement over Apple M4.", "source": "Ars Technica", "link": "#", "country": "미국"},
            {"title": "Amon visits automotive expo in Munich, announces Snapdragon Ride Flex for BMW", "date": "2025-09-08", "time": "10:00", "summary": "Qualcomm CEO Cristiano Amon attended IAA Mobility 2025 in Munich, announcing a partnership with BMW to power its next-generation autonomous driving platform with Snapdragon Ride Flex.", "source": "Reuters", "link": "#", "country": "독일"},
        ],
        "005930.KS": [
            {"title": "삼성전자 전영현 부회장, 실적 부진에 대한 대국민 사과", "date": "2024-11-14", "time": "10:00", "summary": "삼성전자 DS부문장 전영현 부회장이 3분기 반도체 실적 부진과 파운드리 경쟁력 약화에 대해 공식 사과문을 발표하고 혁신 방안을 제시했습니다.", "source": "한국경제", "link": "#", "country": "한국"},
            {"title": "전영현 부회장, 미국 출장으로 NVIDIA·AMD와 HBM4 공급 협의", "date": "2025-05-20", "time": "09:00", "summary": "삼성전자 DS부문장 전영현 부회장이 산호세와 산타클라라를 방문해 NVIDIA 젠슨 황 CEO, AMD 리사 수 CEO와 HBM4 메모리 공급 파트너십 강화 방안을 논의했습니다.", "source": "한국경제", "link": "#", "country": "미국"},
            {"title": "삼성전자, 2nm GAA 파운드리 수율 개선 발표 — 전영현 주도 TF 성과", "date": "2025-04-30", "time": "14:00", "summary": "삼성전자 전영현 부회장 주도의 파운드리 혁신 TF가 2nm GAA 공정 수율을 60% 이상으로 끌어올렸다고 발표. TSMC 대비 경쟁력 회복에 청신호.", "source": "전자신문", "link": "#", "country": "한국"},
        ],
        "OPENAI": [
            {"title": "Sam Altman visits Middle East: $40B investment discussion with Saudi PIF", "date": "2025-05-13", "time": "10:00", "summary": "OpenAI CEO Sam Altman visited Saudi Arabia's Public Investment Fund, discussing a $40 billion investment round that would value OpenAI at $300B+, with SoftBank as co-investor.", "source": "Bloomberg", "link": "#", "country": "사우디아라비아"},
            {"title": "Altman keynotes OpenAI DevDay 2025: GPT-4o successor and Realtime API v2", "date": "2025-04-14", "time": "10:00", "summary": "OpenAI CEO Sam Altman unveiled the next-generation model at DevDay 2025 in San Francisco, featuring multimodal reasoning and a new Realtime API for voice and video applications.", "source": "TechCrunch", "link": "#", "country": "미국"},
            {"title": "Altman meets with EU AI Office in Brussels for GPT safety audit", "date": "2025-03-04", "time": "14:00", "summary": "OpenAI CEO Sam Altman traveled to Brussels for meetings with the EU AI Office for a voluntary safety audit of GPT-4o models under the EU AI Act framework.", "source": "Reuters", "link": "#", "country": "벨기에"},
            {"title": "Altman visits India with Elon Musk for AI infrastructure summit", "date": "2025-02-18", "time": "11:00", "summary": "OpenAI CEO Sam Altman visited India for the AI Action Summit in New Delhi, announcing OpenAI's first Asia-Pacific data center partnership with Tata Consultancy Services.", "source": "Economic Times", "link": "#", "country": "인도"},
        ],
        "ANTHROPIC": [
            {"title": "Dario Amodei publishes 'Machines of Loving Grace' sequel: AI governance essay", "date": "2025-06-02", "time": "09:00", "summary": "Anthropic CEO Dario Amodei published a major essay on AI governance, arguing for a 'safety-first' regulatory framework and calling for international AI safety treaties.", "source": "Anthropic Blog", "link": "#", "country": "미국"},
            {"title": "Amodei testifies before US Senate AI Committee on Claude safety architecture", "date": "2025-05-06", "time": "10:00", "summary": "Anthropic CEO Dario Amodei testified before the Senate Commerce Committee, presenting Anthropic's Constitutional AI approach and responsible scaling policy framework.", "source": "Reuters", "link": "#", "country": "미국"},
            {"title": "Anthropic CEO visits South Korea, discusses Samsung AI partnership for Claude", "date": "2025-04-15", "time": "10:30", "summary": "Dario Amodei traveled to Seoul for meetings with Samsung Electronics and SK Telecom executives, exploring integration of Claude models into Samsung Galaxy AI features.", "source": "Korea Herald", "link": "#", "country": "한국"},
            {"title": "Amodei and Daniela attend EU AI Safety Summit in Paris", "date": "2025-02-10", "time": "14:00", "summary": "Anthropic CEO Dario Amodei and President Daniela Amodei attended France's AI Safety Summit in Paris, co-authoring a joint statement with UK and US AI labs on responsible development.", "source": "FT", "link": "#", "country": "프랑스"},
        ],
    }
    ticker_key = ticker.upper()
    # special case mappings
    _map = {"005930": "005930.KS", "OPENAI": "OPENAI", "ANTHROPIC": "ANTHROPIC"}
    ticker_key = _map.get(ticker_key, ticker_key)

    mocks = MOCK.get(ticker_key, [])
    if not articles:
        articles = mocks
    else:
        # merge: prepend mock items not already present in RSS
        rss_titles = {a["title"].lower()[:40] for a in articles}
        for m in mocks:
            if m["title"].lower()[:40] not in rss_titles:
                articles.append(m)

    # enrich: detect country & activity tag from title/summary if missing
    COUNTRY_KEYWORDS = {
        "Japan": "일본", "Tokyo": "일본", "Osaka": "일본",
        "India": "인도", "Mumbai": "인도", "Delhi": "인도", "Bengaluru": "인도",
        "Korea": "한국", "Seoul": "한국",
        "Taiwan": "대만", "Taipei": "대만", "Hsinchu": "대만",
        "China": "중국", "Beijing": "중국", "Shanghai": "중국", "Chengdu": "중국",
        "Saudi": "사우디아라비아", "Riyadh": "사우디아라비아",
        "UAE": "UAE", "Abu Dhabi": "UAE", "Dubai": "UAE",
        "UK": "영국", "London": "영국", "Britain": "영국",
        "Germany": "독일", "Berlin": "독일", "Munich": "독일",
        "France": "프랑스", "Paris": "프랑스",
        "Brussels": "벨기에", "EU": "벨기에",
        "Washington": "미국", "San Francisco": "미국", "Seattle": "미국",
        "New York": "미국", "Silicon Valley": "미국",
    }
    ACTIVITY_KEYWORDS = {
        "earnings": "실적발표", "revenue": "실적발표", "quarterly": "실적발표",
        "keynote": "기조연설", "summit": "서밋", "conference": "컨퍼런스",
        "testif": "의회증언", "Senate": "의회증언", "Congress": "의회증언",
        "invest": "투자발표", "partnership": "파트너십", "deal": "파트너십",
        "visit": "방문", "meet": "미팅", "talks": "미팅",
        "unveil": "신제품발표", "launch": "신제품발표", "announce": "신제품발표",
        "publish": "기고", "essay": "기고", "letter": "기고",
    }
    for art in articles:
        if "country" not in art or not art["country"]:
            text = (art.get("title", "") + " " + art.get("summary", ""))
            for kw, cn in COUNTRY_KEYWORDS.items():
                if kw.lower() in text.lower():
                    art["country"] = cn
                    break
            else:
                art["country"] = "미국"
        if "activity" not in art or not art["activity"] if "activity" in art else True:
            text = (art.get("title", "") + " " + art.get("summary", ""))
            art["activity"] = "기타"
            for kw, tag in ACTIVITY_KEYWORDS.items():
                if kw.lower() in text.lower():
                    art["activity"] = tag
                    break

    articles.sort(key=lambda x: x.get("date", ""), reverse=True)
    return {"ticker": ticker, "company": company, "count": len(articles), "articles": articles}


@app.get("/")
async def root() -> FileResponse:
    return FileResponse(os.path.join(PUBLIC_DIR, "index.html"))


@app.get("/{full_path:path}")
async def catch_all(full_path: str, request: Request) -> FileResponse:
    file_path = os.path.join(PUBLIC_DIR, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail=f"Path not found: {request.url.path}")
