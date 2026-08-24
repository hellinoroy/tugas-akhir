from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    dob: str
    gender: str
    
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    
class UserProfileUpdate(BaseModel):
    name: str
    email: EmailStr
    dob: str
    gender: str
    