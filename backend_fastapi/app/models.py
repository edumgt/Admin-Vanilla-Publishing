from sqlalchemy import Date, DateTime, Integer, Numeric, String, Time, func
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class Todo(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class HotelBooking(Base):
    __tablename__ = "hotel_bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    room_id: Mapped[str] = mapped_column(String(20), index=True, nullable=False)
    guest_name: Mapped[str] = mapped_column(String(120), nullable=False)
    check_in_date: Mapped[Date] = mapped_column(Date, nullable=False)
    check_out_date: Mapped[Date] = mapped_column(Date, nullable=False)
    arrival_time: Mapped[Time | None] = mapped_column(Time, nullable=True)
    departure_time: Mapped[Time | None] = mapped_column(Time, nullable=True)
    cost: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)


class MedicalReservation(Base):
    __tablename__ = "medical_reservations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    department_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    date: Mapped[Date] = mapped_column(Date, nullable=False)
    time: Mapped[Time] = mapped_column(Time, nullable=False)
