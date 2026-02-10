from datetime import datetime

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
