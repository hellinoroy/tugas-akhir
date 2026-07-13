from fastapi import Depends, APIRouter, status
from sqlalchemy.orm import Session
from database import get_db

from schemas.ml import PredictionRequest
from schemas.ml import FeedbackRequest
import pandas as pd
import joblib

from services.ml_service import save_feedback
from services.auth_service import (register, login, get_current_user)
from routers.auth import oauth2_scheme

router = APIRouter(
    prefix="/api/ml",
    tags=["ml"]
)

model = joblib.load("rf_model.joblib")

@router.post('/predict', status_code=status.HTTP_200_OK)
def predict(data: PredictionRequest):
    df = pd.DataFrame([data.model_dump(by_alias=True)])
    prediction = int(model.predict(df)[0])
    probability = model.predict_proba(df)[0].tolist()
    
    return { 
        "message" : "",
        "prediction": prediction,
        "probability": probability
    }


@router.post('/feedback', status_code=status.HTTP_201_CREATED)
def feedback(data: FeedbackRequest, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme),):
    return save_feedback(data, db, token);