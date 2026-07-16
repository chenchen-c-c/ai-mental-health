from flask import Blueprint
from models import User, Journal, ChatSession, ChatMessage, KnowledgeArticle
from utils.response import success
from utils.jwt import admin_required
from datetime import datetime, timedelta

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard/stats', methods=['GET'])
@admin_required
def get_stats():
    total_users = User.query.count()
    active_users = User.query.filter(User.created_at >= datetime.now() - timedelta(days=30)).count()
    total_journals = Journal.query.count()
    today_journals = Journal.query.filter(Journal.created_at >= datetime.now() - timedelta(days=1)).count()
    total_consultations = ChatSession.query.count()
    today_consultations = ChatSession.query.filter(ChatSession.created_at >= datetime.now() - timedelta(days=1)).count()
    
    avg_mood = 0
    journals = Journal.query.all()
    if journals:
        avg_mood = round(sum(j.score for j in journals) / len(journals), 1)
    
    mood_trend = []
    for i in range(6, -1, -1):
        date = (datetime.now() - timedelta(days=i)).strftime('%m-%d')
        day_journals = Journal.query.filter(
            Journal.created_at >= datetime.now() - timedelta(days=i),
            Journal.created_at < datetime.now() - timedelta(days=i-1)
        ).all()
        if day_journals:
            avg_score = round(sum(j.score for j in day_journals) / len(day_journals), 1)
        else:
            avg_score = 0
        mood_trend.append({'date': date, 'score': avg_score})
    
    consultation_chart = []
    for i in range(6, -1, -1):
        date = (datetime.now() - timedelta(days=i)).strftime('%m-%d')
        count = ChatSession.query.filter(
            ChatSession.created_at >= datetime.now() - timedelta(days=i),
            ChatSession.created_at < datetime.now() - timedelta(days=i-1)
        ).count()
        consultation_chart.append({'date': date, 'count': count})
    
    activity_trend = []
    for i in range(6, -1, -1):
        date = (datetime.now() - timedelta(days=i)).strftime('%m-%d')
        active = User.query.filter(
            User.created_at >= datetime.now() - timedelta(days=i),
            User.created_at < datetime.now() - timedelta(days=i-1)
        ).count()
        new_users = User.query.filter(
            User.created_at >= datetime.now() - timedelta(days=i),
            User.created_at < datetime.now() - timedelta(days=i-1)
        ).count()
        diary = Journal.query.filter(
            Journal.created_at >= datetime.now() - timedelta(days=i),
            Journal.created_at < datetime.now() - timedelta(days=i-1)
        ).count()
        consult = ChatSession.query.filter(
            ChatSession.created_at >= datetime.now() - timedelta(days=i),
            ChatSession.created_at < datetime.now() - timedelta(days=i-1)
        ).count()
        activity_trend.append({'date': date, 'active': active, 'new': new_users, 'diary': diary, 'consult': consult})
    
    return success({
        'totalUsers': total_users,
        'activeUsers': active_users,
        'moodDiaries': total_journals,
        'todayDiaries': today_journals,
        'consultations': total_consultations,
        'todayConsultations': today_consultations,
        'avgMood': avg_mood,
        'moodTrend': mood_trend,
        'consultationChart': consultation_chart,
        'activityTrend': activity_trend,
    })