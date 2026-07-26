from sqlalchemy.orm import Session
from models.feedback import Feedback 

from security import (
    check_token
)

from schemas.ml import FeedbackRequest

def save_feedback(
    data: FeedbackRequest,
    db: Session,
    token: str    
): 
    user_id = check_token(token)

    feedback = Feedback(
        user_id=int(user_id),
        caffeine_consumption=data.caffeine_consumption,
        alcohol_consumption=data.alcohol_consumption,
        smoking_status=data.smoking_status,
        exercise_frequency=data.exercise_frequency,
        prediction=data.prediction
    )

    db.add(feedback)
    db.commit()
    return {
        "message": "Feedback created"
    }


