import os

from sqlalchemy import func
from sqlalchemy.orm import Session
from models.user import User
from schemas.auth import ForgotPasswordRequest, RegisterRequest, ResetPasswordRequest, UserProfileUpdate
from fastapi import  HTTPException, Response, status
import secrets
import smtplib
from email.message import EmailMessage
from security import (
    hash_password,
    verify_password,
    create_token,
    check_token
)
from models.forgot_password import ForgotPassword

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


def register(
    db: Session,
    data: RegisterRequest
) :
    existing = (
        db.query(User)
            .filter(
                User.email == data.email
            )
            .first()
    )

    if existing:
        raise HTTPException(
            status_code=409, 
            detail="Email exists"
        )

    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        dob=data.dob,
        gender=data.gender
    )

    db.add(user)
    db.commit()

    return {
        "message": "User created"
    }

def login(
    response: Response,
    db: Session,
    email: str,
    password: str
):
    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    refresh_token = create_token(
        {"sub": str(user.id)},
        3600
    )

    access_token = create_token({
        "sub": str(user.id)
    })

    response.set_cookie(
        key="refresh_token", 
        value=refresh_token,     
        httponly=True,
        secure=False, 
        samesite="lax"
    )

    return {
        "message": "Login success",
        "access_token": access_token
    }

def logout(response: Response):
    response.delete_cookie(
        key="refresh_token",
        path="/",
    )
    return {"message": "Logged out"}

def forgot_password(data: ForgotPasswordRequest, db: Session):

    user = (
        db.query(User)
            .filter(
                User.email == data.email
            )
            .first()
    )

    if not user:
        return 

    if user: 
        existing = (
            db.query(ForgotPassword)
                .filter(
                    ForgotPassword.user_id == user.id 
                )
                .all()
        )

        for row in existing:
            db.delete(row)

    token = secrets.token_urlsafe(32)
    forgot_password = ForgotPassword(
        user_id=user.id,
        token=token,
    )

    db.add(forgot_password)
    db.commit()

    reset_link = f"http://localhost:5173/reset-password?token={token}"
    
    message = EmailMessage()
    message["From"] = SMTP_USER
    message["To"] = data.email
    message["Subject"] = "Password Reset"
    message.set_content(
        f"""
           Hello {user.name},

            You requested to reset your password.

            Click the link below:

            {reset_link}

            This link will expire in 10 minutes.

            If you did not request this, you can ignore this email.

            Regards,
            SleepTrack
        """
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(message)

    return

def reset_password(data: ResetPasswordRequest, token: str, db: Session):
    db_token = (
        db.query(ForgotPassword)
        .filter(
            ForgotPassword.token == token,
            ForgotPassword.exp > func.now()
        )
        .first()
    )

    if not db_token:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token"
        )

    user = (
        db.query(User)
            .filter(
                User.id == db_token.user_id
            )
            .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    db.delete(db_token)
    user.password = hash_password(data.password)

    db.commit()
    return {
        "message": "Password changed"
    }

def edit_profile(
    data: UserProfileUpdate,
    db: Session,
    token: str
):
    user_id = check_token(token)
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.name = data.name
    user.email = data.email
    user.gender = data.gender
    user.dob = data.dob

    db.commit()
    return {
        "message": "User updated"
    }

def get_current_user(
    token: str,
    db,
) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="invalid_user",
        headers={"WWW-Authenticate": "Bearer"},
    )

    id = check_token(token)
    
    user = db.query(User).filter(User.id == int(id)).first()

    if user is None:
        raise credentials_exception
    return {
        "name": user.name,
        "email": user.email,
        "dob": user.dob,
        "gender": user.gender
    }

def remake_token(refresh_token):
    id = check_token(refresh_token)
    access_token = create_token({
        "sub": str(id)
    })

    return {
        "message": "Refresh token success",
        "access_token": access_token
    }