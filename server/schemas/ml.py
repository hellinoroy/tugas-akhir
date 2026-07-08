from pydantic import BaseModel

class PredictionRequest(BaseModel):
    age: int
    gender: int
    caffeine: int
    alcohol: int 
    smoking: int
    exercise: int