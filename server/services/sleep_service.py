from sqlalchemy.orm import Session
from schemas.sleep import TrackerRequest
from models.tracker import Tracker 
from datetime import datetime, timedelta, date
from sqlalchemy import select, text, func, cast, Date
# tidak ada role admin

from security import (
    check_token
)

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
            cast(Tracker.wakeup, Date) >= start,
            cast(Tracker.wakeup, Date) < end
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

    offset = (page - 1) * page_size

    query = (
        select(Tracker)
        .where(Tracker.user_id == user_id)
    )

    if start_date is not None:
        query = query.where(
            func.date(Tracker.bedtime) >= start_date
        )

    if end_date is not None:
        query = query.where(
            func.date(Tracker.bedtime) <= end_date
        )

    total = db.scalar(
        select(func.count())
        .select_from(query.subquery())
    )

    items = (
        db.scalars(
            query
            .order_by(Tracker.bedtime.desc())
            .offset(offset)
            .limit(page_size)
        )
        .all()
    )

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }

def get_weekly_summary_service(
    db: Session,
    token: str,
):
    user_id = check_token(token)

    today = datetime.now().date()
    start_date = today - timedelta(days=7)

    latest_per_day = (
        db.query(
            func.date(Tracker.created_at).label("date"),
            func.max(Tracker.created_at).label("latest_created_at"),
        )
        .filter(
            Tracker.user_id == user_id,
            Tracker.created_at >= start_date,
            Tracker.created_at < today,
        )
        .group_by(func.date(Tracker.created_at))
        .subquery()
    )

    trackers = (
        db.query(Tracker)
        .join(
            latest_per_day,
            (func.date(Tracker.created_at) == latest_per_day.c.date)
            & (Tracker.created_at == latest_per_day.c.latest_created_at),
        )
        .filter(Tracker.user_id == user_id)
        .order_by(Tracker.created_at.asc())
        .all()
    )

    if not trackers:
        return {
            "summary": {
                "average_sleep": 0,
                "good_days": 0,
                "poor_days": 0,
                "average_awakenings": 0,
            },
            "daily": [],
        }

    total_sleep = sum(t.sleepDuration for t in trackers)
    total_awakenings = sum(t.awakenings for t in trackers)

    good_days = sum(
        1 for t in trackers
        if t.isGoodSleep
    )

    poor_days = len(trackers) - good_days

    return {
        "summary": {
            "average_sleep": round(
                total_sleep / len(trackers),
                2
            ),
            "good_days": good_days,
            "poor_days": poor_days,
            "average_awakenings": round(
                total_awakenings / len(trackers),
                2
            ),
        },
        "daily": [
            {
                "date": tracker.created_at.date(),
                "sleep_duration": tracker.sleepDuration,
                "awakenings": tracker.awakenings,
                "is_good_sleep": tracker.isGoodSleep,
            }
            for tracker in trackers
        ],
    }

def get_sleep_quality_by_age (
    db: Session,
): 
    items = db.execute(
        text("""
            WITH latest_trackers AS (
                SELECT DISTINCT ON (user_id)
                    user_id,
                    "isGoodSleep",
                    created_at
                FROM trackers
                ORDER BY user_id, created_at DESC
            ),
            user_ages AS (
                SELECT
                    id,
                    EXTRACT(YEAR FROM AGE(dob))::int AS age
                FROM users
            )
            SELECT
                ua.age,

                COUNT(*) FILTER (
                    WHERE lt."isGoodSleep" = true
                ) AS "goodSleep",

                COUNT(*) FILTER (
                    WHERE lt."isGoodSleep" = false
                ) AS "badSleep"

            FROM latest_trackers lt
            JOIN user_ages ua
                ON ua.id = lt.user_id

            GROUP BY ua.age
            ORDER BY ua.age;
        """)
    ).mappings().all()
 
    return {
        "data": items,
    }

def get_sleep_quality_by_gender (
    db: Session,
): 
    items = db.execute(
        text("""
            WITH latest_trackers AS (
                SELECT DISTINCT ON (user_id)
                    user_id,
                    "isGoodSleep",
                    created_at
                FROM trackers
                ORDER BY user_id, created_at DESC
            )
            SELECT
                u.gender,

                COUNT(*) FILTER (
                    WHERE lt."isGoodSleep" = true
                ) AS "goodSleep",

                COUNT(*) FILTER (   
                    WHERE lt."isGoodSleep" = false
                ) AS "badSleep"

            FROM latest_trackers lt
            JOIN users u
                ON u.id = lt.user_id

            GROUP BY u.gender
            ORDER BY u.gender;
        """)
    ).mappings().all()


    return {
        "data": items,
    }

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
        isGoodSleep = data.isGoodSleep,
        created_at = data.created_at
    )

    db.add(tracker)
    db.commit()
    return {
        "message": "Daily sleep tracked"
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

def put_tracker(
    db: Session,
    token: str,
    id: int,
    data: TrackerRequest,
):
    user_id = check_token(token)

    tracker = (
        db.query(Tracker)
        .filter(
            Tracker.id == id,
            Tracker.user_id == user_id,
        )
        .first()
    )

    if not tracker:
        return None

    tracker.wakeup = data.wakeup
    tracker.bedtime = data.bedtime
    tracker.sleepDuration = data.sleepDuration
    tracker.sleepEfficiency = data.sleepEfficiency
    tracker.awakenings = data.awakenings
    tracker.timeInBed = data.timeInBed
    tracker.isGoodSleep = data.isGoodSleep

    db.commit()
    db.refresh(tracker)

    return {
        "message": "Sleep tracker updated" 
    }

def delete_tracker(
    db: Session,
    token: str,
    id: int
):
    user_id = check_token(token)

    tracker = (
        db.query(Tracker)
        .filter(
            Tracker.user_id == user_id,
            Tracker.id == id
        )
        .first()
    )

    if not tracker:
        return None

    db.delete(tracker)
    db.commit()

    return {
        "message": "Tracker deleted successfully",
    }
