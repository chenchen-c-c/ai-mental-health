from flask import Blueprint
from extensions import db
from models import User, Journal, ChatSession, ChatMessage, KnowledgeArticle
from utils.response import success
from utils.jwt import admin_required
from datetime import datetime, timedelta

dashboard_bp = Blueprint('dashboard', __name__)

def get_day_bounds(days_ago=0):
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    start_date = today - timedelta(days=days_ago)
    end_date = start_date + timedelta(days=1)
    return start_date, end_date

def get_mood_trend_data():
    trend = []
    for i in range(6, -1, -1):
        start_date, end_date = get_day_bounds(i)
        date = start_date.strftime('%m-%d')
        day_journals = Journal.query.filter(
            Journal.created_at >= start_date,
            Journal.created_at < end_date
        ).all()
        if day_journals:
            avg_score = round(sum(j.score for j in day_journals) / len(day_journals), 1)
        else:
            avg_score = 0
        trend.append({'date': date, 'score': avg_score})
    return trend

def get_chat_stat_data():
    stat = []
    for i in range(6, -1, -1):
        start_date, end_date = get_day_bounds(i)
        date = start_date.strftime('%m-%d')
        count = ChatSession.query.filter(
            ChatSession.created_at >= start_date,
            ChatSession.created_at < end_date
        ).count()
        stat.append({'date': date, 'count': count})
    return stat

def get_user_activity_data():
    activity = []
    for i in range(6, -1, -1):
        start_date, end_date = get_day_bounds(i)
        date = start_date.strftime('%m-%d')
        new_users = User.query.filter(
            User.created_at >= start_date,
            User.created_at < end_date
        ).count()
        diary = Journal.query.filter(
            Journal.created_at >= start_date,
            Journal.created_at < end_date
        ).count()
        consult = ChatSession.query.filter(
            ChatSession.created_at >= start_date,
            ChatSession.created_at < end_date
        ).count()
        activity.append({'date': date, 'active': new_users + diary + consult, 'new': new_users, 'diary': diary, 'consult': consult})
    return activity

@dashboard_bp.route('/dashboard/total', methods=['GET'])
@admin_required
def get_total_stats():
    total_users = User.query.count()
    total_journals = Journal.query.count()
    total_consultations = ChatSession.query.count()
    
    avg_mood = 0
    avg_result = db.session.query(db.func.avg(Journal.score)).scalar()
    if avg_result is not None:
        avg_mood = round(avg_result, 1)
    
    return success({
        'total_users': total_users,
        'total_journals': total_journals,
        'total_consultations': total_consultations,
        'avg_mood_score': avg_mood,
    })

@dashboard_bp.route('/dashboard/mood-trend', methods=['GET'])
@admin_required
def get_mood_trend():
    trend = get_mood_trend_data()
    return success({'data': trend})

@dashboard_bp.route('/dashboard/chat-stat', methods=['GET'])
@admin_required
def get_chat_stat():
    stat = get_chat_stat_data()
    return success({'data': stat})

@dashboard_bp.route('/dashboard/user-active', methods=['GET'])
@admin_required
def get_user_active():
    activity = get_user_activity_data()
    return success({'data': activity})

@dashboard_bp.route('/dashboard/stats', methods=['GET'])
@admin_required
def get_stats():
    total_users = User.query.count()
    active_users = User.query.filter(User.created_at >= datetime.now() - timedelta(days=30)).count()
    total_journals = Journal.query.count()
    today_start, today_end = get_day_bounds(0)
    today_journals = Journal.query.filter(
        Journal.created_at >= today_start,
        Journal.created_at < today_end
    ).count()
    total_consultations = ChatSession.query.count()
    today_consultations = ChatSession.query.filter(
        ChatSession.created_at >= today_start,
        ChatSession.created_at < today_end
    ).count()
    
    avg_mood = 0
    avg_result = db.session.query(db.func.avg(Journal.score)).scalar()
    if avg_result is not None:
        avg_mood = round(avg_result, 1)
    
    chat_stat_data = get_chat_stat_data()
    total_chats = sum(item['count'] for item in chat_stat_data)
    
    return success({
        'totalUsers': total_users,
        'activeUsers': active_users,
        'moodDiaries': total_journals,
        'todayDiaries': today_journals,
        'consultations': total_consultations,
        'todayConsultations': today_consultations,
        'avgMood': avg_mood,
        'moodTrend': get_mood_trend_data(),
        'consultationStats': {
            'total': total_chats,
            'avgDuration': 0,
            'activeUsers': active_users,
        },
        'consultationChart': chat_stat_data,
        'activityTrend': get_user_activity_data(),
    })