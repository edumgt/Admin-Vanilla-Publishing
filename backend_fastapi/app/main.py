from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import Todo
from .schemas import TodoCreate, TodoRead

app = FastAPI(title="NewHomePage FastAPI Backend", version="1.0.0")


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


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
