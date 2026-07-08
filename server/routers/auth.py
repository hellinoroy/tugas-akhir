from fastapi import Depends, Response, APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from schemas.auth import RegisterRequest

from services.auth_service import (register, login, get_current_user)

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

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
def signin(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db), ):
    return login(
        response,
        db,
        email=form_data.username,
        password=form_data.password,
    )

@router.get("/me", status_code=status.HTTP_200_OK)
def validate(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db),):
    return get_current_user(token, db)