from fastapi import Cookie, Depends, Response, APIRouter, status
from sqlalchemy.orm import Session
from schemas.sleep import TrackerRequest
from database import get_db
from services.sleep_service import track_sleep, get_today_tracker
from routers.auth import oauth2_scheme


router = APIRouter(
    prefix="/api/sleep",
    tags=["sleep"]
)

@router.get('/check-today-tracker', status_code=status.HTTP_200_OK)
def check(db:Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return get_today_tracker(db, token)

@router.post('/tracker', status_code=status.HTTP_201_CREATED)
def track(data: TrackerRequest, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return track_sleep(data, db, token)