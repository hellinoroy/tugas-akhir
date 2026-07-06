from fastapi import (status, APIRouter, Depends)
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from schemas.auth import (RegisterRequest)
from models.user import User

from services.auth_service import (register, login, get_current_user)


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/register", status_code=status.HTTP_201_CREATED)
def create(body: RegisterRequest, db: Session = Depends(get_db)):
    return register(
        db,
        body.name,
        body.email,
        body.password,
        body.dob,
        body.gender
    )


@router.post("/login", status_code=status.HTTP_200_OK)
def signin(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return login(
        db, 
        email=form_data.username,
        password=form_data.password,
    )

@router.get("/me", status_code=status.HTTP_200_OK)
def validate(current_user: User = Depends(get_current_user)):
    return current_user