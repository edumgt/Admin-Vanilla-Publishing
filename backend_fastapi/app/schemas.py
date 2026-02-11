from datetime import date, datetime, time

from pydantic import BaseModel, ConfigDict


class TodoBase(BaseModel):
    title: str
    description: str | None = None


class TodoCreate(TodoBase):
    pass


class TodoRead(TodoBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class HotelBookingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    roomId: str
    guestName: str
    checkInDate: date
    checkOutDate: date
    arrivalTime: time | None = None
    departureTime: time | None = None
    cost: float


class MedicalReservationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    departmentId: int
    date: date
    time: time
