from fastapi import Depends, Response, APIRouter, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from schemas.auth import RegisterRequest

from services.auth_service import (register, login, get_current_user)

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

@router.post("/register", status_code=status.HTTP_201_CREATED)
def create(data: RegisterRequest, db: Session = Depends(get_db)):
    return register(
        db,
        data
    )

@router.post("/login", status_code=status.HTTP_200_OK)
def signin(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db), ):
    return login(
        response,
        db,
        email=form_data.username,
        password=form_data.password,
    )

@router.get("/me", status_code=status.HTTP_200_OK)
def validate(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return get_current_user(token, db)