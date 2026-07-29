from pydantic import BaseModel

class TrackerRequest(BaseModel):
    wakeup: str
    bedtime: str
    sleepDuration: float
    sleepEfficiency: float
    awakenings: int
    timeInBed: float
    isGoodSleep: bool