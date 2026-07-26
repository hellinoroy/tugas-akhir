# TODO:
#   notification/toast in frontend
#   PRIORTY the prediction stuff
#   PRIORTY them graph  
#   account page
#   guard route
#   refresh token



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import (Base, engine)

from routers.auth import (router as auth_router)
from routers.ml import (router as ml_router)
from routers.sleep import (router as sleep_router)
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
app.include_router(ml_router)
app.include_router(sleep_router)
# app.include_router(product_detail_router)
# app.include_router(comment_router)