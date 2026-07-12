from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from fastapi import  HTTPException, Response, status
from security import (
    hash_password,
    verify_password,
    create_token,
    check_token
)

def register(
    db: Session,
    name:str,
    email: str,
    password: str,
    dob: str,
    gender: str
) -> None :
    existing = (
        db.query(User)
            .filter(
                User.email == email
            )
            .first()
    )

    if existing:
        raise HTTPException(
            status_code=409, 
            detail="Email exists"
        )

    user = User(
        name=name,
        email=email,
        password=hash_password(password),
        dob=dob,
        gender=gender
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

def get_current_user(
    token: str,
    db,
) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    id = check_token(token)
    if not id:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == int(id)).first()

    if user is None:
        raise credentials_exception
    return {
        "name": user.name,
        "email": user.email,
        "dob": user.dob,
        "gender": user.gender
    }



