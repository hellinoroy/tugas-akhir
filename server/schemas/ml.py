from pydantic import BaseModel

class PredictionRequest(BaseModel):
    age: int
    gender: int
    caffeine_consumption: int
    alcohol_consumption: int 
    smoking_status: int
    exercise_frequency: int

class FeedbackRequest(BaseModel):
    caffeine_consumption: int
    alcohol_consumption: int
    smoking_status: int
    exercise_frequency: int
    prediction: int