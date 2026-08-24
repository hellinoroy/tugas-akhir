# TODO:
#   notification/toast in frontend
#   PRIORTY them graph 
#   account page
#   check the prediction stuff
#   theres a bug with the sleep duration post tracker, exceed 1 day ?
#   pake redis buat histogram kualitas tidur kalo rajin

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import (Base, engine)

from routers.auth import (router as auth_router)
from routers.ml import (router as ml_router)
from routers.sleep import (router as sleep_router)

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
app.include_router(ml_router)
app.include_router(sleep_router)
