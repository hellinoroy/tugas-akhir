from pydantic import BaseModel

class TrackerRequest(BaseModel):
    wakeup: str
    bedtime: str
    awakenings: int
    timeInBed: float
    isGoodSleep: bool