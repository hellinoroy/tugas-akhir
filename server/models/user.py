from sqlalchemy import Column, Integer, String, Date, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    email_verified = Column(
        Boolean,
        nullable=False,
        server_default="false",
    )
    password = Column(String, nullable=False)  # hashed password
    dob = Column(Date, nullable=False)
    gender = Column(String(10), nullable=False)

    feedback = relationship("Feedback", back_populates="user")
    tracker = relationship("Tracker", back_populates="user")
    token = relationship("Token", back_populates="user")

