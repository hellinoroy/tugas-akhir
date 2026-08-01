from fastapi import Cookie, Depends, HTTPException, Response, APIRouter, status
from sqlalchemy.orm import Session
from schemas.sleep import TrackerRequest
from database import get_db
from services.sleep_service import delete_tracker, post_tracker, get_today_tracker, post_tracker_test, get_tracker, put_tracker_service
from routers.auth import oauth2_scheme
from datetime import date
from fastapi import Query

router = APIRouter(
    prefix="/api/sleep",
    tags=["sleep"]
)

@router.get('/tracker', status_code=status.HTTP_200_OK)
def get_user_tracker(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    start_date: date | None = None,
    end_date: date | None = None,
):
    return get_tracker(
        db=db,
        token=token,
        page=page,
        page_size=page_size,
        start_date=start_date,
        end_date=end_date,
    )

@router.get('/check-today-tracker', status_code=status.HTTP_200_OK)
def check(db:Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return get_today_tracker(db, token)

@router.post('/tracker', status_code=status.HTTP_201_CREATED)
def daily_tracker(data: TrackerRequest, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return post_tracker(data, db, token)

@router.post("/tracker/test/{days_offset}", status_code=status.HTTP_201_CREATED)
def track_test(
    days_offset: int,
    data: TrackerRequest,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    return post_tracker_test(data, db, token, days_offset)


@router.put("/tracker/{id}", status_code=status.HTTP_200_OK)
def update_tracker(
    id: int,
    data: TrackerRequest,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    tracker = put_tracker_service(db, token, id, data)

    if not tracker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracker not found",
        )

    return tracker

@router.delete("/tracker/{id}")
def delete_tracker_route(
    id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    tracker = delete_tracker(db, token, id)

    if not tracker:
        raise HTTPException(
            status_code=404,
            detail="Tracker not found"
        )

    return {
        "message": "Tracker deleted successfully",
        "id": id
    }