from datetime import datetime


def validate_schedule_item(item):
    errors = []

    required_fields = ['group', 'subject', 'teacher', 'room', 'day', 'start_time', 'end_time', 'week_type']
    for field in required_fields:
        if field not in item:
            errors.append(f"Missing required field: {field}")

    if 'start_time' in item and 'end_time' in item:
        try:
            start = datetime.strptime(item['start_time'], '%H:%M').time()
            end = datetime.strptime(item['end_time'], '%H:%M').time()
            if start >= end:
                errors.append("End time must be after start time")
        except ValueError:
            errors.append("Invalid time format. Use HH:MM")

    valid_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    if 'day' in item and item['day'].lower() not in valid_days:
        errors.append(f"Invalid day. Must be one of: {', '.join(valid_days)}")

    if 'week_type' in item and item['week_type'].lower() not in ['upper', 'lower']:
        errors.append("week_type must be 'upper' or 'lower'")

    return errors