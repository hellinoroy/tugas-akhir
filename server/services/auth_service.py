from sqlalchemy.orm import Session
from models.user import User
from schemas.auth import RegisterRequest
from fastapi import  HTTPException, Response, status
from security import (
    hash_password,
    verify_password,
    create_token,
    check_token
)

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