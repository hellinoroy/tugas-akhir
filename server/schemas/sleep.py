from pydantic import BaseModel

class TrackerRequest(BaseModel):
    wakeup: str
    bedtime: str
    awakenings: int
    timeInBed: int
    isGoodSleep: bool