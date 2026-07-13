from sqlalchemy import Column, Integer,  Float, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sleep_duration = Column(Integer, nullable=False)
    awakenings = Column(Integer, nullable=False)
    sleep_efficiency = Column(Float, nullable=False)
    classification = Column(String, nullable=False)

    user = relationship("User", back_populates="feedback")
