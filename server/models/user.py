from sqlalchemy import Column, Integer, String, Date
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    name = Column(String(100), nullable=False)

    email = Column(String(255), unique=True, nullable=False)

    password = Column(String, nullable=False)  # hashed password

    dob = Column(Date, nullable=False)

    gender = Column(String(10), nullable=False)