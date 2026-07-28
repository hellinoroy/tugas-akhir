from fastapi import Cookie, Depends, Response, APIRouter, status
from sqlalchemy.orm import Session
from schemas.sleep import TrackerRequest
from database import get_db
from services.sleep_service import track_sleep, get_today_tracker, track_sleep_test, get_previous_7_days_tracker
from routers.auth import oauth2_scheme


router = APIRouter(
    prefix="/api/sleep",
    tags=["sleep"]
)

@router.get('/check-today-tracker', status_code=status.HTTP_200_OK)
def check(db:Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return get_today_tracker(db, token)

@router.get('/weekly', status_code=status.HTTP_200_OK)
def weekly_tracker(db:Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return get_previous_7_days_tracker(db, token) 

@router.post('/tracker', status_code=status.HTTP_201_CREATED)
def daily_tracker(data: TrackerRequest, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return track_sleep(data, db, token)

@router.post("/tracker/test/{days_offset}", status_code=status.HTTP_201_CREATED)
def track_test(
    days_offset: int,
    data: TrackerRequest,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    return track_sleep_test(data, db, token, days_offset)