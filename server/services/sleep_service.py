from sqlalchemy.orm import Session
from schemas.sleep import TrackerRequest
from models.tracker import Tracker 
from models.user import User
from datetime import datetime, timedelta

from security import (
    check_token
)

def track_sleep(
    data: TrackerRequest,
    db: Session,
    token: str    
): 
    user_id = check_token(token)

    tracker = Tracker(
        user_id=int(user_id),
        wakeup = data.wakeup,
        bedtime = data.bedtime,
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

def get_previous_7_days_tracker(
    db: Session,
    token: str
):
    today = datetime.now().date()

    start = datetime.combine(today - timedelta(days=7), datetime.min.time())
    end = datetime.combine(today, datetime.min.time())

    user_id = check_token(token)

    return (
        db.query(Tracker)
        .filter(
            Tracker.user_id == user_id,
            Tracker.created_at >= start,
            Tracker.created_at < end,
        )
        .order_by(Tracker.created_at.desc())
        .all()
    )


def track_sleep_test(
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
