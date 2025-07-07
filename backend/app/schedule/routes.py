from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from .. import db
from ..schedule.models import Schedule, WeekType
from ..auth.utils import admin_required, token_required

schedule_bp = Blueprint('schedule', __name__)

ORIGIN = 'http://localhost:3000'#TODO



@schedule_bp.route('/group/<group_name>', methods=['GET'])
@token_required
def get_group_schedule(group_name):
    date_str = request.args.get('date')
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str is not None else None
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    week_type = Schedule.get_week_type(date)
    day_of_week = date.strftime('%A').lower() if date is not None else None

    query = Schedule.query.filter_by(group=group_name)

    if day_of_week:
        query = query.filter_by(day=day_of_week.lower())

    schedule = query.order_by(Schedule.start_time)

    return jsonify([{
        'id': item.id,
        'subject': item.subject,
        'teacher': item.teacher,
        'room': item.room,
        'day': item.day,
        'start_time': item.start_time.strftime('%H:%M'),
        'end_time': item.end_time.strftime('%H:%M'),
        'week_type': item.week_type.value
    } for item in schedule]), 200


@schedule_bp.route('/teacher/<teacher_name>', methods=['GET'])
@token_required
def get_teacher_schedule(teacher_name):
    date_str = request.args.get('date')
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str is not None else None
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    week_type = Schedule.get_week_type(date)
    day_of_week = date.strftime('%A').lower() if date is not None else None

    query = Schedule.query.filter_by(teacher=teacher_name)

    if day_of_week:
        query = query.filter_by(day=day_of_week)

    schedule = query.order_by(Schedule.start_time)

    return jsonify([{
        'id': item.id,
        'group': item.group,
        'subject': item.subject,
        'room': item.room,
        'day': item.day,
        'start_time': item.start_time.strftime('%H:%M'),
        'end_time': item.end_time.strftime('%H:%M'),
        'week_type': item.week_type.value
    } for item in schedule]), 200


@schedule_bp.route('/', methods=['POST'])
@admin_required
def add_schedule_item():
    data = request.get_json()
    try:
        new_item = Schedule(
            group=data['group'],
            subject=data['subject'],
            teacher=data['teacher'],
            room=data['room'],
            day=data['day'].lower(),
            start_time=datetime.strptime(data['start_time'], '%H:%M').time(),
            end_time=datetime.strptime(data['end_time'], '%H:%M').time(),
            week_type=WeekType(data['week_type'])
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify({'message': 'Schedule item added', 'id': new_item.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@schedule_bp.route('/batch', methods=['POST'])
@admin_required
def add_schedule_batch():
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400

    data = request.get_json()

    items_data = data if isinstance(data, list) else data.get('items', [])

    if not items_data:
        return jsonify({'error': 'No items provided'}), 400

    if len(items_data) > 100:
        return jsonify({'error': 'Batch too large (max 100 items)'}), 400

    try:
        schedule_items = Schedule.create_batch(items_data)
        db.session.bulk_save_objects(schedule_items)
        db.session.commit()

        return jsonify({
            'message': f'{len(schedule_items)} items added successfully',
            'count': len(schedule_items)
        }), 201

    except ValueError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Batch insert failed: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@schedule_bp.route('/<int:schedule_id>', methods=['DELETE'])
@admin_required
def delete_schedule_item(schedule_id):
    try:
        item = Schedule.query.get_or_404(schedule_id)
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Schedule item deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Delete failed: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@schedule_bp.route('/admin/all', methods=['GET', "OPTIONS"])
@admin_required
def get_all_schedule():
    try:
        week_type = request.args.get('week_type')
        day = request.args.get('day')

        query = Schedule.query

        if week_type:
            query = query.filter_by(week_type=WeekType(week_type.lower()))

        if day:
            query = query.filter_by(day=day.lower())

        schedule = query.order_by(Schedule.day, Schedule.start_time).all()

        return jsonify([{
            'id': item.id,
            'group': item.group,
            'subject': item.subject,
            'teacher': item.teacher,
            'room': item.room,
            'day': item.day,
            'start_time': item.start_time.strftime('%H:%M'),
            'end_time': item.end_time.strftime('%H:%M'),
            'week_type': item.week_type.value
        } for item in schedule]), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
        
        
@schedule_bp.route('/teachers', methods=['GET', 'OPTIONS'])
@admin_required
def get_teachers():
    """Возвращает список всех преподавателей"""
    try:
        # Используем distinct для исключения дубликатов
        teachers = db.session.query(
            Schedule.teacher.distinct().label('teacher')
        ).order_by(Schedule.teacher).all()
        
        return jsonify([item.teacher for item in teachers]), 200
    
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500
        
@schedule_bp.route('/groups', methods=['GET'])
@admin_required
def get_all_groups():
    """Возвращает список всех учебных групп"""
    try:
        # Используем distinct для исключения дубликатов
        groups = db.session.query(
            Schedule.group.distinct().label('group')
        ).order_by(Schedule.group).all()
        
        return jsonify([item.group for item in groups]), 200
    
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500
    
@schedule_bp.route('/subjects', methods=['GET'])
@admin_required
def get_all_subjects():
    """Возвращает список всех учебных групп"""
    try:
        # Используем distinct для исключения дубликатов
        subjects = db.session.query(
            Schedule.group.distinct().label('subject')
        ).order_by(Schedule.subject).all()
        
        return jsonify([item.subject for item in subjects]), 200
    
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500
    
@schedule_bp.route('/<int:schedule_id>', methods=['PUT'])
@admin_required
def update_schedule_item(schedule_id):
    item = Schedule.query.get_or_404(schedule_id)
    data = request.get_json()
    
    try:
        item.group = data.get('group', item.group)
        item.subject = data.get('subject', item.subject)
        item.teacher = data.get('teacher', item.teacher)
        item.room = data.get('room', item.room)
        item.day = data.get('day', item.day).lower()
        
        if 'start_time' in data:
            item.start_time = datetime.strptime(data['start_time'], '%H:%M').time()
        if 'end_time' in data:
            item.end_time = datetime.strptime(data['end_time'], '%H:%M').time()
        if 'week_type' in data:
            item.week_type = WeekType(data['week_type'])
        
        db.session.commit()
        return jsonify({
            'message': 'Schedule item updated',
            'item': item
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400