# TODO:
#   notification/toast in frontend
#   PRIORTY the prediction stuff
#   PRIORTY them graph  
#   account page
#   guard route
#   refresh token



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas.ml import PredictionRequest
import pandas as pd
import joblib


from database import (Base, engine)

from routers.auth import (router as auth_router)
# from routers.product import (router as product_router)
# from routers.product_detail import (router as product_detail_router)
# from routers.comment import (router as comment_router)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

model = joblib.load("rf_model.joblib")
@app.post('/api/predict')
def predict(data: PredictionRequest):
    df = pd.DataFrame([data.model_dump(by_alias=True)])
    prediction = int(model.predict(df)[0])
    probability = model.predict_proba(df)[0].tolist()
    
    return { 
        "message" : "",
        "prediction": prediction,
        "probability": probability
    }


# app.include_router(product_router)
# app.include_router(product_detail_router)
# app.include_router(comment_router)