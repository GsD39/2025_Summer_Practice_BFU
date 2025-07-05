from .. import db
from ..schedule.validators import validate_schedule_item
from datetime import datetime
from enum import Enum


class WeekType(Enum):
    UPPER = 'upper'
    LOWER = 'lower'


class Schedule(db.Model):
    __tablename__ = 'schedule'

    id = db.Column(db.Integer, primary_key=True)
    group = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    teacher = db.Column(db.String(100), nullable=False)
    room = db.Column(db.String(20), nullable=False)
    day = db.Column(db.String(10), nullable=False)  # 'monday', 'tuesday'...
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    week_type = db.Column(db.Enum(WeekType), nullable=False)

    @classmethod
    def create_batch(cls, items_data):
        items = []
        for idx, item_data in enumerate(items_data):
            errors = validate_schedule_item(item_data)
            if errors:
                raise ValueError(f"Item {idx} errors: {'; '.join(errors)}")

            item = cls(
                group=item_data['group'],
                subject=item_data['subject'],
                teacher=item_data['teacher'],
                room=item_data['room'],
                day=item_data['day'].lower(),
                start_time=datetime.strptime(item_data['start_time'], '%H:%M').time(),
                end_time=datetime.strptime(item_data['end_time'], '%H:%M').time(),
                week_type=cls.get_week_type_value(item_data['week_type'])
            )
            items.append(item)
        return items

    @staticmethod
    def get_week_type_value(week_type_str):
        """Конвертирует строку в WeekType enum"""
        if week_type_str.lower() == 'upper':
            return WeekType.UPPER
        elif week_type_str.lower() == 'lower':
            return WeekType.LOWER
        raise ValueError("week_type must be 'upper' or 'lower'")

    @staticmethod
    def get_week_type(date=None):
        """Определяет верхняя/нижняя неделя на основе даты"""
        if date is None:
            date = datetime.now().date()

        week_num = date.isocalendar()[1]
        return WeekType.UPPER if week_num % 2 == 0 else WeekType.LOWER