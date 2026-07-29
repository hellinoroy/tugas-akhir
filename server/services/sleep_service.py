from sqlalchemy.orm import Session
from schemas.sleep import TrackerRequest
from models.tracker import Tracker 
from datetime import datetime, timedelta, time

from security import (
    check_token
)

def post_tracker(
    data: TrackerRequest,
    db: Session,
    token: str    
): 
    user_id = check_token(token)

    tracker = Tracker(
        user_id=int(user_id),
        wakeup = data.wakeup,
        bedtime = data.bedtime,
        sleepDuration = data.sleepDuration,
        sleepEfficiency = data.sleepEfficiency,
        awakenings = data.awakenings,
        timeInBed = data.timeInBed,
        isGoodSleep = data.isGoodSleep 
    )

    db.add(tracker)
    db.commit()
    return {
        "message": "Daily sleep tracked"
    }


def get_today_tracker(
    db: Session,
    token: str        
):

    today = datetime.now().date()
    start = datetime.combine(today, datetime.min.time())
    end = start + timedelta(days=1)
    user_id = check_token(token)

    return (
        db.query(Tracker)
        .filter(
            Tracker.user_id == user_id,
            Tracker.created_at >= start,
            Tracker.created_at < end,
        )
        .first()
    )


def get_tracker(
    db: Session,
    token: str,
    page: int = 1,
    page_size: int = 10,
    start_date=None,
    end_date=None,
):
    user_id = check_token(token)

    query = (
        db.query(Tracker)
        .filter(Tracker.user_id == user_id)
    )

    if start_date:
        start_dt = datetime.combine(start_date, time.min)
        query = query.filter(Tracker.created_at >= start_dt)

    if end_date:
        end_dt = datetime.combine(end_date, time.max)
        query = query.filter(Tracker.created_at <= end_dt)

    total = query.count()

    items = (
        query.order_by(Tracker.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


def post_tracker_test(
    data: TrackerRequest,
    db: Session,
    token: str,
    days_offset: int,
):
    user_id = check_token(token)

    tracker = Tracker(
        user_id=int(user_id),
        wakeup=data.wakeup,
        bedtime=data.bedtime,
        sleepDuration = data.sleepDuration,
        sleepEfficiency = data.sleepEfficiency,
        awakenings=data.awakenings,
        timeInBed=data.timeInBed,
        isGoodSleep=data.isGoodSleep,
        created_at=datetime.now() + timedelta(days=days_offset),
    )

    db.add(tracker)
    db.commit()

    return {
        "message": f"Sleep tracked {days_offset} day(s) from now"
    }
