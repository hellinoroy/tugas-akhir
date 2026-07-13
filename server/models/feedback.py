from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base



class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    caffeine_consumption = Column(Integer, nullable=False)
    alcohol_consumption = Column(Integer, nullable=False)
    smoking_status = Column(Integer, nullable=False)
    exercise_frequency = Column(Integer, nullable=False)
    prediction = Column(String, nullable=False)

    user = relationship("User", back_populates="feedback")