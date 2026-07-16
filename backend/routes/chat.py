from flask import Blueprint, request
from models import ChatSession, ChatMessage
from extensions import db
from utils.response import success, error, not_found
from utils.jwt import auth_required, admin_required
from datetime import datetime

chat_bp = Blueprint('chat', __name__)

def get_emotion_from_message(content):
    content = content.lower()
    if any(keyword in content for keyword in ['难过', '伤心', '悲伤', '想哭', '不开心']):
        return 'sad'
    if any(keyword in content for keyword in ['焦虑', '担心', '害怕', '不安', '紧张']):
        return 'anxious'
    if any(keyword in content for keyword in ['生气', '愤怒', '烦', '讨厌', '恨']):
        return 'angry'
    if any(keyword in content for keyword in ['开心', '高兴', '快乐', '幸福']):
        return 'happy'
    if '好' in content and '不好' not in content:
        return 'happy'
    return 'neutral'

@chat_bp.route('/chat/sessions', methods=['GET'])
@auth_required
def get_sessions():
    user = request.user
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    if user.role == 'admin':
        query = ChatSession.query
    else:
        query = ChatSession.query.filter_by(user_id=user.id)
    
    sessions = query.order_by(ChatSession.created_at.desc()).paginate(page=page, per_page=per_page)
    
    return success({
        'list': [s.to_dict() for s in sessions.items],
        'total': sessions.total,
        'page': sessions.page,
        'per_page': sessions.per_page,
        'pages': sessions.pages,
    })

@chat_bp.route('/chat/sessions/<int:id>', methods=['GET'])
@auth_required
def get_session(id):
    user = request.user
    session = ChatSession.query.get(id)
    
    if not session:
        return not_found('会话不存在')
    
    if user.role != 'admin' and session.user_id != user.id:
        return error('无权查看该会话', 403)
    
    messages = ChatMessage.query.filter_by(session_id=id).order_by(ChatMessage.timestamp).all()
    
    return success({
        'session': session.to_dict(),
        'messages': [m.to_dict() for m in messages],
    })

@chat_bp.route('/chat/send', methods=['POST'])
@auth_required
def send_message():
    user = request.user
    data = request.get_json()
    
    content = data.get('content')
    session_id = data.get('session_id')
    
    if not content:
        return error('消息内容不能为空')
    
    if session_id:
        session = ChatSession.query.get(session_id)
        if not session or session.user_id != user.id:
            session = None
    else:
        session = None
    
    if not session:
        emotion = get_emotion_from_message(content)
        preview = content[:100] if len(content) > 100 else content
        
        session = ChatSession(
            user_id=user.id,
            emotion=emotion,
            preview=preview,
            message_count=0,
        )
        db.session.add(session)
        db.session.flush()
    
    user_message = ChatMessage(
        session_id=session.id,
        user_id=user.id,
        type='user',
        content=content,
        timestamp=datetime.now(),
    )
    db.session.add(user_message)
    
    ai_replies = {
        'sad': ['我很抱歉听到你现在感到难过。悲伤是一种正常的情绪，给自己一些时间和空间去感受它。', '难过的时候，不要强迫自己马上好起来。我在这里陪着你。'],
        'anxious': ['焦虑就像一个警报器，提醒我们有些事情需要关注。让我们一起深呼吸，慢慢放松下来。', '我理解你现在感到不安和担忧。试着把注意力集中在当下。'],
        'angry': ['生气是一种很有力量的情绪，它在告诉我们有些东西需要改变。允许自己感受愤怒，但不要被它控制。', '我理解你现在很生气，这种感觉一定很不好受。'],
        'happy': ['听到你感到开心，我也很为你高兴！快乐是很珍贵的礼物，好好享受当下的美好时刻。', '你的快乐感染了我！分享快乐会让快乐加倍。'],
        'neutral': ['谢谢你愿意和我分享这些，我在这里认真倾听。你的感受很重要，每一种情绪都值得被看见和理解。', '我能感受到你现在的情绪，这是很正常的反应。'],
    }
    
    emotion = session.emotion
    ai_content = ai_replies.get(emotion, ai_replies['neutral'])[0]
    
    ai_message = ChatMessage(
        session_id=session.id,
        user_id=user.id,
        type='ai',
        content=ai_content,
        timestamp=datetime.now(),
    )
    db.session.add(ai_message)
    
    session.message_count = ChatMessage.query.filter_by(session_id=session.id).count()
    session.preview = content[:100] if len(content) > 100 else content
    
    db.session.commit()
    
    return success({
        'session': session.to_dict(),
        'user_message': user_message.to_dict(),
        'ai_message': ai_message.to_dict(),
    }, '消息发送成功')

@chat_bp.route('/chat/sessions/<int:id>', methods=['DELETE'])
@auth_required
def delete_session(id):
    user = request.user
    session = ChatSession.query.get(id)
    
    if not session:
        return not_found('会话不存在')
    
    if user.role != 'admin' and session.user_id != user.id:
        return error('无权删除该会话', 403)
    
    ChatMessage.query.filter_by(session_id=id).delete()
    db.session.delete(session)
    db.session.commit()
    
    return success(None, '会话删除成功')