from sqlalchemy import Column, Integer, ForeignKey, String, text
from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Token(Base):
    __tablename__ = "token"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String, nullable=False)
    exp = Column(
        DateTime(timezone=True),
        server_default=func.now() + text("INTERVAL '10 minutes'"),
        nullable=False,
    )

    user = relationship("User", back_populates="token")