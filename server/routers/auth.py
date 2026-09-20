from typing import Annotated

from fastapi import Cookie, Depends, Response, APIRouter, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from schemas.auth import ForgotPasswordRequest, RegisterRequest, ResetPasswordRequest, UserProfileUpdate

from services.auth_service import (
    register, 
    login, 
    logout,
    forgot_password,
    reset_password,
    get_current_user, 
    remake_token,
    edit_profile
)

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

@router.get("/me", status_code=status.HTTP_200_OK)
def validate(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return get_current_user(token, db)

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

@router.post("/logout", status_code=status.HTTP_200_OK)
def signout(response: Response):
    return logout(response)

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return forgot_password(data, db)

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset(data: ResetPasswordRequest, token: str, db: Session = Depends(get_db)):
    return reset_password(data, token, db)

@router.post("/refresh", status_code=status.HTTP_200_OK)
def refresh(refresh_token: Annotated[str | None, Cookie()] = None):
    return remake_token(refresh_token);

@router.put('/edit-profile', status_code=status.HTTP_200_OK)
def edit(data: UserProfileUpdate,  db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return edit_profile(data, db, token);



