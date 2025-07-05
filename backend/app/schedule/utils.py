from datetime import date
from enum import Enum

class WeekType(Enum):
    UPPER = 'upper'
    LOWER = 'lower'

def get_current_week_type(reference_date=None):
    ref_date = reference_date or date.today()

    week_num = ref_date.isocalendar()[1]
    return WeekType.UPPER if week_num % 2 == 0 else WeekType.LOWER