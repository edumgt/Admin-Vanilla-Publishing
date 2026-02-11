from collections import defaultdict
from datetime import date, time

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import HotelBooking, MedicalReservation, Todo
from .schemas import MedicalReservationRead, TodoCreate, TodoRead

app = FastAPI(title="NewHomePage FastAPI Backend", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    db = next(get_db())
    try:
        seed_hotel_bookings(db)
        seed_medical_reservations(db)
        db.commit()
    finally:
        db.close()


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


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
