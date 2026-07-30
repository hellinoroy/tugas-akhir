from sqlalchemy.orm import Session
from schemas.sleep import TrackerRequest
from models.tracker import Tracker 
from datetime import datetime, timedelta, date
from sqlalchemy import text


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
    start_date: date | None = None,
    end_date: date | None = None,
):
    user_id = check_token(token)

    if end_date is None:
        end_date = date.today()

    if start_date is None:
        # default to last 30 days
        start_date = end_date - timedelta(days=29)

    offset = (page - 1) * page_size

    total = (end_date - start_date).days + 1

    items = db.execute(
        text("""
            SELECT
                COALESCE(
                    t.created_at,
                    gs.day::timestamp with time zone
                ) AS created_at,
                t.id,
                t.user_id,
                t.wakeup,
                t.bedtime,
                t."sleepDuration" AS "sleepDuration",
                t."sleepEfficiency" AS "sleepEfficiency",
                t.awakenings,
                t."timeInBed" AS "timeInBed",
                t."isGoodSleep" AS "isGoodSleep",
                t.updated_at
            FROM generate_series(
                CAST(:start_date AS DATE),
                CAST(:end_date AS DATE),
                interval '1 day'
            ) AS gs(day)
            LEFT JOIN trackers t
                ON t.user_id = :user_id
            AND DATE(t.created_at) = gs.day
            ORDER BY gs.day DESC
            LIMIT :limit
            OFFSET :offset;
        """),
        {
            "user_id": user_id,
            "start_date": start_date,
            "end_date": end_date,
            "limit": page_size,
            "offset": offset,
        },
    ).mappings().all()

    return {
        "items": [dict(row) for row in items],
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
