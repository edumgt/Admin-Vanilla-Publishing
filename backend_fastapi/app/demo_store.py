import json
import random
from copy import deepcopy
from datetime import date, timedelta
from pathlib import Path
from typing import Any
from uuid import uuid4


MENU_ENABLED_PAGES = [
    "system.html",
    "glos.html",
    "orgtree.html",
    "document.html",
    "wms.html",
    "calendar.html",
    "trello.html",
    "timeline.html",
    "orgni.html",
    "attend.html",
    "total.html",
    "stati.html",
    "flow.html",
    "chain.html",
    "work.html",
    "meeting.html",
    "hospital.html",
    "lectures.html",
    "city.html",
    "config.html",
    "network.html",
    "survey.html",
    "locker.html",
    "kegcode.html",
    "kegeditor.html",
    "kegeditor2.html",
    "orgsel.html",
]


class DemoStore:
    def __init__(self, repo_root: Path) -> None:
        self.repo_root = repo_root
        self.mock_dir = repo_root / "public" / "assets" / "mock"
        self.department_rows = self._load_departments()
        self.glossary_rows = self._load_glossary()
        self.glossary_requests: list[dict[str, Any]] = []
        self.members = self._build_members()
        self.menu_config = {page: True for page in MENU_ENABLED_PAGES}
        self.inbound_rows = self._build_inventory_rows("INB", "Inbound")
        self.outbound_rows = self._build_inventory_rows("OUT", "Outbound")
        self.code_groups, self.code_details = self._build_codes()
        self.site_place_rooms = self._build_site_place_rooms()
        self.calendar_date_to_id: dict[str, int] = {}
        self.calendar_id_to_date: dict[int, str] = {}
        self.calendar_events: dict[str, list[dict[str, str]]] = {}
        self._calendar_seq = 1
        self.seed_calendar()

    def _load_json(self, name: str) -> Any:
        path = self.mock_dir / name
        with path.open("r", encoding="utf-8") as file:
            return json.load(file)

    def _load_departments(self) -> list[dict[str, Any]]:
        rows = self._load_json("mock.json")
        normalized: list[dict[str, Any]] = []
        for index, row in enumerate(rows, start=1):
            item = deepcopy(row)
            item.setdefault("Key", str(uuid4()))
            item["rowKey"] = int(item.get("rowKey") or index)
            item.setdefault("useYn", "Y")
            item.setdefault("createdAt", date.today().isoformat())
            item.setdefault("_attributes", {"rowNum": item["rowKey"], "checked": False})
            normalized.append(item)
        return normalized

    def _load_glossary(self) -> list[dict[str, Any]]:
        rows = self._load_json("glos.json")
        today = date.today()
        normalized: list[dict[str, Any]] = []
        for index, row in enumerate(rows, start=1):
            normalized.append(
                {
                    "id": index,
                    "en": row.get("en", ""),
                    "ko": row.get("ko", ""),
                    "desc": row.get("desc", ""),
                    "img": row.get("img", ""),
                    "createdAt": (today - timedelta(days=index)).isoformat(),
                }
            )
        return normalized

    def _build_members(self) -> list[dict[str, Any]]:
        teams = [
            "Consulting",
            "Operations",
            "Platform",
            "Sales",
            "Support",
            "Planning",
        ]
        cities = [
            "Seoul",
            "Busan",
            "Incheon",
            "Daegu",
            "Daejeon",
            "Gwangju",
        ]
        members = []
        for index in range(1, 13):
            team = teams[(index - 1) % len(teams)]
            city = cities[(index - 1) % len(cities)]
            members.append(
                {
                    "id": f"user{index:02d}",
                    "employeeId": f"EMP-{index:04d}",
                    "name": f"Demo Member {index}",
                    "team": team,
                    "email": f"user{index:02d}@example.com",
                    "address": f"{city} Demo-ro {index * 3}",
                    "joinYear": str(2018 + (index % 6)),
                }
            )
        return members

    def _build_inventory_rows(self, prefix: str, label: str) -> list[dict[str, Any]]:
        rows = []
        today = date.today()
        for index in range(1, 26):
            rows.append(
                {
                    "id": f"{prefix}-{index:03d}",
                    "date": (today - timedelta(days=index)).isoformat(),
                    "title": f"{label} Item {index}",
                    "quantity": random.randint(5, 180),
                    "isbn": f"97889{index:07d}",
                }
            )
        return rows

    def _build_codes(self) -> tuple[list[dict[str, Any]], dict[str, list[dict[str, Any]]]]:
        groups = [
            {"groupcode": "ROOM", "groupname": "Room Codes", "enabletype": "Y", "regsitecode": "HQ"},
            {"groupcode": "DEPT", "groupname": "Department Codes", "enabletype": "Y", "regsitecode": "HQ"},
            {"groupcode": "CITY", "groupname": "City Codes", "enabletype": "Y", "regsitecode": "SEOUL"},
        ]
        details = {
            "ROOM": [
                {
                    "codevalue": "ROOM-A",
                    "codename": "Auditorium A",
                    "regemp": "system",
                    "regdate": date.today().isoformat(),
                    "remark": "Large event hall",
                },
                {
                    "codevalue": "ROOM-B",
                    "codename": "Training Room B",
                    "regemp": "system",
                    "regdate": date.today().isoformat(),
                    "remark": "Training space",
                },
            ],
            "DEPT": [
                {
                    "codevalue": "OPS",
                    "codename": "Operations",
                    "regemp": "system",
                    "regdate": date.today().isoformat(),
                    "remark": "Core operations",
                },
                {
                    "codevalue": "CS",
                    "codename": "Customer Success",
                    "regemp": "system",
                    "regdate": date.today().isoformat(),
                    "remark": "Customer support team",
                },
            ],
            "CITY": [
                {
                    "codevalue": "SEL",
                    "codename": "Seoul",
                    "regemp": "system",
                    "regdate": date.today().isoformat(),
                    "remark": "Capital city",
                },
                {
                    "codevalue": "BSN",
                    "codename": "Busan",
                    "regemp": "system",
                    "regdate": date.today().isoformat(),
                    "remark": "Port city",
                },
            ],
        }
        return groups, details

    def _build_site_place_rooms(self) -> list[dict[str, Any]]:
        rows: list[dict[str, Any]] = []
        specs = [
            ("01", "North Campus", "Main Building", 1, "Room 101", 32, 2, 4),
            ("01", "North Campus", "Main Building", 1, "Room 102", 24, 1, 2),
            ("01", "North Campus", "Annex", 2, "Lab 201", 18, 0, 1),
            ("02", "South Campus", "Tower A", 1, "Hall 301", 40, 3, 6),
            ("02", "South Campus", "Tower A", 1, "Hall 302", 28, 2, 3),
            ("02", "South Campus", "Tower B", 2, "Studio 401", 20, 1, 2),
        ]
        for ordering, (sitecode, sitename, placename, placeseq, roomname, allseat, disableseat, employeeseat) in enumerate(specs, start=1):
            rows.append(
                {
                    "sitecode": sitecode,
                    "sitename": sitename,
                    "placename": placename,
                    "placeseq": placeseq,
                    "roomname": roomname,
                    "allseat": allseat,
                    "disableseat": disableseat,
                    "employeeseat": employeeseat,
                    "timetype": "FULL",
                    "enabletype": "Y",
                    "ordering": ordering,
                    "roomment": f"{roomname} ready for demo use",
                    "sortorder": ordering,
                    "roomcolor": "#60a5fa",
                }
            )
        return rows

    def _get_or_create_calendar_date_id(self, date_key: str) -> int:
        if date_key in self.calendar_date_to_id:
            return self.calendar_date_to_id[date_key]
        date_id = self._calendar_seq
        self._calendar_seq += 1
        self.calendar_date_to_id[date_key] = date_id
        self.calendar_id_to_date[date_id] = date_key
        return date_id

    def seed_calendar(self) -> None:
        seeds = [
            ("09:00", "Sprint planning", 0),
            ("13:30", "API contract review", 1),
            ("16:00", "Demo walkthrough", 2),
        ]
        for time_value, description, offset in seeds:
            date_key = (date.today() + timedelta(days=offset)).isoformat()
            date_id = self._get_or_create_calendar_date_id(date_key)
            event_id = f"CAL-{date_id:03d}-{time_value.replace(':', '')}"
            self.add_event(date_id, time_value, description, event_id)

    def list_menu(self) -> dict[str, bool]:
        return deepcopy(self.menu_config)

    def list_members(self) -> list[dict[str, Any]]:
        return deepcopy(self.members)

    def list_departments(self) -> list[dict[str, Any]]:
        return deepcopy(self.department_rows)

    def save_department(self, payload: dict[str, Any]) -> dict[str, Any]:
        row_key = int(payload.get("rowKey") or (max(row["rowKey"] for row in self.department_rows) + 1))
        existing = next((row for row in self.department_rows if int(row["rowKey"]) == row_key), None)
        record = {
            "Key": payload.get("Key") or str(uuid4()),
            "tpCd": payload.get("tpCd", ""),
            "tpNm": payload.get("tpNm", ""),
            "descCntn": payload.get("descCntn"),
            "useYn": payload.get("useYn", "Y"),
            "createdAt": payload.get("createdAt") or date.today().isoformat(),
            "view": payload.get("view"),
            "rowKey": row_key,
            "_attributes": payload.get("_attributes")
            or {
                "rowNum": row_key,
                "checked": False,
                "disabled": False,
                "checkDisabled": False,
                "className": {"row": [], "column": {}},
            },
        }
        if existing:
            existing.update(record)
            return {"message": "Updated successfully", "type": "update"}
        self.department_rows.insert(0, record)
        return {"message": "Inserted successfully", "type": "insert"}

    def delete_departments(self, row_keys: list[int]) -> dict[str, Any]:
        targets = {int(row_key) for row_key in row_keys}
        self.department_rows = [row for row in self.department_rows if int(row["rowKey"]) not in targets]
        return {"message": "Rows deleted successfully", "deleted": sorted(targets)}

    def list_inbound(self) -> list[dict[str, Any]]:
        return deepcopy(self.inbound_rows)

    def list_outbound(self) -> list[dict[str, Any]]:
        return deepcopy(self.outbound_rows)

    def add_inventory_row(self, kind: str, payload: dict[str, Any]) -> dict[str, Any]:
        target = self.inbound_rows if kind == "inbound" else self.outbound_rows
        target.insert(
            0,
            {
                "id": payload.get("id") or f"{kind[:3].upper()}-{uuid4().hex[:8]}",
                "date": payload.get("date") or date.today().isoformat(),
                "title": payload.get("title", ""),
                "quantity": int(payload.get("quantity") or 0),
                "isbn": payload.get("isbn", ""),
            },
        )
        return {"success": True, "message": f"{kind.title()} data added successfully"}

    def update_inventory_rows(self, kind: str, updates: list[dict[str, Any]]) -> dict[str, Any]:
        target = self.inbound_rows if kind == "inbound" else self.outbound_rows
        index_map = {row["id"]: row for row in target}
        for update in updates:
            row = index_map.get(update.get("id"))
            if not row:
                continue
            for key, value in (update.get("changes") or {}).items():
                if key in {"date", "title", "quantity", "isbn"}:
                    row[key] = value
        return {"success": True, "message": f"{kind.title()} data updated"}

    def delete_inventory_rows(self, kind: str, ids: list[str]) -> dict[str, Any]:
        target = self.inbound_rows if kind == "inbound" else self.outbound_rows
        id_set = set(ids)
        kept = [row for row in target if row["id"] not in id_set]
        if kind == "inbound":
            self.inbound_rows = kept
        else:
            self.outbound_rows = kept
        return {"success": True, "message": f"Selected {kind} data deleted successfully"}

    def list_calendar(self) -> dict[str, list[str]]:
        payload: dict[str, list[str]] = {}
        for date_key, events in self.calendar_events.items():
            payload[date_key] = [
                f"{event['time']} - {event['description']} - {event['eventId']}"
                for event in events
            ]
        return payload

    def add_date(self, date_key: str) -> int:
        return self._get_or_create_calendar_date_id(date_key)

    def add_event(self, date_id: int, time_value: str, description: str, event_id: str | None) -> str:
        date_key = self.calendar_id_to_date.get(date_id)
        if not date_key:
            raise KeyError("date_id not found")
        resolved_event_id = event_id or f"CAL-{uuid4().hex[:10]}"
        event = {
            "time": time_value,
            "description": description,
            "eventId": resolved_event_id,
        }
        self.calendar_events.setdefault(date_key, [])
        if not any(item["eventId"] == resolved_event_id for item in self.calendar_events[date_key]):
            self.calendar_events[date_key].append(event)
        return resolved_event_id

    def delete_event(self, event_id: str) -> bool:
        deleted = False
        for date_key, events in list(self.calendar_events.items()):
            next_events = [event for event in events if event["eventId"] != event_id]
            if len(next_events) != len(events):
                deleted = True
            if next_events:
                self.calendar_events[date_key] = next_events
            else:
                self.calendar_events.pop(date_key, None)
        return deleted

    def list_glossary(self) -> list[dict[str, Any]]:
        return deepcopy(self.glossary_rows)

    def add_glossary(self, payload: dict[str, Any]) -> int:
        next_id = max((row["id"] for row in self.glossary_rows), default=0) + 1
        self.glossary_rows.insert(
            0,
            {
                "id": next_id,
                "en": payload.get("en", ""),
                "ko": payload.get("ko", ""),
                "desc": payload.get("desc", ""),
                "img": payload.get("img", ""),
                "createdAt": date.today().isoformat(),
            },
        )
        return next_id

    def update_glossary(self, item_id: int, payload: dict[str, Any]) -> bool:
        row = next((item for item in self.glossary_rows if item["id"] == item_id), None)
        if not row:
            return False
        row.update(
            {
                "en": payload.get("en", row["en"]),
                "ko": payload.get("ko", row["ko"]),
                "desc": payload.get("desc", row["desc"]),
                "img": payload.get("img", row["img"]),
            }
        )
        return True

    def delete_glossary(self, ids: list[int]) -> dict[str, Any]:
        id_set = {int(item_id) for item_id in ids}
        before = len(self.glossary_rows)
        self.glossary_rows = [row for row in self.glossary_rows if row["id"] not in id_set]
        deleted = before - len(self.glossary_rows)
        return {"success": True, "message": f"{deleted} rows deleted"}

    def add_glossary_request(self, glos_id: int, request_message: str) -> int:
        next_id = len(self.glossary_requests) + 1
        self.glossary_requests.append(
            {
                "id": next_id,
                "glos_id": glos_id,
                "req_msg": request_message,
                "req_date": date.today().isoformat(),
            }
        )
        return next_id

    def list_glossary_requests(self, glos_id: int) -> list[dict[str, Any]]:
        return [deepcopy(row) for row in self.glossary_requests if int(row["glos_id"]) == int(glos_id)]

    def list_api_inventory(self) -> list[dict[str, str]]:
        return [
            {"url": "/api/menu", "method": "GET", "description": "Global navigation configuration"},
            {"url": "/api/members", "method": "GET", "description": "Member list for statistics and consulting"},
            {"url": "/api/data", "method": "GET", "description": "Department grid dataset"},
            {"url": "/db/inbound", "method": "GET", "description": "Inbound inventory dataset"},
            {"url": "/db/outbound", "method": "GET", "description": "Outbound inventory dataset"},
        ]

    def list_code_groups(self) -> list[dict[str, Any]]:
        return deepcopy(self.code_groups)

    def list_codes(self, groupcode: str | None) -> list[dict[str, Any]]:
        if not groupcode:
            return []
        return deepcopy(self.code_details.get(groupcode, []))

    def list_site_place_rooms(self) -> list[dict[str, Any]]:
        return deepcopy(self.site_place_rooms)

    def query_rows(self, query: str) -> list[dict[str, Any]]:
        normalized = query.lower()
        if "inbound" in normalized:
            return self.list_inbound()
        if "outbound" in normalized:
            return self.list_outbound()
        if "member" in normalized or "employee" in normalized:
            return self.list_members()
        if "glos" in normalized:
            return self.list_glossary()
        if "code" in normalized:
            return self.list_code_groups()
        return self.list_departments()
