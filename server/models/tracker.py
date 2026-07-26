from sqlalchemy import Column, Integer, Boolean, ForeignKey, String
from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Tracker(Base):
    __tablename__ = "trackers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    wakeup = Column(String, nullable=False)
    bedtime = Column(String, nullable=False)
    awakenings = Column(Integer, nullable=False)
    timeInBed = Column(Integer, nullable=False)
    isGoodSleep = Column(Boolean, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    user = relationship("User", back_populates="tracker")


    
